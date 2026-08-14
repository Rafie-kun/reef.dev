// GET  /api/data — public read of the CMS JSON (sensitive fields stripped).
// POST /api/data — admin-only write; requires a valid session token.
//
// Storage: Vercel KV first, then Blob. Falls back to "not stored" when neither
// is configured (the client keeps a localStorage copy).
import {
  applyCors, handlePreflight, readJson, rateLimit, requireAuth, getKV, getBlob,
} from './_lib.js';

const BLOB_KEY = 'reef-cms.json';
const KV_KEY = 'reef-cms';
const MAX_BODY_BYTES = 512 * 1024; // 512 KB ceiling on CMS payloads

// Fields that must never be written into, or served from, the public CMS blob.
const SENSITIVE_FIELDS = ['adminPw', 'adminPwHash', 'password', 'pw'];

// Recursively drop sensitive keys so a nested secret can never be stored in, or
// served from, the public CMS blob.
function stripSensitive(obj) {
  if (Array.isArray(obj)) return obj.map(stripSensitive);
  if (!obj || typeof obj !== 'object') return obj;
  const clone = {};
  for (const [k, v] of Object.entries(obj)) {
    if (SENSITIVE_FIELDS.includes(k)) continue;
    clone[k] = v && typeof v === 'object' ? stripSensitive(v) : v;
  }
  return clone;
}

export default async function handler(req, res) {
  // Only the authenticated cross-origin POST triggers a preflight; simple GETs
  // do not. So the preflight uses the restrictive same-origin policy, while the
  // GET branch below opts into a wildcard for public embedding.
  if (handlePreflight(req, res, { methods: 'GET, POST, OPTIONS' })) return;

  try {
    if (req.method === 'GET') {
      // Public read — generous limit, wildcard CORS so any page can embed it.
      if (!(await rateLimit(req, res, { bucket: 'data-get', limit: 120, windowSec: 60 }))) return;
      applyCors(req, res, { methods: 'GET, POST, OPTIONS', wildcard: true });
      res.setHeader('Cache-Control', 'no-store');

      const kv = await getKV();
      const blob = await getBlob();
      let data = null;

      if (kv) {
        const v = await kv.get(KV_KEY);
        if (v) { try { data = typeof v === 'string' ? JSON.parse(v) : v; } catch { data = v; } }
      }
      if (!data && blob) {
        try {
          const { url } = await blob.head(BLOB_KEY);
          if (url) { const r = await fetch(url); if (r.ok) data = await r.json(); }
        } catch { /* no blob yet */ }
      }

      res.status(200).json(data ? stripSensitive(data) : { msg: 'No data stored yet' });
      return;
    }

    if (req.method === 'POST') {
      // Admin-only write. Auth first, then rate limit, then validate.
      applyCors(req, res, { methods: 'GET, POST, OPTIONS' });
      if (!(await requireAuth(req))) { res.status(401).json({ error: 'Unauthorized' }); return; }
      if (!(await rateLimit(req, res, { bucket: 'data-post', limit: 20, windowSec: 60 }))) return;

      const body = readJson(req);
      if (body === null) { res.status(400).json({ error: 'Invalid JSON body' }); return; }
      if (!body || typeof body !== 'object' || Array.isArray(body)) {
        res.status(400).json({ error: 'Body must be a JSON object' });
        return;
      }

      // Never let the client persist secrets into the public blob.
      const clean = stripSensitive(body);
      const payload = JSON.stringify(clean);
      if (Buffer.byteLength(payload, 'utf8') > MAX_BODY_BYTES) {
        res.status(413).json({ error: 'Payload too large' });
        return;
      }

      const kv = await getKV();
      const blob = await getBlob();
      if (kv) await kv.set(KV_KEY, payload);
      if (blob) await blob.put(BLOB_KEY, payload, { contentType: 'application/json', access: 'public' });

      const storage = [];
      if (kv) storage.push('KV');
      if (blob) storage.push('Blob');
      res.setHeader('Cache-Control', 'no-store');
      res.status(200).json({
        ok: true,
        stored: storage.length > 0,
        storage: storage.length ? storage : 'none',
        msg: storage.length
          ? `Saved to ${storage.join(' + ')}`
          : 'No storage configured — set KV_URL or BLOB_READ_WRITE_TOKEN env vars',
      });
      return;
    }

    applyCors(req, res, { methods: 'GET, POST, OPTIONS' });
    res.status(405).json({ error: 'Method not allowed' });
  } catch (e) {
    applyCors(req, res, { methods: 'GET, POST, OPTIONS' });
    res.status(500).json({ error: 'Internal error' });
  }
}

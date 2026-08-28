// GET  /api/guestbook — public read of guestbook entries
// POST /api/guestbook — public write, rate-limited, sanitized
import { applyCors, handlePreflight, rateLimit, readJson, getKV, getBlob } from './_lib.js';

const KV_KEY = 'reef-guestbook';
const BLOB_KEY = 'reef-guestbook.json';
const MAX_ENTRIES = 200;
const MAX_NAME = 24;
const MAX_MSG = 140;

function esc(s){ return String(s||'').replace(/[<>&"]/g,c=>({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;'}[c])); }

export default async function handler(req, res) {
  if (handlePreflight(req, res, { methods: 'GET, POST, OPTIONS' })) return;

  try {
    if (req.method === 'GET') {
      if (!(await rateLimit(req, res, { bucket: 'guestbook-get', limit: 60, windowSec: 60 }))) return;
      applyCors(req, res, { methods: 'GET, POST, OPTIONS', wildcard: true });
      res.setHeader('Cache-Control', 'no-store');
      let entries = [];
      const kv = await getKV();
      const blob = await getBlob();
      if (kv) {
        const v = await kv.get(KV_KEY);
        if (v) { try { entries = typeof v === 'string' ? JSON.parse(v) : v; } catch { entries = v; } }
      }
      if (!entries.length && blob) {
        try { const { url } = await blob.head(BLOB_KEY); if (url) { const r = await fetch(url); if (r.ok) entries = await r.json(); } } catch {}
      }
      if (!Array.isArray(entries)) entries = [];
      // strip to safe fields only
      entries = entries.slice(-MAX_ENTRIES).map(e=>({ name: String(e.name||'Anonymous').slice(0,MAX_NAME), msg: String(e.msg||'').slice(0,MAX_MSG), date: String(e.date||'') }));
      res.status(200).json({ entries });
      return;
    }

    if (req.method === 'POST') {
      applyCors(req, res, { methods: 'GET, POST, OPTIONS', wildcard: true });
      if (!(await rateLimit(req, res, { bucket: 'guestbook-post', limit: 5, windowSec: 60 }))) return;
      const body = readJson(req);
      if (body === null) { res.status(400).json({ error: 'Invalid JSON' }); return; }
      let name = String(body.name||'Anonymous').trim().slice(0,MAX_NAME) || 'Anonymous';
      let msg = String(body.msg||'').trim().slice(0,MAX_MSG);
      if (!msg) { res.status(400).json({ error: 'Message required' }); return; }
      // basic sanitization: strip control chars, limit, escape on read
      name = name.replace(/[\r\n\t]/g,' ').trim() || 'Anonymous';
      msg = msg.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g,'').trim();
      if (!msg) { res.status(400).json({ error: 'Message required' }); return; }

      const kv = await getKV();
      const blob = await getBlob();
      let entries = [];
      if (kv) {
        const v = await kv.get(KV_KEY);
        if (v) { try { entries = typeof v === 'string' ? JSON.parse(v) : v; } catch { entries = []; } }
      }
      if (!entries.length && blob) {
        try { const { url } = await blob.head(BLOB_KEY); if (url) { const r = await fetch(url); if (r.ok) entries = await r.json(); } } catch {}
      }
      if (!Array.isArray(entries)) entries = [];
      entries.push({ name: esc(name), msg: esc(msg), date: new Date().toISOString().slice(0,10) });
      if (entries.length > MAX_ENTRIES) entries = entries.slice(-MAX_ENTRIES);
      const payload = JSON.stringify(entries);
      if (kv) await kv.set(KV_KEY, payload);
      if (blob) await blob.put(BLOB_KEY, payload, { contentType: 'application/json', access: 'public' });
      res.setHeader('Cache-Control', 'no-store');
      res.status(200).json({ ok:true, entries: entries.slice(-20) });
      return;
    }

    applyCors(req, res, { methods: 'GET, POST, OPTIONS' });
    res.status(405).json({ error: 'Method not allowed' });
  } catch (e) {
    applyCors(req, res, { methods: 'GET, POST, OPTIONS' });
    res.status(500).json({ error: 'Internal error' });
  }
}

// POST /api/login — verify the admin password server-side and issue a session
// token. Rate limited to blunt brute force. Never reveals which credential
// matched (env var, KV-stored hash, or the hashed backup password).
import { applyCors, handlePreflight, readJson, rateLimit, verifyPassword, createSession } from './_lib.js';

export default async function handler(req, res) {
  if (handlePreflight(req, res, { methods: 'POST, OPTIONS' })) return;
  applyCors(req, res, { methods: 'POST, OPTIONS' });

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  // 8 attempts per 15 minutes per IP.
  if (!(await rateLimit(req, res, { bucket: 'login', limit: 8, windowSec: 900 }))) return;

  const body = readJson(req);
  if (body === null) { res.status(400).json({ error: 'Invalid JSON body' }); return; }

  const password = typeof body.password === 'string' ? body.password : '';
  const ok = await verifyPassword(password);

  if (!ok) {
    res.status(401).json({ error: 'Invalid password' });
    return;
  }

  const { token, expiresIn } = await createSession();
  res.setHeader('Cache-Control', 'no-store');
  res.status(200).json({ ok: true, token, expiresIn });
}

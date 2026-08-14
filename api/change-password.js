// POST /api/change-password — set a new admin password (stored server-side as a
// scrypt hash in Vercel KV). Requires a valid session token. The hashed backup
// password ("reef2026") continues to work regardless, as an emergency fallback.
import { applyCors, handlePreflight, readJson, rateLimit, requireAuth, setAdminPassword } from './_lib.js';

export default async function handler(req, res) {
  if (handlePreflight(req, res, { methods: 'POST, OPTIONS' })) return;
  applyCors(req, res, { methods: 'POST, OPTIONS' });

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  if (!(await requireAuth(req))) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  if (!(await rateLimit(req, res, { bucket: 'change-pw', limit: 5, windowSec: 900 }))) return;

  const body = readJson(req);
  if (body === null) { res.status(400).json({ error: 'Invalid JSON body' }); return; }

  const newPassword = typeof body.newPassword === 'string' ? body.newPassword : '';
  if (newPassword.length < 8) {
    res.status(400).json({ error: 'Password must be at least 8 characters' });
    return;
  }
  if (newPassword.length > 512) {
    res.status(400).json({ error: 'Password too long' });
    return;
  }

  const result = await setAdminPassword(newPassword);
  res.setHeader('Cache-Control', 'no-store');
  if (!result.ok) {
    res.status(503).json({
      error:
        'No persistent storage backend (Vercel KV) is configured, so a new password cannot be saved server-side. ' +
        'Set the ADMIN_PASSWORD environment variable in your Vercel project instead.',
    });
    return;
  }
  res.status(200).json({ ok: true, msg: 'Admin password updated.' });
}

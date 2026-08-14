// GET /api/discord-app-icon?application_id=... — resolve a Discord app icon URL.
import { applyCors, handlePreflight, rateLimit } from './_lib.js';

export default async function handler(req, res) {
  if (handlePreflight(req, res, { methods: 'GET, OPTIONS', wildcard: true })) return;
  applyCors(req, res, { methods: 'GET, OPTIONS', wildcard: true });

  if (!(await rateLimit(req, res, { bucket: 'discord-icon', limit: 40, windowSec: 60 }))) return;

  const { application_id } = req.query;
  // Discord snowflake IDs are numeric; validate before hitting the API.
  if (!/^\d{1,25}$/.test(String(application_id || ''))) {
    res.status(400).json({ error: 'application_id must be a numeric Discord ID' });
    return;
  }

  try {
    const r = await fetch(`https://discord.com/api/v10/applications/${encodeURIComponent(application_id)}/rpc`);
    if (!r.ok) { res.status(200).json({ icon: null }); return; }
    const j = await r.json();
    if (j.icon) {
      res.status(200).json({ icon: `https://cdn.discordapp.com/app-icons/${encodeURIComponent(application_id)}/${encodeURIComponent(j.icon)}.png` });
    } else {
      res.status(200).json({ icon: null });
    }
  } catch (e) {
    res.status(200).json({ icon: null });
  }
}

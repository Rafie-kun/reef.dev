// GET /api/steam-lookup?url=...|?appid=... — return public Steam app details.
import { applyCors, handlePreflight, rateLimit } from './_lib.js';

export default async function handler(req, res) {
  if (handlePreflight(req, res, { methods: 'GET, OPTIONS', wildcard: true })) return;
  applyCors(req, res, { methods: 'GET, OPTIONS', wildcard: true });

  if (!(await rateLimit(req, res, { bucket: 'steam-lookup', limit: 40, windowSec: 60 }))) return;

  const { url: inputUrl, appid } = req.query;
  let appId = appid || '';

  if (!appId && inputUrl) {
    const s = String(inputUrl);
    const m = s.match(/store\.steampowered\.com\/app\/(\d+)/i) ||
              s.match(/steamdb\.info\/app\/(\d+)/i) ||
              s.match(/steamcommunity\.com\/app\/(\d+)/i) ||
              s.match(/app\/(\d+)/i) ||
              s.match(/^(\d+)$/);
    if (m) appId = m[1];
  }

  // App IDs are numeric; reject anything else before hitting the upstream API.
  if (!/^\d{1,10}$/.test(String(appId))) {
    res.status(400).json({ error: 'Could not extract a numeric Steam App ID from the input.' });
    return;
  }

  try {
    const r = await fetch(`https://store.steampowered.com/api/appdetails?appids=${encodeURIComponent(appId)}&l=en&cc=us`);
    const j = await r.json();
    const data = j?.[appId]?.data;
    if (!data) {
      res.status(404).json({ error: `Steam App ID ${appId} not found.` });
      return;
    }
    res.status(200).json({
      appid: appId,
      steam_appid: data.steam_appid,
      name: data.name || '',
      header_image: data.header_image || '',
      capsule_image: data.capsule_image || '',
      short_description: data.short_description || '',
      is_free: !!data.is_free,
      price_overview: data.price_overview || null,
      platforms: data.platforms || null,
      metacritic: data.metacritic || null,
      release_date: data.release_date || null,
      developers: data.developers || [],
      publishers: data.publishers || [],
      genres: data.genres || [],
      categories: data.categories || [],
      recommendations: data.recommendations || null,
      pc_requirements: data.pc_requirements || null,
    });
  } catch (e) {
    res.status(502).json({ error: 'Failed to fetch from Steam API.' });
  }
}

function setCORS(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') { res.status(200); setCORS(res); res.end(); return; }

  const { url: inputUrl, appid } = req.query;
  let appId = appid || '';

  if (!appId && inputUrl) {
    const m = inputUrl.match(/store\.steampowered\.com\/app\/(\d+)/i) ||
              inputUrl.match(/steamdb\.info\/app\/(\d+)/i) ||
              inputUrl.match(/steamcommunity\.com\/app\/(\d+)/i) ||
              inputUrl.match(/app\/(\d+)/i) ||
              inputUrl.match(/^(\d+)$/);
    if (m) appId = m[1];
  }

  if (!appId) {
    res.status(400); setCORS(res);
    res.json({ error: 'Could not extract a numeric Steam App ID from the input.' });
    return;
  }

  try {
    const r = await fetch(`https://store.steampowered.com/api/appdetails?appids=${encodeURIComponent(appId)}&l=en&cc=us`);
    const j = await r.json();
    const data = j?.[appId]?.data;
    if (!data) {
      res.status(404); setCORS(res);
      res.json({ error: `Steam App ID ${appId} not found.` });
      return;
    }
    res.status(200); setCORS(res);
    res.json({
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
    res.status(502); setCORS(res);
    res.json({ error: 'Failed to fetch from Steam API.' });
  }
}

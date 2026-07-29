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
      name: data.name || '',
      headerImage: data.header_image || '',
      capsuleImage: data.capsule_image || '',
      shortDescription: data.short_description || '',
    });
  } catch (e) {
    res.status(502); setCORS(res);
    res.json({ error: 'Failed to fetch from Steam API.' });
  }
}

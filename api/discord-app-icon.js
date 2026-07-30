function setCORS(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') { res.status(200); setCORS(res); res.end(); return; }

  const { application_id } = req.query;
  if (!application_id) {
    res.status(400); setCORS(res);
    res.json({ error: 'application_id query param is required' });
    return;
  }

  try {
    const r = await fetch(`https://discord.com/api/v10/applications/${encodeURIComponent(application_id)}/rpc`);
    if (!r.ok) {
      res.status(200); setCORS(res);
      res.json({ icon: null });
      return;
    }
    const j = await r.json();
    if (j.icon) {
      res.status(200); setCORS(res);
      res.json({ icon: `https://cdn.discordapp.com/app-icons/${application_id}/${j.icon}.png` });
    } else {
      res.status(200); setCORS(res);
      res.json({ icon: null });
    }
  } catch (e) {
    res.status(200); setCORS(res);
    res.json({ icon: null });
  }
}

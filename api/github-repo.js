function setCORS(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') { res.status(200); setCORS(res); res.end(); return; }

  const { url } = req.query;

  if (!url) {
    res.status(400); setCORS(res);
    res.json({ error: 'Missing required query parameter: url' });
    return;
  }

  const m = url.match(/github\.com\/([^\/\?#]+)\/([^\/\?#]+)/i);
  if (!m) {
    res.status(400); setCORS(res);
    res.json({ error: 'Invalid GitHub repository URL.' });
    return;
  }

  const owner = m[1];
  const repo = m[2];

  try {
    const r = await fetch(`https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`, {
      headers: { 'User-Agent': 'vercel-serverless-function' },
    });

    if (r.status === 404) {
      res.status(404); setCORS(res);
      res.json({ error: `Repository ${owner}/${repo} not found.` });
      return;
    }

    if (!r.ok) {
      res.status(502); setCORS(res);
      res.json({ error: 'GitHub API request failed.' });
      return;
    }

    const data = await r.json();

    res.status(200); setCORS(res);
    res.json({
      name: data.name,
      owner: data.owner?.login,
      full_name: data.full_name,
      description: data.description,
      language: data.language,
      stargazers_count: data.stargazers_count,
      forks_count: data.forks_count,
      html_url: data.html_url,
      avatar_url: data.owner?.avatar_url,
      topics: data.topics || [],
      homepage: data.homepage,
    });
  } catch (e) {
    res.status(502); setCORS(res);
    res.json({ error: 'Failed to fetch from GitHub API.' });
  }
}
// GET /api/github-repo?url=... — return public metadata for a GitHub repo.
import { applyCors, handlePreflight, rateLimit } from './_lib.js';

export default async function handler(req, res) {
  if (handlePreflight(req, res, { methods: 'GET, OPTIONS', wildcard: true })) return;
  applyCors(req, res, { methods: 'GET, OPTIONS', wildcard: true });

  if (!(await rateLimit(req, res, { bucket: 'github-repo', limit: 40, windowSec: 60 }))) return;

  const { url } = req.query;
  if (!url) {
    res.status(400).json({ error: 'Missing required query parameter: url' });
    return;
  }

  const m = String(url).match(/github\.com\/([^\/\?#]+)\/([^\/\?#]+)/i);
  if (!m) {
    res.status(400).json({ error: 'Invalid GitHub repository URL.' });
    return;
  }

  // GitHub owner/repo names are [A-Za-z0-9._-]; reject anything else (and the
  // bare "."/".." segments) so a crafted URL can't traverse to other API paths.
  const owner = m[1];
  const repo = m[2].replace(/\.git$/i, '');
  const nameOk = (s) => /^[A-Za-z0-9._-]+$/.test(s) && s !== '.' && s !== '..';
  if (!nameOk(owner) || !nameOk(repo)) {
    res.status(400).json({ error: 'Invalid GitHub repository URL.' });
    return;
  }

  try {
    const headers = { 'User-Agent': 'vercel-serverless-function' };
    if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    const r = await fetch(`https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`, { headers });

    if (r.status === 404) {
      res.status(404).json({ error: `Repository ${owner}/${repo} not found.` });
      return;
    }
    if (!r.ok) {
      res.status(502).json({ error: 'GitHub API request failed.' });
      return;
    }

    const data = await r.json();
    res.status(200).json({
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
    res.status(502).json({ error: 'Failed to fetch from GitHub API.' });
  }
}

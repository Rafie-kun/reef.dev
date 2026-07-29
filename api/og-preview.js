function setCORS(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

const FALLBACK_ICON = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect fill="%23333" width="24" height="24"/><text x="12" y="16" text-anchor="middle" fill="%23888" font-size="14">?</text></svg>';

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') { res.status(200); setCORS(res); res.end(); return; }

  const url = req.query.url || '';
  if (!url) {
    res.status(400); setCORS(res);
    res.json({ error: 'Missing url parameter.' });
    return;
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const r = await fetch(url, {
      signal: controller.signal,
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; OGPreview/1.0)' }
    });
    clearTimeout(timeout);
    if (!r.ok) throw new Error('HTTP ' + r.status);

    const html = await r.text();
    const getMeta = (prop) => {
      const re = new RegExp(`<meta[^>]+(?:property|name)=["']${prop}["'][^>]+content=["']([^"']+)["']`, 'i');
      const m = html.match(re);
      if (m) return unescape(m[1]);
      const re2 = new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${prop}["']`, 'i');
      const m2 = html.match(re2);
      return m2 ? unescape(m2[1]) : '';
    };

    const title = getMeta('og:title') || getMeta('twitter:title') || html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1] || '';
    const description = getMeta('og:description') || getMeta('twitter:description') || getMeta('description') || '';
    const image = getMeta('og:image') || getMeta('twitter:image') || '';
    const siteName = getMeta('og:site_name') || '';

    const favicon = html.match(/<link[^>]+rel=["'](?:shortcut )?icon["'][^>]+href=["']([^"']+)["']/i)?.[1]
      || html.match(/<link[^>]+rel=["']apple-touch-icon["'][^>]+href=["']([^"']+)["']/i)?.[1]
      || '';

    res.status(200); setCORS(res);
    res.json({
      url,
      title: String(title).trim(),
      description: String(description).trim().slice(0, 500),
      image: String(image).trim(),
      siteName: String(siteName).trim(),
      favicon: String(favicon).trim() || FALLBACK_ICON,
    });
  } catch (e) {
    res.status(200); setCORS(res);
    res.json({ url, error: e.message, title: '', description: '', image: '', siteName: '', favicon: FALLBACK_ICON });
  }
}

function unescape(s) {
  return s.replace(/&#(\d+);/g, (_, c) => String.fromCharCode(c))
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#x27;/g, "'");
}

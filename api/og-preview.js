// GET /api/og-preview?url=... — fetch a page and return its Open Graph preview.
// SSRF-hardened: only public http(s) hosts, no private/loopback/metadata IPs,
// redirects re-validated, response size/time bounded (see api/_lib.js).
import { applyCors, handlePreflight, rateLimit, safeFetchText } from './_lib.js';

const FALLBACK_ICON = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect fill="%23333" width="24" height="24"/><text x="12" y="16" text-anchor="middle" fill="%23888" font-size="14">?</text></svg>';

export default async function handler(req, res) {
  if (handlePreflight(req, res, { methods: 'GET, OPTIONS', wildcard: true })) return;
  applyCors(req, res, { methods: 'GET, OPTIONS', wildcard: true });

  if (!(await rateLimit(req, res, { bucket: 'og-preview', limit: 40, windowSec: 60 }))) return;

  const url = req.query.url || '';
  if (!url) {
    res.status(400).json({ error: 'Missing url parameter.' });
    return;
  }

  try {
    const html = await safeFetchText(url, { timeoutMs: 8000, maxBytes: 2_000_000, maxRedirects: 3 });

    const getMeta = (prop) => {
      // Bounded quantifiers to avoid catastrophic backtracking (ReDoS).
      const re = new RegExp(`<meta[^>]{0,300}?(?:property|name)=["']${prop}["'][^>]{0,300}?content=["']([^"']{0,2000})["']`, 'i');
      const m = html.match(re);
      if (m) return unescapeEntities(m[1]);
      const re2 = new RegExp(`<meta[^>]{0,300}?content=["']([^"']{0,2000})["'][^>]{0,300}?(?:property|name)=["']${prop}["']`, 'i');
      const m2 = html.match(re2);
      return m2 ? unescapeEntities(m2[1]) : '';
    };

    const title = getMeta('og:title') || getMeta('twitter:title') || html.match(/<title[^>]*>([^<]{0,500})<\/title>/i)?.[1] || '';
    const description = getMeta('og:description') || getMeta('twitter:description') || getMeta('description') || '';
    const image = getMeta('og:image') || getMeta('twitter:image') || '';
    const siteName = getMeta('og:site_name') || '';
    const favicon = html.match(/<link[^>]{0,300}?rel=["'](?:shortcut )?icon["'][^>]{0,300}?href=["']([^"']{0,2000})["']/i)?.[1]
      || html.match(/<link[^>]{0,300}?rel=["']apple-touch-icon["'][^>]{0,300}?href=["']([^"']{0,2000})["']/i)?.[1]
      || '';

    res.status(200).json({
      url,
      title: String(title).trim().slice(0, 300),
      description: String(description).trim().slice(0, 500),
      image: String(image).trim().slice(0, 1000),
      siteName: String(siteName).trim().slice(0, 200),
      favicon: String(favicon).trim().slice(0, 1000) || FALLBACK_ICON,
    });
  } catch (e) {
    // Generic message only — never reflect the internal reason (e.g. "Blocked
    // private address"), which would turn this endpoint into an SSRF/host-probe oracle.
    res.status(200).json({ url, error: 'Could not fetch preview', title: '', description: '', image: '', siteName: '', favicon: FALLBACK_ICON });
  }
}

function unescapeEntities(s) {
  return s.replace(/&#(\d+);/g, (_, c) => String.fromCharCode(c))
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#x27;/g, "'");
}

function setCORS(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') { res.status(200); setCORS(res); res.end(); return; }

  const BLOB_KEY = 'reef-cms.json';

  try {
    let kv = null, blob = null;
    try { const m = await import('@vercel/kv'); if (process.env.KV_URL) kv = m.kv; } catch (e) {}
    try { const m = await import('@vercel/blob'); if (process.env.BLOB_READ_WRITE_TOKEN) blob = m; } catch (e) {}

    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
      const payload = JSON.stringify(body);

      if (kv) await kv.set('reef-cms', payload);
      if (blob) await blob.put(BLOB_KEY, payload, { contentType: 'application/json', access: 'public' });

      const storage = [];
      if (kv) storage.push('KV');
      if (blob) storage.push('Blob');
      res.status(200); setCORS(res);
      res.json({
        ok: true, stored: storage.length > 0,
        storage: storage.length ? storage : 'none',
        msg: storage.length
          ? `Saved to ${storage.join(' + ')}`
          : 'No storage configured — set KV_URL or BLOB_READ_WRITE_TOKEN env vars',
      });
      return;
    }

    if (req.method === 'GET') {
      let data = null;

      if (kv) {
        const v = await kv.get('reef-cms');
        if (v) {
          try { data = typeof v === 'string' ? JSON.parse(v) : v; } catch (e) { data = v; }
        }
      }

      if (!data && blob) {
        try {
          const { url } = await blob.head(BLOB_KEY);
          if (url) {
            const resp = await fetch(url);
            if (resp.ok) data = await resp.json();
          }
        } catch (e) {}
      }

      if (data) {
        res.status(200); setCORS(res);
        res.json(data);
        return;
      }

      res.status(200); setCORS(res);
      res.json({ msg: 'No data stored yet' });
      return;
    }

    res.status(405); setCORS(res);
    res.json({ error: 'Method not allowed' });
  } catch (e) {
    res.status(500); setCORS(res);
    res.json({ error: e.message });
  }
}

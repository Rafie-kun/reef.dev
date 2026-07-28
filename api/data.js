export default async function handler(req, res) {
  const CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
  if (req.method === 'OPTIONS') { res.status(200).setHeader(CORS).end(); return; }

  try {
    let kv;
    try {
      const mod = await import('@vercel/kv');
      kv = mod.kv;
    } catch (e) { kv = null; }

    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
      if (kv) {
        await kv.set('reef-cms', JSON.stringify(body));
      }
      res.status(200).setHeader(CORS).json({ ok: true, stored: !!kv, msg: kv ? 'Saved to KV' : 'KV not configured — data only returned in response' });
      return;
    }

    if (req.method === 'GET') {
      if (kv) {
        const data = await kv.get('reef-cms');
        if (data) {
          res.status(200).setHeader(CORS).json(typeof data === 'string' ? JSON.parse(data) : data);
          return;
        }
      }
      res.status(200).setHeader(CORS).json({ msg: 'No data in KV' });
      return;
    }

    res.status(405).setHeader(CORS).json({ error: 'Method not allowed' });
  } catch (e) {
    res.status(500).setHeader(CORS).json({ error: e.message });
  }
}

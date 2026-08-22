// local-server.mjs — dev server: static files + /api/* shims so admin.html
// works outside Vercel. NOT for production (no HTTPS/rate-limit persistence).
// Usage: node local-server.mjs [port]
import http from 'node:http';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.argv[2] || process.env.PORT || 5300);
process.env.ADMIN_PASSWORD ||= 'reef'; // convenient local login

const MIME = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.mjs': 'text/javascript',
  '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg', '.gif': 'image/gif', '.svg': 'image/svg+xml', '.webp': 'image/webp',
  '.ico': 'image/x-icon', '.ogg': 'audio/ogg', '.mp3': 'audio/mpeg', '.woff2': 'font/woff2',
};

function shimRes(res) {
  res.status = (c) => { res.statusCode = c; return res; };
  const endJson = (o) => {
    if (!res.getHeader('Cache-Control')) res.setHeader('Cache-Control', 'no-store');
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify(o));
  };
  res.json = endJson;
  return res;
}

async function handleApi(req, res, url) {
  const name = url.pathname.replace(/^\/api\//, '').replace(/\.js$/, '');
  const file = path.join(ROOT, 'api', name + '.js');
  try {
    await fs.access(file);
  } catch {
    res.statusCode = 404; res.end(JSON.stringify({ error: 'No such endpoint' })); return;
  }
  // parse query + body before dispatch
  url.searchParams.forEach((v, k) => { req.query[k] = v; });
  if (req.method === 'POST' || req.method === 'PUT') {
    const chunks = [];
    for await (const ch of req) chunks.push(ch);
    req.body = Buffer.concat(chunks).toString('utf8'); // _lib.readJson parses strings
  }
  const mod = await import(pathToFileURL(file).href);
  await mod.default(req, shimRes(res));
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  req.query = {};
  req.socket?.setTimeout?.(30000);

  if (url.pathname.startsWith('/api/')) {
    try { await handleApi(req, res, url); }
    catch (e) {
      console.error('[api]', url.pathname, e);
      if (!res.writableEnded) { res.statusCode = 500; res.end(JSON.stringify({ error: e.message })); }
    }
    return;
  }

  // static files
  let p = decodeURIComponent(url.pathname);
  if (p === '/' || p === '') p = '/index.html';
  if (p === '/admin' || p === '/admin/') p = '/admin.html';
  const file = path.normalize(path.join(ROOT, p));
  if (!file.startsWith(ROOT)) { res.statusCode = 403; res.end(); return; }
  try {
    const data = await fs.readFile(file);
    res.setHeader('Content-Type', MIME[path.extname(file).toLowerCase()] || 'application/octet-stream');
    const ext = path.extname(file).toLowerCase();
    if (ext === '.html' || ext === '.js' || ext === '.mjs' || ext === '.css' || ext === '.json') {
      res.setHeader('Cache-Control', 'no-store'); // logic files must never be cached
    } else if (file.includes(path.join('assets', 'mc', 'icons'))) {
      res.setHeader('Cache-Control', 'public,max-age=86400');
    } else {
      res.setHeader('Cache-Control', 'no-cache');
    }
    res.end(data);
  } catch {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Not found');
  }
});

server.listen(PORT, () => {
  console.log(`reef.dev local server → http://localhost:${PORT}`);
  console.log(`  site : http://localhost:${PORT}/`);
  console.log(`  admin: http://localhost:${PORT}/admin  (password: ${process.env.ADMIN_PASSWORD})`);
});

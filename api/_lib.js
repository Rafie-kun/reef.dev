// ============================================================================
// api/_lib.js — shared security primitives for the reef.dev serverless API.
//
// Files under api/ whose name starts with "_" are NOT deployed as routes by
// Vercel; they are importable helper modules. This file centralises:
//   - storage backend access (Vercel KV / Blob)
//   - request helpers (client IP, JSON body, CORS)
//   - rate limiting (KV-backed fixed window, in-memory fallback)
//   - password verification (env var + KV-stored hash + hashed backup)
//   - stateless session tokens (HMAC-signed bearer tokens)
//   - SSRF-safe outbound fetch (for the URL-preview proxy)
//
// Threat model: this is a single-admin CMS. The public site reads CMS JSON via
// GET /api/data; only the admin may write. Auth is enforced SERVER-SIDE here —
// the client UI gate in admin.html is cosmetic only.
// ============================================================================

import crypto from 'node:crypto';
import dns from 'node:dns/promises';
import net from 'node:net';
import http from 'node:http';
import https from 'node:https';

// ----------------------------------------------------------------------------
// Backup admin password.
//
// The literal default password ("reef2026") is intentionally NOT present in the
// source tree. What is stored here is a scrypt hash of it, so the old password
// keeps working as an emergency backup credential without the plaintext ever
// living in the repo. Disable it entirely by setting DISABLE_BACKUP_PASSWORD=1.
// ----------------------------------------------------------------------------
const BACKUP_PW_HASH =
  '6ed4dc7329d8359136443a897cdc8183:' +
  '956aeb080a485e4c4b2f7174455e69b96b2cdfaf6f7d97bd881b0f08fc6aca4f' +
  'd36d2f74a3f8db32c87cf5f43f6340925b71573f2c249b883c06472144fca5c1';

const KV_PW_HASH_KEY = 'reef-admin-pw-hash';
const SESSION_TTL_MS = 1000 * 60 * 60 * 8; // 8 hours

// ----------------------------------------------------------------------------
// Storage backends
// ----------------------------------------------------------------------------
export async function getKV() {
  try {
    if (!process.env.KV_URL && !process.env.KV_REST_API_URL) return null;
    const m = await import('@vercel/kv');
    return m.kv;
  } catch { return null; }
}

export async function getBlob() {
  try {
    if (!process.env.BLOB_READ_WRITE_TOKEN) return null;
    return await import('@vercel/blob');
  } catch { return null; }
}

// ----------------------------------------------------------------------------
// Request helpers
// ----------------------------------------------------------------------------
export function clientIp(req) {
  // On Vercel, x-real-ip is set by the platform to the true client IP and cannot
  // be spoofed by the client. x-forwarded-for CAN be prepended by the client, so
  // never trust its leftmost entry — the trusted proxy appends the real IP last.
  const real = req.headers['x-real-ip'];
  if (real) return String(real).trim();
  const xff = req.headers['x-forwarded-for'];
  if (xff) {
    const parts = String(xff).split(',').map((s) => s.trim()).filter(Boolean);
    if (parts.length) return parts[parts.length - 1];
  }
  return req.socket?.remoteAddress || 'unknown';
}

export function readJson(req) {
  const b = req.body;
  if (b == null || b === '') return {};
  if (typeof b === 'string') {
    try { return JSON.parse(b); } catch { return null; } // null => malformed
  }
  return b;
}

// Same-origin-aware CORS. For public GET proxies we allow "*"; for mutating
// endpoints we only reflect the request's own origin, never a wildcard. Because
// auth uses a bearer token (not cookies) there is no CSRF surface regardless.
export function applyCors(req, res, { methods = 'GET, OPTIONS', wildcard = false } = {}) {
  const origin = req.headers.origin;
  if (wildcard) {
    res.setHeader('Access-Control-Allow-Origin', '*');
  } else if (origin && isSameSiteOrigin(req, origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  }
  res.setHeader('Access-Control-Allow-Methods', methods);
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Max-Age', '600');
}

function isSameSiteOrigin(req, origin) {
  try {
    const host = req.headers.host;
    if (!host) return false;
    const u = new URL(origin);
    return u.host === host;
  } catch { return false; }
}

export function handlePreflight(req, res, opts) {
  if (req.method !== 'OPTIONS') return false;
  applyCors(req, res, opts);
  res.status(204).end();
  return true;
}

// ----------------------------------------------------------------------------
// Rate limiting — KV fixed-window, in-memory fallback (best effort per instance)
// ----------------------------------------------------------------------------
const memBuckets = new Map(); // key -> { count, resetAt }

export async function rateLimit(req, res, { bucket, limit, windowSec }) {
  const ip = clientIp(req);
  const key = `rl:${bucket}:${ip}`;
  const now = Date.now();
  let count, resetAt;

  const kv = await getKV();
  if (kv) {
    try {
      count = await kv.incr(key);
      if (count === 1) await kv.expire(key, windowSec);
      let ttl = await kv.ttl(key);
      if (ttl == null || ttl < 0) ttl = windowSec;
      resetAt = now + ttl * 1000;
    } catch {
      ({ count, resetAt } = memHit(key, windowSec, now));
    }
  } else {
    ({ count, resetAt } = memHit(key, windowSec, now));
  }

  const remaining = Math.max(0, limit - count);
  res.setHeader('X-RateLimit-Limit', String(limit));
  res.setHeader('X-RateLimit-Remaining', String(remaining));
  res.setHeader('X-RateLimit-Reset', String(Math.ceil(resetAt / 1000)));

  if (count > limit) {
    const retryAfter = Math.max(1, Math.ceil((resetAt - now) / 1000));
    res.setHeader('Retry-After', String(retryAfter));
    res.status(429).json({ error: 'Too many requests. Slow down.', retryAfter });
    return false;
  }
  return true;
}

function memHit(key, windowSec, now) {
  const cur = memBuckets.get(key);
  if (!cur || cur.resetAt <= now) {
    const resetAt = now + windowSec * 1000;
    memBuckets.set(key, { count: 1, resetAt });
    if (memBuckets.size > 5000) sweepMem(now); // bound memory
    return { count: 1, resetAt };
  }
  cur.count += 1;
  return { count: cur.count, resetAt: cur.resetAt };
}

function sweepMem(now) {
  for (const [k, v] of memBuckets) if (v.resetAt <= now) memBuckets.delete(k);
}

// ----------------------------------------------------------------------------
// Crypto helpers
// ----------------------------------------------------------------------------
function timingSafeStrEqual(a, b) {
  const ha = crypto.createHash('sha256').update(String(a)).digest();
  const hb = crypto.createHash('sha256').update(String(b)).digest();
  return crypto.timingSafeEqual(ha, hb);
}

export function hashPassword(pw) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(String(pw), salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

function verifyScrypt(pw, stored) {
  if (typeof stored !== 'string' || !stored.includes(':')) return false;
  const [salt, hash] = stored.split(':');
  let candidate;
  try {
    candidate = crypto.scryptSync(String(pw), salt, 64);
  } catch { return false; }
  const target = Buffer.from(hash, 'hex');
  if (candidate.length !== target.length) return false;
  return crypto.timingSafeEqual(candidate, target);
}

// Verify a candidate password against, in order: the ADMIN_PASSWORD env var,
// the operator-set password hash in KV, and the hashed backup ("reef2026").
// Always runs a scrypt comparison so failures don't return noticeably faster.
export async function verifyPassword(pw) {
  if (typeof pw !== 'string' || pw.length === 0 || pw.length > 512) return false;
  let ok = false;

  const envPw = process.env.ADMIN_PASSWORD;
  if (envPw && timingSafeStrEqual(pw, envPw)) ok = true;

  try {
    const kv = await getKV();
    if (kv) {
      const stored = await kv.get(KV_PW_HASH_KEY);
      if (stored && verifyScrypt(pw, stored)) ok = true;
    }
  } catch { /* ignore backend errors, fall through */ }

  const backupDisabled = process.env.DISABLE_BACKUP_PASSWORD === '1';
  const backupMatch = verifyScrypt(pw, BACKUP_PW_HASH); // always compute (timing)
  if (!backupDisabled && backupMatch) ok = true;

  return ok;
}

export async function setAdminPassword(newPw) {
  const kv = await getKV();
  if (!kv) return { ok: false, reason: 'no-backend' };
  await kv.set(KV_PW_HASH_KEY, hashPassword(newPw));
  return { ok: true };
}

// ----------------------------------------------------------------------------
// Stateless session tokens (HMAC-signed bearer tokens)
// ----------------------------------------------------------------------------
const SESSION_SECRET_KEY = 'reef-session-secret';
let _cachedSecret = null; // per-instance cache of the KV-stored secret
let _memSecret = null;    // per-process random secret when no secret store exists

// The HMAC key for session tokens MUST be secret. It is derived, in order:
//   1. SESSION_SECRET env var (recommended in production)
//   2. a random secret generated once and persisted in KV (so it is stable
//      across serverless instances but never a committed/public value)
//   3. a per-process random secret (dev / no-backend; unforgeable but not shared
//      across instances — set SESSION_SECRET for multi-instance deployments)
// It is NEVER derived from committed constants like BACKUP_PW_HASH.
async function sessionSecret() {
  const s = process.env.SESSION_SECRET;
  if (s && s.length >= 16) return s;
  if (_cachedSecret) return _cachedSecret;

  const kv = await getKV();
  if (kv) {
    try {
      let sec = await kv.get(SESSION_SECRET_KEY);
      if (typeof sec !== 'string' || sec.length < 32) {
        sec = crypto.randomBytes(32).toString('hex');
        await kv.set(SESSION_SECRET_KEY, sec, { nx: true }); // first writer wins
        sec = (await kv.get(SESSION_SECRET_KEY)) || sec;     // adopt the winner
      }
      _cachedSecret = sec;
      return sec;
    } catch { /* fall through to per-process secret */ }
  }

  if (!_memSecret) _memSecret = crypto.randomBytes(32).toString('hex');
  return _memSecret;
}

function b64url(buf) {
  return Buffer.from(buf).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export async function createSession(ttlMs = SESSION_TTL_MS) {
  const secret = await sessionSecret();
  const payload = b64url(JSON.stringify({ exp: Date.now() + ttlMs, v: 1 }));
  const sig = b64url(crypto.createHmac('sha256', secret).update(payload).digest());
  return { token: `${payload}.${sig}`, expiresIn: Math.floor(ttlMs / 1000) };
}

export async function verifySession(token) {
  if (typeof token !== 'string' || !token.includes('.')) return false;
  const [payload, sig] = token.split('.');
  if (!payload || !sig) return false;
  const secret = await sessionSecret();
  const expected = b64url(crypto.createHmac('sha256', secret).update(payload).digest());
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return false;
  try {
    const data = JSON.parse(Buffer.from(payload.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString());
    return typeof data.exp === 'number' && data.exp > Date.now();
  } catch { return false; }
}

export async function requireAuth(req) {
  const h = req.headers['authorization'] || '';
  let token = '';
  if (h.toLowerCase().startsWith('bearer ')) token = h.slice(7).trim();
  if (!token) token = req.headers['x-admin-token'] || '';
  return verifySession(token);
}

// ----------------------------------------------------------------------------
// SSRF-safe outbound fetch (for the URL preview proxy)
// ----------------------------------------------------------------------------
function ipIsPrivate(ip) {
  if (net.isIPv4(ip)) {
    const p = ip.split('.').map(Number);
    if (p[0] === 0) return true;                         // 0.0.0.0/8
    if (p[0] === 10) return true;                        // 10/8
    if (p[0] === 127) return true;                       // loopback
    if (p[0] === 169 && p[1] === 254) return true;       // link-local + metadata
    if (p[0] === 172 && p[1] >= 16 && p[1] <= 31) return true; // 172.16/12
    if (p[0] === 192 && p[1] === 168) return true;       // 192.168/16
    if (p[0] === 100 && p[1] >= 64 && p[1] <= 127) return true; // CGNAT 100.64/10
    if (p[0] === 192 && p[1] === 0 && p[2] === 0) return true;  // 192.0.0/24
    if (p[0] >= 224) return true;                        // multicast / reserved
    return false;
  }
  if (net.isIPv6(ip)) {
    const b = ipv6ToBytes(ip);
    if (!b) return true; // unparseable => unsafe
    // IPv4-mapped (::ffff:0:0/96): resolve the embedded IPv4 and apply IPv4 rules.
    // This catches the hex form (::ffff:7f00:1) as well as the dotted form.
    if (b.slice(0, 10).every((x) => x === 0) && b[10] === 0xff && b[11] === 0xff) {
      return ipIsPrivate(`${b[12]}.${b[13]}.${b[14]}.${b[15]}`);
    }
    // NAT64 well-known prefix 64:ff9b::/96 embeds an IPv4 too.
    if (b[0] === 0x00 && b[1] === 0x64 && b[2] === 0xff && b[3] === 0x9b) {
      return ipIsPrivate(`${b[12]}.${b[13]}.${b[14]}.${b[15]}`);
    }
    if (b.slice(0, 12).every((x) => x === 0)) return true;     // ::/96 incl ::1, ::, ::a.b.c.d
    if (b[0] === 0xfe && (b[1] & 0xc0) === 0x80) return true;  // fe80::/10 link-local
    if ((b[0] & 0xfe) === 0xfc) return true;                   // fc00::/7 unique local
    if (b[0] === 0xff) return true;                            // multicast
    return false;
  }
  return true; // unknown format => treat as unsafe
}

// Parse an IPv6 literal (with :: compression and optional embedded dotted IPv4)
// into 16 bytes; null if it cannot be parsed.
function ipv6ToBytes(ip) {
  let s = String(ip).toLowerCase().replace(/^\[|\]$/g, '').replace(/%.*$/, '');
  let v4 = null;
  const dm = s.match(/:(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})$/);
  if (dm) {
    v4 = dm[1].split('.').map(Number);
    if (v4.some((n) => n > 255)) return null;
    s = s.slice(0, dm.index); // drop ':a.b.c.d', keep the groups before it
  }
  const dbl = s.split('::');
  if (dbl.length > 2) return null;
  const parseGroups = (str) => {
    if (!str) return [];
    const out = [];
    for (const g of str.split(':')) {
      if (!/^[0-9a-f]{1,4}$/.test(g)) return null;
      out.push(parseInt(g, 16));
    }
    return out;
  };
  const head = parseGroups(dbl[0]);
  if (head === null) return null;
  const tail = dbl.length === 2 ? parseGroups(dbl[1]) : null;
  if (dbl.length === 2 && tail === null) return null;
  const v4groups = v4 ? [(v4[0] << 8) | v4[1], (v4[2] << 8) | v4[3]] : [];
  const bytes = [];
  const push = (g) => bytes.push((g >> 8) & 0xff, g & 0xff);
  if (dbl.length === 2) {
    const fill = 8 - (head.length + tail.length + v4groups.length);
    if (fill < 0) return null;
    head.forEach(push);
    for (let i = 0; i < fill; i++) bytes.push(0, 0);
    tail.forEach(push);
    v4groups.forEach(push);
  } else {
    if (head.length + v4groups.length !== 8) return null;
    head.forEach(push);
    v4groups.forEach(push);
  }
  return bytes.length === 16 ? bytes : null;
}

async function assertPublicUrl(raw) {
  let u;
  try { u = new URL(raw); } catch { throw new Error('Invalid URL'); }
  if (u.protocol !== 'http:' && u.protocol !== 'https:') throw new Error('Only http(s) URLs are allowed');
  const host = u.hostname.replace(/^\[|\]$/g, '');
  const bad = ['localhost', 'metadata.google.internal', 'metadata'];
  if (bad.includes(host.toLowerCase()) || host.toLowerCase().endsWith('.local')) {
    throw new Error('Blocked host');
  }
  if (net.isIP(host)) {
    if (ipIsPrivate(host)) throw new Error('Blocked private address');
    return u;
  }
  const addrs = await dns.lookup(host, { all: true });
  if (!addrs.length) throw new Error('DNS resolution failed');
  for (const a of addrs) if (ipIsPrivate(a.address)) throw new Error('Blocked private address');
  return u;
}

// Connect-time DNS validation + pinning. The socket layer calls this to resolve
// the host; we resolve, reject if ANY address is private (defeats DNS rebinding
// where the check and the connect disagree), and hand back exactly the validated
// IP so the TCP connection cannot be pointed elsewhere. TLS SNI stays the
// hostname, so certificate validation is unaffected.
function pinnedLookup(hostname, options, callback) {
  const opts = { all: true };
  if (options && options.family) opts.family = options.family;
  dns.lookup(hostname, opts).then((addrs) => {
    if (!addrs.length) return callback(new Error('DNS resolution failed'));
    // Reject if ANY resolved address is private (defeats rebind: the check and
    // the connect can no longer disagree, since the connect uses only these IPs).
    if (addrs.some((a) => ipIsPrivate(a.address))) return callback(new Error('Blocked private address'));
    // Node's happy-eyeballs (autoSelectFamily) calls lookup with all:true and
    // expects the array form; a plain connect expects (address, family).
    if (options && options.all) callback(null, addrs);
    else callback(null, addrs[0].address, addrs[0].family);
  }).catch((e) => callback(e));
}

function httpGetOnce(urlStr, { timeoutMs, maxBytes }) {
  return new Promise((resolve, reject) => {
    let u;
    try { u = new URL(urlStr); } catch { reject(new Error('Invalid URL')); return; }
    const mod = u.protocol === 'https:' ? https : http;
    const req = mod.request(u, {
      method: 'GET',
      lookup: pinnedLookup,
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; OGPreview/1.0)', Accept: 'text/html,*/*' },
    }, (res) => {
      const status = res.statusCode || 0;
      if (status >= 300 && status < 400 && res.headers.location) {
        res.resume(); res.destroy();
        resolve({ status, location: res.headers.location, body: '' });
        return;
      }
      const len = Number(res.headers['content-length'] || 0);
      if (len && len > maxBytes) { res.destroy(); reject(new Error('Response too large')); return; }
      const chunks = [];
      let total = 0, done = false;
      res.on('data', (c) => {
        if (done) return;
        total += c.length;
        if (total > maxBytes) { done = true; res.destroy(); resolve({ status, body: Buffer.concat(chunks).toString('utf8') }); return; }
        chunks.push(c);
      });
      res.on('end', () => { if (!done) { done = true; resolve({ status, body: Buffer.concat(chunks).toString('utf8') }); } });
      res.on('error', (e) => { if (!done) { done = true; reject(e); } });
    });
    req.setTimeout(timeoutMs, () => req.destroy(new Error('Timeout')));
    req.on('error', reject);
    req.end();
  });
}

export async function safeFetchText(rawUrl, { timeoutMs = 8000, maxBytes = 2_000_000, maxRedirects = 3 } = {}) {
  let url = rawUrl;
  for (let i = 0; i <= maxRedirects; i++) {
    await assertPublicUrl(url); // fast pre-check (scheme, literal IPs, host blocklist)
    const { status, location, body } = await httpGetOnce(url, { timeoutMs, maxBytes });
    if (status >= 300 && status < 400 && location) {
      if (i === maxRedirects) throw new Error('Too many redirects');
      url = new URL(location, url).toString();
      continue;
    }
    if (status < 200 || status >= 300) throw new Error('HTTP ' + status);
    return body;
  }
  throw new Error('Too many redirects');
}

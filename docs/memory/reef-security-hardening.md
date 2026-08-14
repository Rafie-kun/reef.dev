---
name: reef-security-hardening
description: Security audit findings and fixes applied to reef.dev in Aug 2026
metadata: 
  node_type: memory
  type: project
  originSessionId: 5fd2f49c-4c57-48fc-bc87-d4f610f2af12
  modified: 2026-08-14T14:05:55.705Z
---

Security audit + remediation done 2026-08-14 (branch `claude/auth-security-audit-0a6706`).

**Root cause that made everything remotely exploitable:** `POST /api/data` had **zero auth** + `Access-Control-Allow-Origin: *`, so anyone could overwrite the entire CMS. Because `index.html` renders CMS fields into `innerHTML` (friends `code` = raw HTML at ~line 812, unescaped `href`/`src` at ~420/431/1073), that unauth write was also a **stored-XSS** vector on the public site. Additionally the admin password was stored in the CMS blob as `d.adminPw` and served to anyone via `GET /api/data`.

**Fixes applied:**
- Added `api/_lib.js` (shared): rate limiter (KV fixed-window + in-memory fallback), scrypt password verify, HMAC bearer sessions, SSRF-safe fetch.
- `POST /api/data` now requires a valid bearer token; body size-capped (512KB); strips `adminPw`/secrets before storing; `GET` strips the same before serving. New `api/login.js` + `api/change-password.js`.
- Client (`admin.html`) now logs in via `/api/login`, carries the token, and changes password via `/api/change-password`. Removed the plaintext `DEFAULT_PW`/`getAdminPw`/`d.adminPw` logic and the localStorage plaintext password.
- **Rate limiting** on all endpoints (login 8/15min; data-post 20/min; proxies 40/min; data-get 120/min).
- **SSRF** fixed in `api/og-preview.js`: blocks non-http(s), private/loopback/link-local/metadata IPs (incl. DNS resolution + redirect re-validation), bounds response size/time; ReDoS-hardened regexes.
- Security headers added to `vercel.json` (Referrer-Policy, Permissions-Policy, HSTS, COOP; `no-store` on `/api/*`).

**Round 2 (adversarial review of the fixes found real bugs — all fixed):**
- **CRITICAL:** session-token signing key must never derive from committed constants. `sessionSecret()` now uses `SESSION_SECRET` env → a random secret persisted in KV (`reef-session-secret`) → per-process random; `createSession`/`verifySession`/`requireAuth` are now **async**. (Was forgeable when SESSION_SECRET+ADMIN_PASSWORD both unset.)
- **HIGH:** SSRF IPv6 bypass — added `ipv6ToBytes()` so hex-form IPv4-mapped (`::ffff:7f00:1`), dotted-mapped, and NAT64 all resolve to their embedded IPv4 and get blocked.
- **HIGH:** SSRF TOCTOU/DNS-rebind — `safeFetchText` rewritten on `node:http`/`https` with a `pinnedLookup` that validates ALL resolved IPs and pins the connection (honors `all:true` happy-eyeballs form). Public fetch still works.
- **HIGH:** rate-limit XFF spoof — `clientIp` now prefers `x-real-ip` (Vercel-set), else the RIGHTMOST XFF hop.
- **HIGH:** `api/github-repo.js` path traversal — owner/repo validated `^[A-Za-z0-9._-]+$`, reject `.`/`..`.
- **HIGH:** client XSS — `safeUrl()` strips control chars (charCode filter, no `\u` literals) and restricts `data:` to raster; hardened previously-missed sinks (renderFriends onerror JS-injection via name, renderGamesTab/renderOGItem/openLibModal/renderLibraryItem img/href).
- **MED:** `stripSensitive` now recursive; og-preview returns a generic error (no SSRF oracle); `doLogout` clears the bearer token.

Intentionally kept: the hashed backup password (user requirement — `DISABLE_BACKUP_PASSWORD=1` to turn off).

**Verification:** 51 passing node tests — `test-auth.mjs` (34: passwords/backup/env, async session sign/verify/expiry, **forged-token rejection**, SSRF incl. hex-mapped IPv6 + NAT64) and `test-handlers.mjs` (17: login→token→authorized-write, path-traversal, SSRF oracle). Live-tested: public HTTPS fetch works while rebind/metadata/hex-mapped blocked. See [[reef-admin-auth]].

**Follow-ups:** friends `code` field is raw-HTML-by-design (admin-only now); no strict CSP (both HTML files rely on inline scripts/handlers).

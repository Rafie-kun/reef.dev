---
name: reef-admin-auth
description: How reef.dev admin authentication works after the 2026-08 hardening
metadata: 
  node_type: memory
  type: project
  originSessionId: 5fd2f49c-4c57-48fc-bc87-d4f610f2af12
  modified: 2026-08-14T13:33:16.916Z
---

Admin auth for reef.dev is **enforced server-side** (as of 2026-08-14). `admin.html`'s login screen is only a cosmetic gate — the real checks live in `api/_lib.js`.

- **Login:** `POST /api/login {password}` → verifies server-side, returns `{token}` (HMAC-signed bearer token, 8h TTL). Client stores it in `sessionStorage['reef-admin-token']` and sends `Authorization: Bearer <token>` on every write. No cookies → no CSRF surface.
- **Password precedence** (`verifyPassword` in `api/_lib.js`): `ADMIN_PASSWORD` env var → scrypt hash stored in KV under key `reef-admin-pw-hash` → hashed backup password. All comparisons are constant-time.
- **Backup credential:** the site's original default password still works as an emergency fallback. Its scrypt hash is embedded in `api/_lib.js` as `BACKUP_PW_HASH`; the **plaintext is deliberately not in the repo**. Disable with env `DISABLE_BACKUP_PASSWORD=1`.
- **Change password:** `POST /api/change-password {newPassword}` (auth required, min 8 chars) → stores a fresh scrypt hash in KV. Requires a KV backend; otherwise returns 503 telling the operator to use `ADMIN_PASSWORD`. Never writes the password into the public CMS blob.
- **Session secret:** `SESSION_SECRET` env var signs tokens; if unset, a deterministic key is derived from `ADMIN_PASSWORD` + the backup hash (so tokens validate across serverless instances).

To rotate the backup hash: run scrypt(pw, randomSalt, 64) and replace `BACKUP_PW_HASH` (`salt:hash` hex) in `api/_lib.js`.

Related: [[reef-security-hardening]], [[reef-project-overview]].

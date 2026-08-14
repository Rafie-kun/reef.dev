---
name: reef-project-overview
description: "What reef.dev is, its stack, and the key files/entry points"
metadata: 
  node_type: memory
  type: project
  originSessionId: 5fd2f49c-4c57-48fc-bc87-d4f610f2af12
  modified: 2026-08-14T13:33:06.370Z
---

**reef.dev** is a Minecraft-themed personal portfolio for "Reef", deployed on Vercel.

- Mostly static: [index.html](index.html) (public page, ~115KB, single-file) and [admin.html](admin.html) (admin CMS dashboard, ~92KB, single-file). Both inline all their JS/CSS.
- Build is Vite (`npm run build` → `vite build`); `type: module` so `.js` files are ESM. Tailwind v4 via `@tailwindcss/vite`. Despite AGENTS.md mentioning Next.js, this project is **Vite, not Next.js**.
- Serverless API under `api/*.js` (Vercel Node functions): `data.js` (CMS read/write), `login.js`, `change-password.js`, and proxy endpoints `og-preview.js`, `github-repo.js`, `steam-lookup.js`, `discord-app-icon.js`. Files prefixed `_` (e.g. `_lib.js`) are shared modules, not routes.
- Persistence: `@vercel/kv` (Redis) first, then `@vercel/blob`, else falls back to browser localStorage. Configured via `KV_URL` / `BLOB_READ_WRITE_TOKEN` env vars (see [AGENTS.md](AGENTS.md)).
- Admin panel served at `/admin` (rewrite in [vercel.json](vercel.json)).

See [[reef-admin-auth]] and [[reef-security-hardening]].

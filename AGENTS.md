<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:vercel-env -->
# Vercel Environment Variables (api/data.js persistence)

api/data.js uses `@vercel/kv` (Redis) or `@vercel/blob` as backend storage.
At least one must be configured in Vercel Project Dashboard > Settings > Environment Variables:

- **KV_URL** — Set automatically when you create a Vercel KV database instance
  (Vercel Dashboard > Storage > Create Database > KV). The URL is auto-populated as an env var.
- **BLOB_READ_WRITE_TOKEN** — Set automatically when you create a Vercel Blob store
  (Vercel Dashboard > Storage > Create Database > Blob). The token is auto-populated as an env var.

Neither is required for the site to function — data falls back to localStorage. But without
at least one, saves do not persist across devices. The admin UI shows a visible warning
when no storage backend is available.

If both are configured, KV is tried first, then Blob as fallback.
<!-- END:vercel-env -->

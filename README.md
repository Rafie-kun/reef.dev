# Reef — Minecraft-Themed Portfolio

A full-stack personal portfolio website for **Reef**, styled after the Minecraft Java Edition homepage with late-2000s retro web vibes.

Built with **Next.js 14** (App Router), **Tailwind CSS**, custom **Web Audio API** sound engine, and **Lanyard WebSocket** for real-time Discord/Spotify presence.

---

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS v4 + custom CSS
- **Fonts**: Press Start 2P (headings), VT323 (body)
- **Audio**: Web Audio API synthesis (17 sound events, all self-contained)
- **Discord Presence**: Lanyard WebSocket (`wss://api.lanyard.rest/socket`)
- **Data Persistence**: JSON file storage (`/public/data/cms.json`)
- **Auth**: bcrypt + JWT session cookies
- **Icons**: Custom SVG pixel art icons (24+ Minecraft-styled icons)

---

## Setup

### 1. Clone and install

```bash
git clone <repo-url>
cd reef-portfolio
npm install
```

### 2. Environment variables

Copy `.env.example` to `.env.local` and fill in:

```bash
cp .env.example .env.local
```

| Variable | Required | Description |
|---|---|---|
| `DISCORD_BOT_TOKEN` | Yes | Discord Bot token to fetch profile/avatar |
| `ADMIN_PASSWORD_HASH` | Yes | bcrypt hash of your admin password |
| `JWT_SECRET` | Yes | Random 32-char secret for session signing |
| `DATABASE_URL` | No | Turso/Supabase connection string |
| `GITHUB_TOKEN` | No | GitHub PAT for higher API rate limits |

Generate `ADMIN_PASSWORD_HASH`:

```bash
node -e "console.log(require('bcryptjs').hashSync('your-password',10))"
```

Generate `JWT_SECRET`:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3. Run dev server

```bash
npm run dev
```

### 4. Build for production

```bash
npm run build
npm start
```

---

## Deploy to Vercel

1. Push to GitHub
2. Import repo in Vercel
3. Add environment variables in Vercel Dashboard → Settings → Environment Variables
4. Deploy — zero config needed

---

## Admin Dashboard

Access at `/admin` — password protected.

### Features:
- **Bio Editor** — Edit your bio and email
- **Social Links Manager** — Add/edit/remove social platform links
- **Library Manager** — Manage Games, Music, Projects, Reading tabs
- **Friends Badges Manager** — Add 88x31 web badges with name and URL
- **Projects Manager** — Showcase personal projects
- **Easter Egg Phrases** — Edit the rotating "Also try..." phrases
- **Sound Settings** — Toggle default sound on/off

All changes persist to `public/data/cms.json`.

---

## Sound System

The site includes a complete Web Audio API sound engine. All sounds are **synthesized at runtime** — no external files needed.

To replace synthesized sounds with real Minecraft `.ogg` files:

1. Drop `.ogg` files into `/public/sounds/` with these names:
   - `click.ogg`, `hover.ogg`, `nav-select.ogg`, `section-enter.ogg`
   - `save-success.ogg`, `tab-switch.ogg`, `login-success.ogg`

2. The engine will auto-detect and prefer loaded files.

Sound is toggleable via the speaker block button in the footer (persisted to localStorage).

---

## 88x31 Badges

Add your own 88x31 friend badges via the admin dashboard. Place badge images in `/public/badges/` or link external URLs.

To create a custom 88x31 badge for Reef to share:
1. Design an 88×31 pixel PNG
2. Upload via admin dashboard or place in `/public/badges/`
3. Share the direct URL with friends

---

## Structure

```
src/
├── app/
│   ├── page.tsx              # Main page (all sections)
│   ├── layout.tsx            # Root layout + fonts
│   ├── client-layout.tsx     # Client wrapper (audio init)
│   ├── globals.css           # Tailwind + Minecraft styles
│   ├── admin/                # Admin dashboard pages
│   │   ├── page.tsx          # Login page
│   │   └── dashboard/        # Dashboard + managers
│   └── api/                  # API routes
│       ├── auth/             # Login/verify
│       ├── discord/          # Discord profile
│       ├── github/           # GitHub repos
│       ├── lanyard/          # Lanyard presence data
│       └── cms/              # CMS CRUD endpoints
├── components/               # All React components
├── lib/                      # Core libraries
│   ├── audio.ts              # Web Audio API engine
│   ├── icons.ts              # SVG pixel art icon defs
│   ├── types.ts              # TypeScript types
│   ├── auth.ts               # Password + JWT helpers
│   ├── db.ts                 # File-based data store
│   └── lanyard.ts            # Lanyard WebSocket hook
├── public/
│   ├── sounds/               # .ogg sound files
│   ├── badges/               # 88x31 badge images
│   └── data/cms.json         # CMS data store
└── .env.example
```

---

## Features

- [x] Minecraft main-menu style hero section
- [x] Real-time Discord status via Lanyard WebSocket
- [x] Live Spotify now-playing via Discord Rich Presence
- [x] GitHub pinned repos in chest inventory grid
- [x] Library with creative inventory tabs (Games/Music/Projects/Reading)
- [x] 88x31 friend badges grid
- [x] Admin dashboard with full CMS
- [x] Web Audio API sound engine (17 events)
- [x] Custom SVG pixel art icons (24 icons)
- [x] Custom scrollbar, cursor, selection colors
- [x] Mobile responsive
- [x] Custom fonts (Press Start 2P, VT323)
- [x] Animated panorama background with particles
- [x] Sound toggle (persisted)
- [x] Admin password protection (bcrypt + JWT)

---

## License

© Reef 2026. Do not distribute!

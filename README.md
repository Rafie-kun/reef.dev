# REEF — Minecraft Portfolio Site

A fully static single-file Minecraft-themed personal portfolio.  
No build step. No Node.js. No framework. Just drop it on Vercel.

---

## 🚀 Deploy to Vercel (3 steps)

1. Push this folder to a GitHub repo
2. Go to vercel.com → New Project → Import your repo
3. Deploy — that's it. No env vars needed for the basic site.

---

## 🔑 Admin Dashboard

Visit `/admin` on your live site.

**Default password:** `reef2026`

> ⚠️ Change this immediately after first login via Settings → Change Admin Password.
> The new password is stored in your browser's localStorage on the device you use to manage the site.

### What you can edit from admin:
- Bio text & display name
- Email address
- All social links (Discord, GitHub, Twitter, Instagram, Spotify + extras)
- Library tabs (Games, Music, Projects, Reading)
- Friends' 88x31 badges (image URL + link URL)
- Projects showcase
- "Also try..." Easter egg phrases
- Background image (paste any image URL to overlay the panorama)
- Default sound on/off for visitors
- Admin password

---

## 🎵 Sound Files (optional upgrade)

The site synthesizes all Minecraft-style sounds via Web Audio API with no files needed.

To use real Minecraft sounds (for personal use only):
1. Extract sounds from your Minecraft `.jar` file (`assets/minecraft/sounds/`)
2. Place `.ogg` files in a `/sounds/` folder
3. The audio engine automatically prefers real files over synthesis

---

## 🖼️ Custom Background

In the admin panel under **Appearance**, paste any direct image URL.  
Works best with a Minecraft screenshot (1920×1080+).  
The image overlays the animated panorama at ~35% opacity.

---

## 👾 88x31 Friend Badges

In the admin panel under **Friends / Badges**:
- Click **+ Add Badge**
- Paste your friend's badge image URL (88×31 PNG)
- Paste their site URL
- Save

Make your own badge at: https://88x31.netlify.app  
Or browse existing ones at: https://cyber.dabamos.de/88x31/

---

## 🔗 Discord Live Status

The site connects to the [Lanyard API](https://lanyard.rest) WebSocket automatically.  
It shows your real-time Discord status, current activity, and Spotify now-playing.  

**Your Discord ID is already set:** `744808879036170272`

No bot token needed for the static version — Lanyard handles it.

---

## 📁 File Structure

```
reef-site/
  index.html    ← Main portfolio page (everything in one file)
  admin.html    ← Admin CMS dashboard  
  vercel.json   ← Routing config (admin URL)
  README.md     ← This file
```

---

## ✏️ Quick Edits (without admin panel)

Open `index.html` and search for these easy-to-find spots:

| What | Search for |
|------|-----------|
| Bio text | `Hey, I'm Reef` |
| Social links | `discord.com/users/` |
| Library items | `inv-item` |
| Friend badges | `badge-placeholder` |
| Easter eggs | `alsoTries` array |
| Discord ID | `744808879036170272` |
| GitHub username | `Rafie-kun` |

---

Built by Claude for Reef 🎮

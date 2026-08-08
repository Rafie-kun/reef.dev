const fs = require('fs');
const path = require('path');

// 1. Pixel-perfect 8x8 Minecraft Creeper Face matching user's image
const creeperSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8" width="64" height="64" style="image-rendering:pixelated">
  <!-- Row 0 -->
  <rect x="0" y="0" width="1" height="1" fill="#72d64d"/>
  <rect x="1" y="0" width="1" height="1" fill="#3fb928"/>
  <rect x="2" y="0" width="1" height="1" fill="#72d64d"/>
  <rect x="3" y="0" width="1" height="1" fill="#8ce868"/>
  <rect x="4" y="0" width="1" height="1" fill="#72d64d"/>
  <rect x="5" y="0" width="1" height="1" fill="#3fb928"/>
  <rect x="6" y="0" width="1" height="1" fill="#72d64d"/>
  <rect x="7" y="0" width="1" height="1" fill="#249610"/>

  <!-- Row 1 -->
  <rect x="0" y="1" width="1" height="1" fill="#249610"/>
  <rect x="1" y="1" width="1" height="1" fill="#3fb928"/>
  <rect x="2" y="1" width="1" height="1" fill="#148008"/>
  <rect x="3" y="1" width="1" height="1" fill="#3fb928"/>
  <rect x="4" y="1" width="1" height="1" fill="#249610"/>
  <rect x="5" y="1" width="1" height="1" fill="#72d64d"/>
  <rect x="6" y="1" width="1" height="1" fill="#148008"/>
  <rect x="7" y="1" width="1" height="1" fill="#d4d4d4"/>

  <!-- Row 2 -->
  <rect x="0" y="2" width="1" height="1" fill="#148008"/>
  <rect x="1" y="2" width="2" height="2" fill="#050505"/> <!-- Left Eye -->
  <rect x="3" y="2" width="1" height="1" fill="#3fb928"/>
  <rect x="4" y="2" width="1" height="1" fill="#249610"/>
  <rect x="5" y="2" width="2" height="2" fill="#050505"/> <!-- Right Eye -->
  <rect x="7" y="2" width="1" height="1" fill="#a4a4a4"/>

  <!-- Row 3 -->
  <rect x="0" y="3" width="1" height="1" fill="#3fb928"/>
  <!-- Left eye bottom in fill -->
  <rect x="3" y="3" width="1" height="1" fill="#148008"/>
  <rect x="4" y="3" width="1" height="1" fill="#3fb928"/>
  <!-- Right eye bottom in fill -->
  <rect x="7" y="3" width="1" height="1" fill="#3fb928"/>

  <!-- Row 4 -->
  <rect x="0" y="4" width="1" height="1" fill="#72d64d"/>
  <rect x="1" y="4" width="1" height="1" fill="#3fb928"/>
  <rect x="2" y="4" width="1" height="1" fill="#249610"/>
  <rect x="3" y="4" width="2" height="3" fill="#050505"/> <!-- Nose/Mouth center stem -->
  <rect x="5" y="4" width="1" height="1" fill="#3fb928"/>
  <rect x="6" y="4" width="1" height="1" fill="#a4a4a4"/>
  <rect x="7" y="4" width="1" height="1" fill="#3fb928"/>

  <!-- Row 5 -->
  <rect x="0" y="5" width="1" height="1" fill="#249610"/>
  <rect x="1" y="5" width="1" height="1" fill="#148008"/>
  <rect x="2" y="5" width="1" height="2" fill="#050505"/> <!-- Left Mouth Wing -->
  <rect x="5" y="5" width="1" height="2" fill="#050505"/> <!-- Right Mouth Wing -->
  <rect x="6" y="5" width="1" height="1" fill="#249610"/>
  <rect x="7" y="5" width="1" height="1" fill="#249610"/>

  <!-- Row 6 -->
  <rect x="0" y="6" width="1" height="1" fill="#a8e8a8"/>
  <rect x="1" y="6" width="1" height="1" fill="#249610"/>
  <rect x="6" y="6" width="1" height="1" fill="#72d64d"/>
  <rect x="7" y="6" width="1" height="1" fill="#148008"/>

  <!-- Row 7 -->
  <rect x="0" y="7" width="1" height="1" fill="#249610"/>
  <rect x="1" y="7" width="1" height="1" fill="#3fb928"/>
  <rect x="2" y="7" width="1" height="1" fill="#148008"/>
  <rect x="3" y="7" width="2" height="1" fill="#72d64d"/> <!-- Mouth cutout -->
  <rect x="5" y="7" width="1" height="1" fill="#148008"/>
  <rect x="6" y="7" width="1" height="1" fill="#3fb928"/>
  <rect x="7" y="7" width="1" height="1" fill="#249610"/>
</svg>`;

// 2. Rafie Card Image matching exact pixel RPG party banner image with "rafie" label
const rafieCardSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 96" width="256" height="96">
  <defs>
    <linearGradient id="purpleBg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#3b0764"/>
      <stop offset="30%" stop-color="#581c87"/>
      <stop offset="70%" stop-color="#7e22ce"/>
      <stop offset="100%" stop-color="#a855f7"/>
    </linearGradient>
  </defs>
  <!-- Background Card -->
  <rect width="256" height="96" rx="8" fill="url(#purpleBg)" stroke="#d8b4fe" stroke-width="2"/>
  
  <!-- Pixel Stars & Planet -->
  <circle cx="30" cy="20" r="10" fill="none" stroke="#e9d5ff" stroke-width="1.5" opacity="0.6"/>
  <ellipse cx="30" cy="20" rx="16" ry="5" fill="none" stroke="#e9d5ff" stroke-width="1" opacity="0.6"/>
  <rect x="120" y="15" width="2" height="2" fill="#fff"/>
  <rect x="200" y="25" width="3" height="3" fill="#f472b6"/>
  <rect x="220" y="12" width="2" height="2" fill="#fff"/>

  <!-- Character 1: Rogue / Ninja (Left) -->
  <g transform="translate(20, 28)">
    <rect x="8" y="12" width="12" height="20" fill="#1e1b4b"/>
    <circle cx="14" cy="18" r="7" fill="#fbcfe8"/>
    <rect x="10" y="15" width="8" height="4" fill="#09090b"/>
    <polygon points="2,28 10,24 8,30" fill="#e2e8f0"/> <!-- Dagger -->
  </g>

  <!-- Character 2: Bat/Bunny Girl (Center-Left) -->
  <g transform="translate(70, 20)">
    <path d="M4 12 Q 14 0 24 12 Q 14 8 4 12 Z" fill="#f472b6"/> <!-- Bat Wings / Bow -->
    <circle cx="14" cy="22" r="8" fill="#fbcfe8"/>
    <rect x="8" y="30" width="12" height="22" fill="#38bdf8"/>
  </g>

  <!-- Character 3: Mage Wizard (Center-Right) -->
  <g transform="translate(130, 16)">
    <polygon points="14,0 2,24 26,24" fill="#facc15"/> <!-- Wizard Hat -->
    <rect x="6" y="20" width="16" height="4" fill="#38bdf8"/>
    <circle cx="14" cy="28" r="7" fill="#fbcfe8"/>
    <rect x="8" y="34" width="12" height="20" fill="#fb923c"/>
  </g>

  <!-- Character 4: Knight with Shield (Right) -->
  <g transform="translate(185, 18)">
    <rect x="6" y="6" width="16" height="12" fill="#94a3b8"/> <!-- Helmet -->
    <rect x="10" y="10" width="8" height="2" fill="#0f172a"/>
    <rect x="4" y="18" width="20" height="32" fill="#64748b"/>
    <rect x="0" y="22" width="10" height="24" rx="2" fill="#cbd5e1" stroke="#334155"/> <!-- Shield -->
  </g>

  <!-- Custom "rafie" Badge Label in Corner -->
  <g transform="translate(180, 72)">
    <rect width="68" height="18" rx="4" fill="#09090b" opacity="0.85" stroke="#f472b6" stroke-width="1.5"/>
    <text x="34" y="13" font-family="'Press Start 2P', monospace" font-size="8" fill="#f472b6" text-anchor="middle" font-weight="bold">RAFIE</text>
  </g>
</svg>`;

const dirs = ['public/assets', 'assets', 'public/assets/mc', 'assets/mc'];
dirs.forEach(d => { if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true }); });

fs.writeFileSync('public/assets/rafie-badge.svg', rafieCardSvg);
fs.writeFileSync('assets/rafie-badge.svg', rafieCardSvg);
fs.writeFileSync('public/assets/mc/creeper.svg', creeperSvg);
fs.writeFileSync('assets/mc/creeper.svg', creeperSvg);

console.log('✅ Generated Creeper and Rafie Card SVGs!');

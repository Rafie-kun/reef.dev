const fs = require('fs');
const path = require('path');

const icons = {
  'oak_planks.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><rect width="16" height="16" fill="#a07040"/><rect x="1" y="1" width="14" height="14" fill="#b88048"/><rect x="0" y="4" width="16" height="1" fill="#784820"/><rect x="0" y="8" width="16" height="1" fill="#784820"/><rect x="0" y="12" width="16" height="1" fill="#784820"/><rect x="5" y="1" width="1" height="3" fill="#885828"/><rect x="11" y="5" width="1" height="3" fill="#885828"/><rect x="4" y="9" width="1" height="3" fill="#885828"/></svg>`,
  'stick.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><rect x="12" y="2" width="2" height="2" fill="#885828"/><rect x="10" y="4" width="2" height="2" fill="#704018"/><rect x="8" y="6" width="2" height="2" fill="#583010"/><rect x="6" y="8" width="2" height="2" fill="#704018"/><rect x="4" y="10" width="2" height="2" fill="#583010"/><rect x="2" y="12" width="2" height="2" fill="#402008"/></svg>`,
  'iron_ingot.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><rect x="3" y="6" width="10" height="5" fill="#d8d8d8"/><rect x="2" y="7" width="12" height="3" fill="#e8e8e8"/><rect x="4" y="6" width="8" height="1" fill="#ffffff"/><rect x="3" y="10" width="10" height="1" fill="#a0a0a0"/></svg>`,
  'gold_ingot.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><rect x="3" y="6" width="10" height="5" fill="#e0b000"/><rect x="2" y="7" width="12" height="3" fill="#f8d010"/><rect x="4" y="6" width="8" height="1" fill="#fff880"/><rect x="3" y="10" width="10" height="1" fill="#b08000"/></svg>`,
  'coal.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><rect x="4" y="4" width="8" height="8" fill="#202020"/><rect x="5" y="3" width="6" height="10" fill="#282828"/><rect x="3" y="5" width="10" height="6" fill="#181818"/><rect x="6" y="5" width="2" height="2" fill="#404040"/></svg>`,
  'torch.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><rect x="7" y="2" width="2" height="2" fill="#ffcc00"/><rect x="6" y="3" width="4" height="2" fill="#ff6600"/><rect x="7" y="5" width="2" height="2" fill="#583010"/><rect x="7" y="7" width="2" height="7" fill="#704018"/></svg>`,
  'apple.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><rect x="5" y="4" width="6" height="9" fill="#d01818"/><rect x="4" y="5" width="8" height="7" fill="#e82828"/><rect x="8" y="2" width="1" height="3" fill="#583010"/><rect x="9" y="2" width="2" height="1" fill="#48b020"/><rect x="5" y="5" width="2" height="2" fill="#ffffff" opacity="0.6"/></svg>`,
  'golden_apple.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><rect x="5" y="4" width="6" height="9" fill="#d0a000"/><rect x="4" y="5" width="8" height="7" fill="#ffd818"/><rect x="8" y="2" width="1" height="3" fill="#583010"/><rect x="9" y="2" width="2" height="1" fill="#48b020"/><rect x="5" y="5" width="2" height="2" fill="#ffffff" opacity="0.8"/></svg>`,
  'diamond_block.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><rect width="16" height="16" fill="#288888"/><rect x="1" y="1" width="14" height="14" fill="#50e0e0"/><rect x="2" y="2" width="12" height="12" fill="#78f8f8"/><rect x="3" y="3" width="4" height="4" fill="#ffffff"/></svg>`,
  'obsidian.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><rect width="16" height="16" fill="#100818"/><rect x="1" y="1" width="14" height="14" fill="#1b1028"/><rect x="3" y="3" width="3" height="3" fill="#382050"/><rect x="9" y="8" width="4" height="4" fill="#281838"/></svg>`,
  'beacon.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><rect x="1" y="1" width="14" height="14" fill="#a0f0f0" opacity="0.6"/><rect x="2" y="2" width="12" height="12" fill="#100818"/><rect x="4" y="4" width="8" height="8" fill="#50e0e0"/><rect x="6" y="6" width="4" height="4" fill="#ffffff"/><rect x="2" y="13" width="12" height="2" fill="#100818"/></svg>`,
  'redstone.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><rect x="5" y="5" width="6" height="6" fill="#cc0000"/><rect x="4" y="6" width="8" height="4" fill="#ff2222"/><rect x="6" y="4" width="4" height="8" fill="#ff2222"/><rect x="6" y="6" width="2" height="2" fill="#ff8888"/></svg>`
};

const dir = 'public/assets/mc';
const dirRoot = 'assets/mc';
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
if (!fs.existsSync(dirRoot)) fs.mkdirSync(dirRoot, { recursive: true });

for (const [file, content] of Object.entries(icons)) {
  fs.writeFileSync(path.join(dir, file), content);
  fs.writeFileSync(path.join(dirRoot, file), content);
}

console.log('✅ Created missing Minecraft SVGs in public/assets/mc and assets/mc');

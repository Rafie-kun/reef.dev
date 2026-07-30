// Generates SVG data-URI CSS for .mc-item i-* icon classes
// Each icon: array of {x,y,w,h,color} rects on a 16x16 grid

const icons = {};

function r(x,y,w,h,c){return{x,y,w,h,c}}

// ── NAV BAR ICONS ──────────────────────────────────────────────

// i-grass: Grass block – isometric 3-face, grass top, dirt sides
icons['i-grass'] = [
  // Top grass face (diamond rows)
  r(6,1,4,1,'#7ecb48'), r(5,2,6,1,'#7ecb48'), r(4,3,8,1,'#7ecb48'),
  r(3,4,10,1,'#7ecb48'), r(2,5,12,1,'#7ecb48'),
  // Dirt left face
  r(2,6,6,7,'#8b623e'), r(3,13,5,1,'#8b623e'), r(4,14,4,1,'#8b623e'), r(5,15,3,1,'#8b623e'),
  // Dirt right face (darker shading)
  r(8,6,6,7,'#65422c'), r(8,13,5,1,'#65422c'), r(8,14,4,1,'#65422c'), r(8,15,3,1,'#65422c'),
  // Grass top highlight noise
  r(7,2,1,1,'#a2dd6c'), r(9,3,1,1,'#a2dd6c'), r(6,4,1,1,'#a2dd6c'), r(10,4,1,1,'#a2dd6c'),
  r(12,5,1,1,'#a2dd6c'), r(4,5,1,1,'#a2dd6c'),
  // Dirt left face noise
  r(3,7,1,1,'#4a2e14'), r(5,9,1,1,'#4a2e14'), r(4,11,1,1,'#4a2e14'),
  r(5,13,1,1,'#4a2e14'), r(3,15,1,1,'#4a2e14'),
  // Dirt right face noise
  r(9,7,1,1,'#7a5230'), r(11,9,1,1,'#7a5230'), r(10,11,1,1,'#7a5230'),
  r(12,10,1,1,'#7a5230'), r(9,5,1,1,'#7a5230'),
  // Stone speckles
  r(4,10,1,1,'#5a4a3a'), r(10,15,1,1,'#5a4a3a'),
];

// i-book: Written book – brown cover, gold spine, red bookmark
icons['i-book'] = [
  // Cover background
  r(2,1,12,13,'#8b4e22'),
  // Dark edge outline
  r(1,0,14,1,'#6b3410'), r(1,0,1,14,'#6b3410'), r(14,0,1,14,'#6b3410'),
  r(1,13,14,1,'#6b3410'),
  // Gold spine/trim – left and right
  r(2,1,1,12,'#c4a870'), r(13,1,1,12,'#c4a870'),
  // Gold trim top/bottom
  r(2,1,12,1,'#c4a870'), r(2,12,12,1,'#c4a870'),
  // Page edges (white hint at bottom)
  r(3,11,10,1,'#e8dcc8'), r(4,12,8,1,'#d4c8b0'),
  // Cover highlight
  r(4,3,1,1,'#a06030'), r(10,3,1,1,'#a06030'), r(4,9,1,1,'#a06030'),
  // Cover dark shade
  r(11,4,1,1,'#6b3410'), r(11,8,1,1,'#6b3410'),
  // Red bookmark ribbon
  r(7,13,2,1,'#c04040'), r(8,14,1,2,'#c04040'),
  // Bookmark highlight
  r(7,13,1,1,'#d06060'),
];

// i-pick: Stone pickaxe – stone head, wood handle
icons['i-pick'] = [
  // Pickaxe head (stone, angled)
  r(2,1,12,1,'#b0b5b8'), r(1,2,14,1,'#c0c5c8'), r(1,3,8,1,'#a4aaad'),
  r(2,4,6,1,'#a4aaad'), r(3,5,4,1,'#a4aaad'),
  // Head highlight
  r(2,1,3,1,'#d0d5d8'), r(2,2,4,1,'#d0d5d8'),
  // Head dark shading
  r(11,1,3,1,'#888'), r(12,2,3,1,'#888'), r(10,3,5,1,'#888a8c'),
  // Handle (wood)
  r(6,7,4,10,'#80522b'),
  // Handle right shadow
  r(8,7,2,10,'#603a18'),
  // Handle left highlight
  r(6,7,1,10,'#9a6a3a'),
  // Handle bottom grip
  r(5,14,6,2,'#5a3a1a'), r(6,13,4,1,'#6b4528'),
  // Crossguard (horizontal bar)
  r(4,6,8,1,'#a4aaad'), r(5,5,6,1,'#b0b5b8'),
  // Crossguard shading
  r(10,6,2,1,'#888'),
];

// i-note: Written book / note block – purple, gold trim, redstone torch
icons['i-note'] = [
  // Purple cover
  r(2,1,12,13,'#7a4aaa'),
  // Dark edge outline
  r(1,0,14,1,'#5a308a'), r(1,0,1,14,'#5a308a'), r(14,0,1,14,'#5a308a'),
  r(1,13,14,1,'#5a308a'),
  // Gold trim
  r(2,1,12,1,'#c4a870'), r(2,12,12,1,'#c4a870'),
  r(2,1,1,12,'#9a6aca'), r(13,1,1,12,'#9a6aca'),
  // Cover highlight
  r(4,3,8,1,'#9a6aca'), r(4,5,6,1,'#9a6aca'), r(4,7,4,1,'#9a6aca'),
  // Cover shading
  r(10,4,3,1,'#5a308a'), r(10,8,3,1,'#5a308a'),
  // Redstone torch on top (on the cover, not above it)
  r(7,1,2,1,'#c04040'), r(7,2,2,1,'#e06060'),
  r(8,1,1,3,'#f08080'),
  // Torch base
  // Bookmark
  r(10,13,2,1,'#c04040'), r(11,14,1,2,'#c04040'),
];

// i-map: Explorer map – parchment with markings
icons['i-map'] = [
  // Parchment base
  r(1,1,14,14,'#d0bc83'),
  // Dark border (map edge)
  r(0,0,16,1,'#6d4c25'), r(0,0,1,16,'#6d4c25'),
  r(15,0,1,16,'#6d4c25'), r(0,15,16,1,'#6d4c25'),
  // Parchment inner shade
  r(1,1,14,1,'#d8c490'), r(1,1,1,14,'#c8b478'),
  // Green terrain
  r(3,4,4,3,'#7a9e5a'), r(3,4,4,1,'#8aae6a'),
  r(8,6,5,4,'#5a8a4a'), r(8,6,5,1,'#6a9a5a'),
  // Water (blue)
  r(8,3,5,2,'#4a8ab4'), r(8,3,5,1,'#5a9ac4'),
  r(3,8,4,4,'#3a7aa4'),
  // Red marker (X)
  r(10,9,2,2,'#c04040'), r(11,9,1,1,'#d06060'),
  // Brown path
  r(2,12,6,2,'#8b623e'), r(2,12,6,1,'#9b724e'),
  // Map detail noise
  r(12,11,2,1,'#6b4528'), r(6,3,1,1,'#6b4528'),
  r(4,6,1,1,'#5a7e3a'), r(13,7,1,1,'#5a7e3a'),
  // Compass rose
  r(7,1,2,2,'#6d4c25'), r(8,1,1,1,'#8b623e'),
];

// i-chest: Chest – brown wood, gold lock, metal bands
icons['i-chest'] = [
  // Chest body (isometric block)
  // Top face
  r(4,1,8,1,'#8b6538'), r(3,2,10,1,'#7a5530'), r(2,3,12,1,'#7a5530'),
  r(2,4,12,1,'#6b451d'),
  // Left face
  r(2,5,7,9,'#6b451d'), r(3,14,6,1,'#6b451d'), r(4,15,5,1,'#6b451d'),
  // Right face (darker)
  r(9,5,5,9,'#4a2a10'), r(9,14,4,1,'#4a2a10'), r(9,15,3,1,'#4a2a10'),
  // Top face left highlight
  r(3,2,2,1,'#8b6538'), r(2,3,2,1,'#8b6538'),
  // Gold lock
  r(6,3,4,2,'#d4a040'), r(6,3,4,1,'#e8c060'),
  r(7,4,2,1,'#b08030'),
  // Metal bands
  r(2,8,12,1,'#7a7a7a'), r(9,8,5,1,'#5a5a5a'),
  // Band noise
  r(3,8,1,1,'#8a8a8a'), r(14,8,1,1,'#6a6a6a'),
  // Wood grain (left face)
  r(3,6,1,1,'#5a3a18'), r(5,9,1,1,'#5a3a18'),
  r(4,11,1,1,'#5a3a18'), r(7,13,1,1,'#5a3a18'),
  // Wood grain (right face)
  r(10,7,1,1,'#3a1a08'), r(12,10,1,1,'#3a1a08'),
  r(11,12,1,1,'#3a1a08'),
  // Left face shade bottom
  r(3,12,6,1,'#5a3a18'),
];

// i-players: Two player heads – different skins
icons['i-players'] = [
  // Player 1 (left) head
  r(2,2,5,5,'#d6b08a'), // skin
  r(2,1,5,1,'#4a3020'), // hair top
  r(1,2,1,5,'#4a3020'), // hair left
  r(6,2,1,3,'#4a3020'), // hair right
  // Player 1 eyes
  r(3,3,1,1,'#222'), r(5,3,1,1,'#222'),
  // Player 1 mouth
  r(3,5,3,1,'#4a3020'),
  // Player 1 nose
  r(4,4,1,1,'#c69570'),
  // Player 1 highlight
  r(4,2,2,1,'#c69570'),

  // Player 2 (right) head
  r(9,2,5,5,'#c69570'), // skin
  r(9,1,5,1,'#e8c040'), // hair top (blonde)
  r(8,2,1,5,'#e8c040'), // hair left
  r(14,2,1,3,'#e8c040'), // hair right
  // Player 2 eyes
  r(10,3,1,1,'#222'), r(12,3,1,1,'#222'),
  // Player 2 mouth
  r(10,5,3,1,'#8a6040'),
  // Player 2 nose
  r(11,4,1,1,'#a08060'),
  // Player 2 highlight
  r(11,2,2,1,'#a08060'),

  // Body hints below heads
  r(2,7,5,3,'#4e8c46'), // P1 body (green)
  r(3,7,3,1,'#5e9c56'),
  r(9,7,5,3,'#457cb4'), // P2 body (blue)
  r(10,7,3,1,'#558cc4'),
  // Arms
  r(1,7,1,3,'#d6b08a'), r(7,7,1,3,'#d6b08a'), // P1 arms
  r(8,7,1,3,'#c69570'), r(14,7,1,3,'#c69570'), // P2 arms
];

// i-sign: Signpost – wooden board, post
icons['i-sign'] = [
  // Post
  r(7,8,2,7,'#6b431b'), r(7,7,2,1,'#8b5e2a'),
  // Post shading
  r(8,8,1,7,'#4a2e10'),
  // Sign board
  r(2,2,12,6,'#b9853d'), r(1,1,14,1,'#8b5e2a'),
  r(1,1,1,7,'#8b5e2a'), r(14,1,1,7,'#8b5e2a'),
  r(1,7,14,1,'#8b5e2a'),
  // Board inner
  r(3,3,10,3,'#c8954a'),
  // Board highlight
  r(2,2,12,1,'#d3a15a'), r(2,2,1,5,'#d3a15a'),
  // Board text marks (nails)
  r(4,4,1,1,'#6b431b'), r(8,4,1,1,'#6b431b'), r(12,4,1,1,'#6b431b'),
  // Board bottom shadow
  r(3,6,10,1,'#a67030'),
  // Nail highlights
  r(4,3,1,1,'#8b5e2a'), r(8,3,1,1,'#8b5e2a'), r(12,3,1,1,'#8b5e2a'),
  // Post shadow on ground
  r(7,14,2,2,'#3a2010'), r(6,15,2,1,'#3a2010'),
];

// ── HELPERS ────────────────────────────────────────────────────

function svg(rects) {
  let s = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" shape-rendering="crispEdges">';
  for (const r of rects) {
    s += '<rect x="' + r.x + '" y="' + r.y + '" width="' + r.w + '" height="' + r.h + '" fill="' + r.c + '"/>';
  }
  return s + '</svg>';
}

function dataUri(svgStr) {
  // URL-encode for CSS data URI
  let out = '';
  for (let i = 0; i < svgStr.length; i++) {
    const ch = svgStr[i];
    if (ch === '<') out += '%3C';
    else if (ch === '>') out += '%3E';
    else if (ch === '#') out += '%23';
    else if (ch === '"') out += "'"; // use single quotes in SVG attributes
    else if (ch === '\\') out += '%5C';
    else if (ch === '^') out += '%5E';
    else if (ch === '`') out += '%60';
    else if (ch === '{') out += '%7B';
    else if (ch === '}') out += '%7D';
    else if (ch === '|') out += '%7C';
    else if (ch === ' ') out += '%20';
    else out += ch;
  }
  return 'data:image/svg+xml,' + out;
}

// ── GENERATE CSS ───────────────────────────────────────────────

for (const [cls, rects] of Object.entries(icons)) {
  const svgStr = svg(rects);
  const uri = dataUri(svgStr);
  // Ensure transparency by not setting background-color
  console.log('/* ' + cls + ' */');
  console.log('.' + cls + ':before{background:url("' + uri + '") center/contain no-repeat;image-rendering:pixelated}');
  console.log('.' + cls + ':after{display:none}');
  console.log('');
}

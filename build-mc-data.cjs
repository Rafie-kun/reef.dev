// build-mc-data.cjs — Generates official Minecraft icon set + crafting database
// Source: Mojang official client.jar (extracted to %TEMP%\opencode\mc)
// Outputs: assets/mc/icons/*.png + public/assets/mc/icons/*.png + mc-data.js (+ public copy)

const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');

const TMP = process.env.MC_TMP || 'C:\\Users\\h\\AppData\\Local\\Temp\\opencode\\mc';
const ROOT = __dirname;
const MC_VER = process.env.MC_VER || '26.2';

const readJSON = p => JSON.parse(fs.readFileSync(p, 'utf8'));
const has = fs.existsSync;
const join = path.join;

/* ---------------- PNG helpers ---------------- */
function loadPNG(kind, name) {
  const p = join(TMP, kind, name + '.png');
  if (!has(p)) return null;
  try { return PNG.sync.read(fs.readFileSync(p)); } catch { return null; }
}
function firstFrame(img) {
  const s = Math.min(img.width, img.height);
  if (s === img.width && s === img.height) return img;
  const out = new PNG({ width: s, height: s });
  for (let y = 0; y < s; y++) img.data.copy(out.data, y * s * 4, (y * img.width) * 4, (y * img.width + s) * 4);
  return out;
}
function tintPNG(img, rgb) {
  const out = new PNG({ width: img.width, height: img.height });
  img.data.copy(out.data);
  const d = out.data;
  for (let i = 0; i < d.length; i += 4) {
    d[i] = Math.min(255, d[i] * rgb[0] / 255);
    d[i + 1] = Math.min(255, d[i + 1] * rgb[1] / 255);
    d[i + 2] = Math.min(255, d[i + 2] * rgb[2] / 255);
  }
  return out;
}
function composite(top, over) { // blend `over` onto `top`
  const out = new PNG({ width: top.width, height: top.height });
  top.data.copy(out.data);
  const d = out.data, s = over.data;
  for (let i = 0; i < d.length; i += 4) {
    const a = s[i + 3];
    if (!a) continue;
    const na = a / 255, ia = 1 - na;
    d[i] = s[i] * na + d[i] * ia;
    d[i + 1] = s[i + 1] * na + d[i + 1] * ia;
    d[i + 2] = s[i + 2] * na + d[i + 2] * ia;
    d[i + 3] = Math.max(d[i + 3], a);
  }
  return out;
}

/* ---------------- Isometric cube renderer (32x32) ---------------- */
function sampleNearest(img, x, y) {
  x = Math.max(0, Math.min(img.width - 1, x | 0));
  y = Math.max(0, Math.min(img.height - 1, y | 0));
  const i = (y * img.width + x) * 4;
  return [img.data[i], img.data[i + 1], img.data[i + 2], img.data[i + 3]];
}
function blitFace(out, tex, mapFn, shade) {
  for (let py = 0; py < 32; py++) {
    for (let px = 0; px < 32; px++) {
      const cx = px + .5, cy = py + .5;
      const uv = mapFn(cx, cy);
      if (!uv) continue;
      const [r, g, b, a] = sampleNearest(tex, uv[0], uv[1]);
      if (a < 40) continue;
      const o = (py * 32 + px) * 4;
      out.data[o] = r * shade; out.data[o + 1] = g * shade; out.data[o + 2] = b * shade; out.data[o + 3] = 255;
    }
  }
}
// Face parametrizations for a standard MC iso cube on a 32x32 canvas
const MAP_TOP = (x, y) => {
  const u = y + (x - 16) / 2, v = y - (x - 16) / 2;
  return (u >= 0 && u < 16 && v >= 0 && v < 16) ? [u, v] : null;
};
const MAP_LEFT = (x, y) => {
  const u = x, v = 2 * y - 8 - x;
  return (x >= 0 && x < 16 && u >= 0 && u < 16 && v >= 0 && v < 16) ? [u, v] : null;
};
const MAP_RIGHT = (x, y) => {
  const u = x - 16, v = 2 * y + x - 40;
  return (x >= 16 && x < 32 && u >= 0 && u < 16 && v >= 0 && v < 16) ? [u, v] : null;
};
function isoCube(top, left, right) {
  const out = new PNG({ width: 32, height: 32 });
  if (top) blitFace(out, top, MAP_TOP, 1.0);
  if (left) blitFace(out, left, MAP_LEFT, 0.62);
  if (right) blitFace(out, right, MAP_RIGHT, 0.81);
  return out;
}

/* ---------------- Tints ---------------- */
const GREEN = [145, 189, 89]; // plains grass #91BD59
function tintForTex(name) {
  if (name.startsWith('birch_leaves')) return [128, 167, 85];
  if (name.startsWith('spruce_leaves')) return [97, 153, 97];
  if (/^(oak|jungle|acacia|dark_oak|mangrove|pale_oak)_leaves$/.test(name)) return [119, 171, 47];
  if (name === 'vine') return [119, 171, 47];
  if (name === 'grass_block_top' || name === 'grass_block_side_overlay' || name === 'short_grass' || name === 'fern' || name === 'tall_grass_top' || name === 'tall_grass_bottom' || name === 'large_fern_top' || name === 'large_fern_bottom') return GREEN;
  return null;
}
let hashSeed = 5381;
function hueFor(id) {
  let h = hashSeed;
  for (let i = 0; i < id.length; i++) h = ((h << 5) + h + id.charCodeAt(i)) & 0xffffffff;
  return Math.abs(h) % 360;
}
function hslToRgb(h, s, l) {
  s /= 100; l /= 100;
  const k = n => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = n => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [f(0) * 255, f(8) * 255, f(4) * 255];
}

/* ---------------- Model / texture resolution ---------------- */
const itemDefsDir = join(TMP, 'itemdefs');
const modelsDirs = [join(TMP, 'models', 'item'), join(TMP, 'models', 'block'), join(TMP, 'models', 'block', 'item')];

function findModelRef(obj) {
  let found = null;
  (function walk(o) {
    if (found || !o || typeof o !== 'object') return;
    if (Array.isArray(o)) { for (const v of o) walk(v); return; }
    for (const [k, v] of Object.entries(o)) {
      if ((k === 'model' || k === 'base') && typeof v === 'string' && v.startsWith('minecraft:')) { found = v.slice(10); return; }
      walk(v);
      if (found) return;
    }
  })(obj);
  return found;
}
function loadModel(ref) { // ref like "item/diamond" or "block/oak_stairs"
  const clean = ref.replace(/^minecraft:/, '');
  for (const dir of modelsDirs) {
    const p = join(dir, clean.replace(/^(item|block)\//, '') + '.json');
    if (has(p)) { try { return readJSON(p); } catch { return null; } }
  }
  return null;
}
function resolveModelChain(ref) {
  const textures = {};
  let cur = ref, guard = 0;
  while (cur && guard++ < 12) {
    const m = loadModel(cur);
    if (!m) break;
    if (m.textures) for (const [k, v] of Object.entries(m.textures)) textures[k] = (v && typeof v === 'object' && typeof v.sprite === 'string') ? v.sprite : v;
    cur = m.parent;
  }
  // dereference #refs (child overrides already applied by assign order)
  for (let pass = 0; pass < 3; pass++) {
    for (const k of Object.keys(textures)) {
      const v = textures[k];
      if (typeof v === 'string' && v.startsWith('#')) {
        const key = v.slice(1);
        if (textures[key]) textures[k] = textures[key];
      }
    }
  }
  return textures;
}
function texPathToImage(tp) { // "minecraft:block/dirt" -> loaded png
  if (!tp || typeof tp !== 'string' || tp.startsWith('#')) return null;
  const clean = tp.replace(/^minecraft:/, '');
  const m = clean.match(/^(item|block|entity\/\w+)\/(.+)$/);
  if (!m) return null;
  const base = m[1].startsWith('item') ? 'items' : 'blocks';
  return firstFrame(loadPNG(base, m[2]));
}
function pickFaces(t) {
  const get = (...keys) => { for (const k of keys) if (typeof t[k] === 'string' && !t[k].startsWith('#')) return t[k]; return null; };
  return {
    // semantic keys win over generic ones so fronts (furnace/piston/etc.) are visible
    top: get('top', 'up', 'all', 'end'),
    side: get('front', 'side', 'north', 'east', 'south', 'west', 'all', 'end') || get('particle'),
    layer: get('layer0', 'particle')
  };
}

/* ---------------- Procedural fallbacks (entity-rendered items) ---------------- */
const DYES = {
  white: [249, 255, 254], orange: [249, 128, 29], magenta: [199, 78, 189], light_blue: [58, 179, 218],
  yellow: [254, 216, 61], lime: [128, 199, 31], pink: [243, 139, 170], gray: [71, 79, 82],
  light_gray: [157, 157, 151], cyan: [22, 156, 156], purple: [137, 50, 184], blue: [60, 68, 170],
  brown: [131, 84, 50], green: [94, 124, 22], red: [176, 46, 38], black: [29, 29, 33]
};
function blank16() { return new PNG({ width: 16, height: 16 }); }
function px(img, x, y, c) {
  if (x < 0 || y < 0 || x > 15 || y > 15) return;
  const i = (y * 16 + x) * 4;
  img.data[i] = c[0]; img.data[i + 1] = c[1]; img.data[i + 2] = c[2]; img.data[i + 3] = 255;
}
function rect(img, x, y, w, h, c) { for (let yy = y; yy < y + h; yy++) for (let xx = x; xx < x + w; xx++) px(img, xx, yy, c); }
function shade(c, f) { return [Math.min(255, c[0] * f), Math.min(255, c[1] * f), Math.min(255, c[2] * f)]; }

function chestIcon(body, lid, latch) {
  const g = blank16();
  rect(g, 2, 4, 12, 10, [62, 42, 18]);
  rect(g, 3, 9, 10, 4, body);
  rect(g, 3, 5, 10, 4, lid);
  rect(g, 3, 8, 10, 1, shade(body, 0.55));
  rect(g, 3, 5, 1, 8, shade(lid, 0.88));
  rect(g, 12, 5, 1, 8, shade(body, 0.75));
  rect(g, 7, 7, 2, 3, latch);
  return g;
}
function shulkerIcon(base) {
  const g = blank16();
  const dark = shade(base, 0.55), light = shade(base, 1.22);
  rect(g, 4, 3, 8, 2, dark);
  rect(g, 3, 4, 10, 3, base);
  rect(g, 3, 7, 10, 6, base);
  rect(g, 3, 7, 10, 1, dark);
  rect(g, 4, 4, 8, 1, light);
  rect(g, 3, 12, 10, 1, dark);
  rect(g, 3, 4, 1, 9, shade(base, 0.8));
  rect(g, 12, 4, 1, 9, dark);
  return g;
}
function bannerIcon(c) {
  const g = blank16();
  const dark = shade(c, 0.62), light = shade(c, 1.18);
  for (let y = 2; y <= 11; y++) { rect(g, 3, y, 10, 1, c); }
  rect(g, 3, 2, 1, 10, light);
  rect(g, 12, 2, 1, 10, dark);
  rect(g, 3, 12, 3, 2, c);   // left tail
  rect(g, 10, 12, 3, 2, c);  // right tail
  rect(g, 3, 12, 1, 2, dark);
  rect(g, 12, 12, 1, 2, dark);
  return g;
}
function headIcon(bg, draw) { const g = blank16(); rect(g, 2, 3, 12, 11, bg); rect(g, 2, 3, 12, 1, shade(bg, 1.15)); draw(g); return g; }
const HEADS = {
  zombie_head: () => headIcon([70, 120, 48], g => { rect(g, 4, 7, 2, 2, [20, 40, 20]); rect(g, 10, 7, 2, 2, [20, 40, 20]); rect(g, 6, 10, 4, 2, [30, 60, 26]); }),
  skeleton_skull: () => headIcon([193, 193, 193], g => { rect(g, 4, 7, 2, 2, [58, 58, 58]); rect(g, 10, 7, 2, 2, [58, 58, 58]); rect(g, 7, 9, 2, 2, [120, 120, 120]); rect(g, 5, 12, 1, 1, [90, 90, 90]); rect(g, 8, 12, 1, 1, [90, 90, 90]); rect(g, 11, 12, 1, 1, [90, 90, 90]); }),
  wither_skeleton_skull: () => headIcon([51, 51, 51], g => { rect(g, 4, 7, 2, 2, [12, 12, 12]); rect(g, 10, 7, 2, 2, [12, 12, 12]); rect(g, 7, 9, 2, 2, [80, 80, 80]); }),
  creeper_head: () => headIcon([88, 176, 74], g => { rect(g, 4, 5, 2, 2, [18, 36, 16]); rect(g, 10, 5, 2, 2, [18, 36, 16]); rect(g, 7, 7, 2, 3, [18, 36, 16]); rect(g, 5, 9, 2, 2, [18, 36, 16]); rect(g, 9, 9, 2, 2, [18, 36, 16]); }),
  player_head: () => headIcon([176, 127, 89], g => { rect(g, 2, 3, 12, 3, [67, 43, 26]); rect(g, 2, 6, 1, 2, [67, 43, 26]); rect(g, 13, 6, 1, 2, [67, 43, 26]); px(g, 4, 7, [255, 255, 255]); rect(g, 5, 7, 1, 1, [74, 63, 163]); px(g, 11, 7, [255, 255, 255]); rect(g, 10, 7, 1, 1, [74, 63, 163]); rect(g, 6, 11, 4, 1, [96, 66, 46]); }),
  piglin_head: () => headIcon([234, 147, 153], g => { rect(g, 1, 5, 2, 3, [214, 126, 132]); rect(g, 13, 5, 2, 3, [214, 126, 132]); rect(g, 5, 8, 6, 3, [243, 173, 178]); rect(g, 6, 9, 1, 1, [70, 30, 34]); rect(g, 9, 9, 1, 1, [70, 30, 34]); rect(g, 5, 5, 2, 1, [250, 251, 251]); rect(g, 9, 5, 2, 1, [250, 251, 251]); }),
  dragon_head: () => headIcon([28, 28, 32], g => { rect(g, 3, 4, 2, 2, [92, 92, 100]); rect(g, 11, 4, 2, 2, [92, 92, 100]); rect(g, 3, 8, 3, 1, [200, 0, 213]); rect(g, 10, 8, 3, 1, [200, 0, 213]); rect(g, 5, 12, 6, 1, [80, 80, 90]); })
};
function shieldIcon() {
  const g = blank16();
  const edge = [58, 58, 62], field = [206, 206, 212];
  rect(g, 3, 2, 10, 9, field);
  rect(g, 4, 11, 8, 1, field); rect(g, 5, 12, 6, 1, field); rect(g, 6, 13, 4, 1, field);
  rect(g, 3, 2, 1, 9, [238, 238, 242]); rect(g, 12, 2, 1, 9, edge);
  rect(g, 3, 2, 10, 1, [238, 238, 242]);
  rect(g, 3, 10, 1, 1, edge); rect(g, 12, 10, 1, 1, edge);
  rect(g, 6, 5, 4, 4, [154, 154, 162]); rect(g, 7, 6, 2, 2, [190, 190, 198]);
  return g;
}
function conduitIcon() {
  const g = blank16();
  for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) {
    const dx = x - 7.5, dy = y - 7.5, d = Math.sqrt(dx * dx + dy * dy);
    if (d < 6.5) px(g, x, y, d < 2.5 ? [235, 250, 250] : d < 4.5 ? [127, 216, 222] : [58, 110, 120]);
  }
  return g;
}
function potIcon() {
  const g = blank16();
  const body = [152, 94, 66], dark = [122, 77, 53], lite = [196, 146, 101];
  rect(g, 4, 2, 8, 2, dark);
  rect(g, 5, 4, 6, 1, body);
  rect(g, 3, 5, 10, 8, body);
  rect(g, 3, 5, 1, 8, lite);
  rect(g, 12, 5, 1, 8, dark);
  rect(g, 3, 8, 10, 1, lite);
  rect(g, 5, 13, 6, 2, dark);
  return g;
}
function golemIcon(tone) {
  const g = blank16();
  const dark = shade(tone, 0.65), lite = shade(tone, 1.18);
  rect(g, 5, 2, 6, 4, tone);            // head
  rect(g, 6, 4, 1, 1, [30, 30, 30]); rect(g, 9, 4, 1, 1, [30, 30, 30]);
  rect(g, 4, 7, 8, 5, tone);            // torso
  rect(g, 2, 7, 2, 5, tone);            // arms
  rect(g, 12, 7, 2, 5, tone);
  rect(g, 5, 12, 2, 3, tone);           // legs
  rect(g, 9, 12, 2, 3, tone);
  rect(g, 5, 2, 6, 1, lite);
  rect(g, 4, 11, 8, 1, dark);
  return g;
}
const COPPER_TONES = { '': [193, 109, 72], exposed_: [168, 119, 98], weathered_: [110, 154, 108], oxidized_: [83, 162, 134] };
function makeFallbackIcon(id) {
  if (id === 'chest' || id === 'trapped_chest' || id === 'ender_chest') {
    if (id === 'ender_chest') return chestIcon([26, 42, 38], [34, 58, 52], [82, 240, 120]);
    if (id === 'trapped_chest') return chestIcon([160, 105, 44], [176, 122, 56], [220, 60, 50]);
    return chestIcon([160, 105, 44], [176, 122, 56], [249, 216, 74]);
  }
  if (/^(waxed_)?(exposed_|weathered_|oxidized_)?copper_chest$/.test(id)) {
    const stripped = id.replace('waxed_', '');
    let toneKey = '';
    for (const k of ['exposed_', 'weathered_', 'oxidized_']) if (stripped.startsWith(k)) toneKey = k;
    const tone = COPPER_TONES[toneKey];
    return chestIcon(shade(tone, 0.95), tone, id.includes('waxed') ? [220, 230, 230] : shade(tone, 1.35));
  }
  if (/^(_shulker_box|shulker_box)$/.test(id) || /_shulker_box$/.test(id)) {
    let base = [150, 81, 157];
    const dyeName = Object.keys(DYES).find(d => id.startsWith(d));
    if (id !== 'shulker_box' && dyeName) base = DYES[dyeName];
    return shulkerIcon(base);
  }
  if (/_banner$/.test(id)) {
    let c = [158, 158, 158];
    const dyeName = Object.keys(DYES).find(d => id.startsWith(d));
    if (dyeName) c = DYES[dyeName];
    return bannerIcon(c);
  }
  if (HEADS[id]) return HEADS[id]();
  if (id === 'shield') return shieldIcon();
  if (id === 'conduit') return conduitIcon();
  if (id === 'decorated_pot') return potIcon();
  if (/copper_golem_statue$/.test(id)) {
    const stripped = id.replace('waxed_', '');
    let toneKey = '';
    for (const k of ['exposed_', 'weathered_', 'oxidized_']) if (stripped.startsWith(k)) toneKey = k;
    return golemIcon(COPPER_TONES[toneKey]);
  }
  return null;
}

/* ---------------- Icon generation per id ---------------- */
const icons = new Map(); // id -> {png, flat}
function makeIcon(id, kind /* 'item'|'block' */, extra) {
  // 1. direct texture shortcut
  const raw0 = kind === 'item' ? loadPNG('items', id) : null;
  if (raw0) return { type: 'flat', img: firstFrame(raw0) };

  // 2. resolve model chain
  let ref = null;
  const defPath = join(itemDefsDir, id + '.json');
  if (has(defPath)) {
    try { ref = findModelRef(readJSON(defPath)); } catch {}
  }
  if (!ref) ref = (kind === 'item' ? 'item/' : 'block/') + id;
  const t = resolveModelChain(ref);
  const faces = pickFaces(t);

  // spawn egg template -> hash tint
  if (faces.layer && /spawn_egg|template_egg/.test(faces.layer) && /_spawn_egg$/.test(id)) {
    const raw = texPathToImage(faces.layer);
    if (raw) {
      const tinted = tintPNG(raw, hslToRgb(hueFor(id), 68, 60));
      return { type: 'flat', img: tinted };
    }
  }

  // grass block special (tinted top + side overlay)
  if (id === 'grass_block') {
    const topRaw = loadPNG('blocks', 'grass_block_top');
    const sideRaw = loadPNG('blocks', 'grass_block_side');
    const overlay = loadPNG('blocks', 'grass_block_side_overlay');
    if (topRaw && sideRaw) {
      const side = overlay ? composite(firstFrame(sideRaw), tintPNG(firstFrame(overlay), GREEN)) : firstFrame(sideRaw);
      return { type: 'cube', img: isoCube(tintPNG(firstFrame(topRaw), GREEN), side, side) };
    }
  }

  // shelves & dripleaf: block texture exists even though model chain is special-renderer
  if (/_shelf$/.test(id)) {
    const raw = loadPNG('blocks', id);
    if (raw) { const f = firstFrame(raw); return { type: 'cube', img: isoCube(f, f, f) }; }
  }
  if (id === 'big_dripleaf') {
    const raw = loadPNG('blocks', 'big_dripleaf_top');
    if (raw) return { type: 'flat', img: tintPNG(firstFrame(raw), [119, 171, 47]) };
  }

  // thin/lattice shapes must NOT be rendered as iso cubes (looks mangled)
  const FLAT_SHAPE_RE = /(_fence_gate$|_fence$|_door$|_trapdoor$|_pressure_plate$|_button$|_pane$|iron_bars|_bars$|_rail$|^rail$|ladder|scaffolding|_chain$|^chain$|_sign$|_hanging_sign$|coral_fan)/;

  // cube render when we have block faces
  const topImg = faces.top ? texPathToImage(faces.top) : null;
  if (topImg && !FLAT_SHAPE_RE.test(id)) {
    const tintT = tintForTex(faces.top.replace(/^minecraft:(item|block)\//, '')); 
    const topF = tintT ? tintPNG(firstFrame(topImg), tintT) : firstFrame(topImg);
    const sideName = (faces.side || '').replace(/^minecraft:(item|block)\//, '');
    const sideImg = faces.side ? texPathToImage(faces.side) : topImg;
    let sideF = sideImg ? firstFrame(sideImg) : topF;
    const tintS = tintForTex(sideName);
    if (tintS) sideF = tintPNG(sideF, tintS);
    return { type: 'cube', img: isoCube(topF, sideF, sideF) };
  }

  // flat sprite fallback (layer/particle/any texture value)
  const anyKey = ['layer0', 'side', 'front', 'all', 'north', 'particle', 'texture', 'end', 'top'].find(k => typeof t[k] === 'string');
  const flatTex = anyKey ? t[anyKey] : null;
  if (flatTex) {
    const raw = texPathToImage(flatTex);
    if (raw) {
      const nm = flatTex.replace(/^minecraft:(item|block)\//, '');
      const tn = tintForTex(nm);
      return { type: 'flat', img: tn ? tintPNG(raw, tn) : raw };
    }
  }

  // special-renderer items (chests, shulkers, banners, heads...) -> hand-painted official-style icons
  const fb = makeFallbackIcon(id);
  if (fb) return { type: 'flat', img: fb };

  // last resort: raw block texture with the same name
  const directBlock = loadPNG('blocks', id);
  if (directBlock) return { type: 'flat', img: firstFrame(directBlock) };
  return null;
}

/* ---------------- Tags ---------------- */
const tagCache = {};
function resolveTag(name) { // "minecraft:planks" -> Set of ids
  if (tagCache[name]) return tagCache[name];
  const set = new Set();
  tagCache[name] = set; // cycle guard
  const rel = name.replace(/^minecraft:/, '');
  const p = join(TMP, 'tags', rel + '.json');
  if (!has(p)) return set;
  let j; try { j = readJSON(p); } catch { return set; }
  for (const v of (j.values || [])) {
    if (typeof v === 'object' && v !== null) { if (v.id) addValue(set, v.id); }
    else addValue(set, String(v));
  }
  return set;
}
function addValue(set, v) {
  if (v.startsWith('#')) { for (const x of resolveTag(v.slice(1))) set.add(x); }
  else set.add(v.replace(/^minecraft:/, ''));
}
function expandIngredient(ing) { // -> sorted unique concrete ids or null
  let list = [];
  if (typeof ing === 'string') list = [ing];
  else if (Array.isArray(ing)) list = ing.flatMap(x => typeof x === 'string' ? [x] : (x && x.item ? [x.item] : []));
  else if (ing && ing.item) list = [ing.item];
  const out = new Set();
  for (const e of list) {
    if (e.startsWith('#')) { for (const x of resolveTag(e.slice(1))) out.add(x); }
    else out.add(e.replace(/^minecraft:/, ''));
  }
  return out.size ? [...out].sort() : null;
}

/* ---------------- Categories ---------------- */
const EXACT_TOOLS = new Set(['bow','crossbow','trident','mace','shield','shears','flint_and_steel','fishing_rod','spyglass','brush','elytra','arrow','spectral_arrow','tipped_arrow','totem_of_undying','experience_bottle','wind_charge']);
const FOOD_RE = /(apple$|^bread|cookie|_pie$|stew$|soup$|porkchop|mutton|^beef|^chicken$|raw_|cooked_|cod$|salmon$|tropical_fish|pufferfish|berries$|^sweet_berries|^glow_berries|carrot|potato$|baked_potato|poisonous_potato|beetroot|honey_bottle|milk_bucket|rotten_flesh|spider_eye$|dried_kelp|^cake$|chorus_fruit|suspicious_stew|rabbit$|^pumpkin_slice|melon_slice)/;
const BREW_RE = /(potion|glass_bottle|brewing_stand|blaze_powder|ghast_tear|fermented_spider_eye|glistering_melon_slice|golden_carrot|magma_cream|rabbit_foot|dragon_breath|nether_wart|phantom_membrane|gunpowder|sugar$|paper|book|enchanted_book|writable_book|written_book|slime_ball|ender_pearl|ender_eye|fire_charge)/;
const REDSTONE_RE = /(repeater|comparator|observer|dispenser|dropper|hopper|piston|lever|pressure_plate|button$|rail$|_rail|tripwire_hook|daylight_detector|^redstone(_lamp|_torch|_wire)?$|note_block|jukebox|^target$|sculk_sensor|calibrated_sculk_sensor|^crafter$|copper_bulb|lightning_rod|command_block|structure_block|jigsaw|redstone_block|sticky_piston|piston_head)/;
const MAT_RE = /(_ingot|_nugget|_gem$|_dust$|^stick$|^string$|^leather$|^feather$|^flint$|clay_ball|^brick$|netherite_scrap|amethyst_shard|^quartz$|prismarine_shard|prismarine_crystals|shulker_shell|ink_sac|glow_ink_sac|honeycomb|bone_meal|^coal$|^charcoal$|echo_shard|disc_fragment|nether_star|heart_of_the_sea|nautilus_shell|scute|armadillo_scute|^blaze_rod|^bone$|^egg$|^bowl$|^bucket$|^clay$|^brick$|^wheat$|^pumpkin$|^melon$|^sugar_cane$|^cocoa_beans$|^lily_pad$|^vine$|^bamboo$|^snowball$|^wool$|^rabbit_hide$|^leather_horse_armor|^compass$|^clock$|^map$|^name_tag|^lead$|^saddle$|^flower_pot|^item_frame|^glow_item_frame|^painting|^banner$|^shield$|^totem_of_undying|^goat_horn|^trident|^spyglass|^brush$|^shears$|^flint_and_steel$|^fishing_rod$|^carrot_on_a_stick|^warped_fungus_on_a_stick|^ominous_trial_key|^trial_key|^breeze_rod|^heavy_core|^mace$)/;
function catFor(id, isBlock) {
  if (EXACT_TOOLS.has(id) || /(_pickaxe|_axe|_shovel|_hoe|_sword)$/.test(id)) return 'tools';
  if (/(helmet|chestplate|leggings|boots)$/.test(id) || /horse_armor$/.test(id)) return 'tools';
  if (REDSTONE_RE.test(id)) return 'redstone';
  if (FOOD_RE.test(id)) return 'food';
  if (BREW_RE.test(id)) return 'food';
  if (MAT_RE.test(id)) return 'materials';
  if (isBlock) return 'blocks';
  return 'misc';
}

/* ---------------- Main build ---------------- */
console.log('Building icons...');
const outDirs = [join(ROOT, 'assets', 'mc', 'icons'), join(ROOT, 'public', 'assets', 'mc', 'icons')];
for (const d of outDirs) fs.mkdirSync(d, { recursive: true });

const items = [];       // [id, name, cat]
const iconIds = new Set();
let made = 0;

const defFiles = fs.readdirSync(itemDefsDir).filter(f => f.endsWith('.json'));
for (const f of defFiles) {
  const id = f.replace(/\.json$/, '');
  if (id === 'air' || id === 'light' || id === 'barrier') continue; // unobtainable technical items
  const res = makeIcon(id, 'item');
  if (!res) continue;
  fs.writeFileSync(join(outDirs[0], id + '.png'), PNG.sync.write(res.img));
  iconIds.add(id);
  made++;
}
console.log('icons generated:', made);

// Blocks not already covered by an item with same id (stairs/slabs/etc. share names; only add missing)
const bsDir = join(TMP, 'blockstates');
const SKIP_BLOCK_ICONS = new Set(); // none for now
for (const f of fs.readdirSync(bsDir).filter(f => f.endsWith('.json'))) {
  const id = f.replace(/\.json$/, '');
  if (SKIP_BLOCK_ICONS.has(id) || iconIds.has(id)) continue;
  const res = makeIcon(id, 'block');
  if (!res) continue;
  fs.writeFileSync(join(outDirs[0], id + '.png'), PNG.sync.write(res.img));
  iconIds.add(id);
}
console.log('total icons:', iconIds.size);

// Copy icons to public/
for (const f of fs.readdirSync(outDirs[0])) {
  fs.copyFileSync(join(outDirs[0], f), join(outDirs[1], f));
}

/* ---------------- Items registry + categories ---------------- */
const isBlockId = new Set(fs.readdirSync(bsDir).map(f => f.replace(/\.json$/, '')));
for (const id of [...iconIds].sort()) {
  items.push([id, prettyName(id), catFor(id, isBlockId.has(id))]);
}
function prettyName(id) {
  return id.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
    .replace(/\boak\b/i, 'Oak'); // no-op keeps simple
}

/* ---------------- Recipes ---------------- */
console.log('Parsing recipes...');
const recDir = join(TMP, 'recipes');
const recipes = [];
const seen = new Set();
let skippedNoIcon = 0;

for (const f of fs.readdirSync(recDir).filter(f => f.endsWith('.json'))) {
  let j; try { j = readJSON(join(recDir, f)); } catch { continue; }
  const type = (j.type || '').replace(/^minecraft:/, '');
  if (!(type === 'crafting_shaped' || type === 'crafting_shapeless' || type === 'crafting_transmute')) continue;

  // result
  const rj = j.result || {};
  const outId = String(rj.id || rj.item || '').replace(/^minecraft:/, '');
  const count = Math.max(1, parseInt(rj.count) || 1);
  if (!outId || !iconIds.has(outId)) { skippedNoIcon++; continue; }

  let rec = null;
  if (type === 'crafting_shaped' && Array.isArray(j.pattern) && j.key) {
    const rows = j.pattern.map(r => r.split(''));
    const w = Math.max(...rows.map(r => r.length));
    const h = rows.length;
    const cells = [];
    let badIng = false;
    for (let r = 0; r < h; r++) {
      const row = [];
      for (let c = 0; c < w; c++) {
        const ch = rows[r][c];
        if (!ch || ch === ' ') { row.push(false); continue; } // false = empty slot
        const ing = expandIngredient(j.key[ch]);
        if (!ing) { badIng = true; row.push(null); }
        else row.push(ing);
      }
      cells.push(row);
    }
    rec = { shape: { w, h, c: cells }, out: outId, count };
    if (badIng) rec = null;
    // trim empty border rows/cols so shapes are tight (player grids get trimmed too)
    if (rec) {
      let cc = rec.shape.c, ww = rec.shape.w, hh = rec.shape.h;
      const rowEmpty = r => cc[r].every(cell => cell === false);
      const colEmpty = x => cc.every(row => row[x] === false);
      while (hh > 0 && rowEmpty(0)) { cc = cc.slice(1); hh--; }
      while (hh > 0 && rowEmpty(hh - 1)) { cc = cc.slice(0, hh - 1); hh--; }
      while (ww > 0 && colEmpty(0)) { cc = cc.map(r => r.slice(1)); ww--; }
      while (ww > 0 && colEmpty(ww - 1)) { cc = cc.map(r => r.slice(0, ww - 1)); ww--; }
      if (!ww || !hh) rec = null; else rec.shape = { w: ww, h: hh, c: cc };
    }
  } else if (type === 'crafting_shapeless' || type === 'crafting_transmute') {
    const ins = type === 'crafting_shapeless' ? (j.ingredients || []) : [j.input, j.material];
    const ingr = ins.map(expandIngredient).filter(Boolean);
    if (!ingr.length) continue;
    rec = { ingr, out: outId, count };
  }
  if (!rec) continue;
  const key = JSON.stringify(rec);
  if (seen.has(key)) continue;
  seen.add(key);
  recipes.push(rec);
}
console.log('crafting recipes kept:', recipes.length, '| skipped (no icon):', skippedNoIcon);

/* ---------------- Emit mc-data.js ---------------- */
const dataJs = `// AUTO-GENERATED by build-mc-data.cjs — DO NOT EDIT BY HAND
// Source: official Minecraft client.jar v${MC_VER} textures & recipes (Mojang usage guidelines apply)
window.MC_DATA={
ver:'${MC_VER}',
iconBase:'assets/mc/icons/',
items:${JSON.stringify(items)},
recipes:${JSON.stringify(recipes)}
};
`;
fs.writeFileSync(join(ROOT, 'mc-data.js'), dataJs);
fs.writeFileSync(join(ROOT, 'public', 'mc-data.js'), dataJs);
console.log('Wrote mc-data.js (' + Math.round(dataJs.length / 1024) + ' KB) and', iconIds.size, 'icons.');

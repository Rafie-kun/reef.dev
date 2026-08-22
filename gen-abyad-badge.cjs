// Generates an 88x31 Minecraft grass-block style badge for abyadzaman.me
const fs = require('fs');

// 5-tall pixel font
const FONT = {
  'A': ['.#.', '#.#', '###', '#.#', '#.#'],
  'B': ['##.', '#.#', '##.', '#.#', '##.'],
  'Y': ['#.#', '#.#', '.#.', '.#.', '.#.'],
  'D': ['##.', '#.#', '#.#', '#.#', '##.'],
  'Z': ['###', '..#', '.#.', '#..', '###'],
  'M': ['#...#', '##.##', '#.#.#', '#...#', '#...#'],
  'N': ['#..#', '##.#', '##.#', '#.##', '#..#']
};
function wordWidth(word) {
  let w = 0;
  for (let i = 0; i < word.length; i++) { w += FONT[word[i]][0].length + (i ? 2 : 0); }
  return w;
}
// render one word as SVG rects; each font pixel = px x px, returns svg string
function drawWord(word, x0, y0, px, fill) {
  let out = '', cx = x0;
  for (const ch of word) {
    const bm = FONT[ch];
    bm.forEach((row, ry) => {
      for (let rx = 0; rx < row.length; rx++) {
        if (row[rx] === '#') out += `<rect x="${cx + rx * px}" y="${y0 + ry * px}" width="${px}" height="${px}" fill="${fill}"/>`;
      }
    });
    cx += bm[0].length * px + 2 * px;
  }
  return out;
}

const W = 88, H = 31;
const s = [];
s.push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" shape-rendering="crispEdges">`);

// dirt body
s.push(`<rect width="${W}" height="${H}" fill="#7a5230"/>`);
// dirt speckles
let seed = 42; const rnd = () => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; };
for (let i = 0; i < 90; i++) {
  const x = Math.floor(rnd() * W), y = 10 + Math.floor(rnd() * (H - 11));
  const c = rnd() < .5 ? '#6b4527' : '#8a6544';
  s.push(`<rect x="${x}" y="${y}" width="2" height="2" fill="${c}"/>`);
}
// grass strip with jagged edge
for (let x = 0; x < W; x += 4) {
  const dip = rnd() < .4 ? 3 : 1;
  s.push(`<rect x="${x}" y="0" width="4" height="${10 - 1 + dip - 2}" fill="#5da649"/>`);
  s.push(`<rect x="${x}" y="0" width="4" height="2" fill="#71c25c"/>`);
}
// darker grass under-strip
for (let x = 0; x < W; x += 8) s.push(`<rect x="${x + (rnd() < .5 ? 0 : 4)}" y="9" width="4" height="2" fill="#4a8a3a"/>`);

// MC-style bevel frame: dark outline + light top/left
s.push(`<rect x="0" y="0" width="${W}" height="${H}" fill="none" stroke="#241608" stroke-width="2"/>`);
s.push(`<rect x="1.5" y="1.5" width="${W - 3}" height="1" fill="#8fce77" opacity=".55"/>`);
s.push(`<rect x="1.5" y="1.5" width="1" height="${H - 3}" fill="#8fce77" opacity=".35"/>`);
s.push(`<rect x="1.5" y="${H - 2.5}" width="${W - 3}" height="1" fill="#3d2814" opacity=".8"/>`);
s.push(`<rect x="${W - 2.5}" y="1.5" width="1" height="${H - 3}" fill="#3d2814" opacity=".8"/>`);

// text "ABYAD" / "ZAMAN" scale-2 pixels, shadow then white
const w1 = wordWidth('ABYAD') , w2 = wordWidth('ZAMAN');
const p = 2, t1y = 8, t2y = 18;
s.push(drawWord('ABYAD', Math.round((W - w1 * p) / 2) + 1, t1y + 1, p, '#241608'));
s.push(drawWord('ABYAD', Math.round((W - w1 * p) / 2), t1y, p, '#ffffff'));
s.push(drawWord('ZAMAN', Math.round((W - w2 * p) / 2) + 1, t2y + 1, p, '#241608'));
s.push(drawWord('ZAMAN', Math.round((W - w2 * p) / 2), t2y, p, '#ffe9b0'));
s.push('</svg>');

fs.writeFileSync('assets/mc/abyad-badge.svg', s.join('\n'));
fs.writeFileSync('public/assets/mc/abyad-badge.svg', s.join('\n'));
console.log('abyad badge written:', s.join('').length, 'bytes | words:', wordWidth('ABYAD'), wordWidth('ZAMAN'));

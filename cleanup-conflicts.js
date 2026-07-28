const fs = require('fs');

function cleanIndex(text) {
  const lines = text.split(/\r?\n/);
  const out = [];
  let navSeen = 0;
  for (const line of lines) {
    if (line.startsWith('<<<<<<<') || line.startsWith('=======') || line.startsWith('>>>>>>>')) continue;
    if (line.startsWith('<nav class="hotbar">')) {
      navSeen += 1;
      if (navSeen === 1) continue;
    }
    if (navSeen === 1 && !line.startsWith('</nav>')) {
      continue;
    }
    out.push(line);
  }
  return out.join('\n');
}

function cleanAdmin(text) {
  const lines = text.split(/\r?\n/);
  const out = [];
  let blogSeen = 0;
  let albumSeen = 0;
  let skip = false;
  for (const line of lines) {
    if (line.startsWith('<<<<<<<') || line.startsWith('=======') || line.startsWith('>>>>>>>')) continue;
    if (line.includes("showPanel('blog',this)")) {
      blogSeen += 1;
      if (blogSeen > 1) continue;
    }
    if (line.includes("showPanel('album',this)")) {
      albumSeen += 1;
      if (albumSeen > 1) continue;
    }
    if (line.includes("d.cardImg = document.getElementById('cfg-card-img').value.trim()")) {
      out.push("  d.cardImg = document.getElementById('cfg-card-img').value.trim() || '/assets/button-88x31.webp';");
      continue;
    }
    if (line.includes("document.getElementById('cfg-card-img').value = d.cardImg")) {
      out.push("  document.getElementById('cfg-card-img').value = d.cardImg || '/assets/button-88x31.webp';");
      continue;
    }
    if (line.includes("toast('Appearance saved! Reload the site to see it.')")) {
      out.push("  toast('Background saved! Reload the site to see it.');");
      continue;
    }
    if (line.includes("toast('Background saved! Reload the site to see it.')")) {
      out.push(line);
      continue;
    }
    if (line.includes("cardImg: 'https://reef-dev.vercel.app/assets/reef-card.webp'")) {
      out.push("  cardImg: '/assets/button-88x31.webp',");
      continue;
    }
    if (line.trim() === 'blog: [],' || line.trim() === 'album: [],') {
      if (out.slice(-2).some(l => l.trim() === line.trim())) continue;
    }
    if (line.trim() === '<!-- BLOG -->' || line.trim() === '<!-- ALBUM -->') continue;
    if (line.trim() === 'X') continue;
    out.push(line);
  }
  return out.join('\n');
}

for (const file of ['index.html', 'admin.html']) {
  const text = fs.readFileSync(file, 'utf8');
  const cleaned = file === 'index.html' ? cleanIndex(text) : cleanAdmin(text);
  fs.writeFileSync(file, cleaned, 'utf8');
}

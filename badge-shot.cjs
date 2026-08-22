const puppeteer = require('puppeteer');
(async () => {
  const b = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const p = await b.newPage();
  // render badge at 4x on a dark backdrop like the badge wall
  await p.setViewport({ width: 400, height: 160 });
  await p.setContent(`<body style="margin:0;background:#1a1a24;display:flex;gap:20px;align-items:center;padding:30px">
    <img src="http://localhost:5399/assets/mc/abyad-badge.svg" width="264" height="93" style="image-rendering:pixelated">
    <img src="http://localhost:5399/assets/mc/abyad-badge.svg" width="88" height="31" style="image-rendering:pixelated;border:1px solid #444">
  </body>`);
  await new Promise(r => setTimeout(r, 600));
  await p.screenshot({ path: 'C:\\Users\\h\\AppData\\Local\\Temp\\opencode\\abyad-badge.png' });
  await b.close();
  console.log('badge shot saved');
})();

const puppeteer = require('puppeteer');
const { spawn } = require('child_process');
const srv = spawn('node', ['local-server.mjs', '5399'], { cwd: __dirname, stdio: 'ignore' });
const BASE = 'http://localhost:5399';
(async () => {
  let up = false;
  for (let i = 0; i < 30; i++) { try { await fetch(BASE + '/'); up = true; break; } catch { await new Promise(r => setTimeout(r, 300)); } }
  if (!up) { console.error('no server'); process.exit(1); }
  const b = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const p = await b.newPage();
  await p.setViewport({ width: 1400, height: 1000 });
  const errs = [];
  p.on('pageerror', e => errs.push(String(e).slice(0, 120)));
  p.on('response', r => { if (r.status() >= 400) errs.push('HTTP ' + r.status() + ' ' + r.url().slice(0, 90)); });
  await p.goto(BASE + '/', { waitUntil: 'networkidle2', timeout: 60000 });

  // open Games tab in library
  await p.evaluate(() => { document.querySelector('.tab[data-tab="games"]').click(); });
  await new Promise(r => setTimeout(r, 1500));
  const games = await p.evaluate(() => ({
    cards: document.querySelectorAll('#tab-games .game-card').length,
    titles: [...document.querySelectorAll('#tab-games .game-card-title')].map(t => t.textContent).slice(0, 12),
    brokenText: document.getElementById('tab-games').textContent.includes('loading="lazy"')
  }));

  // fire herobrine + tnt via terminal
  await p.click('#term-toggle');
  await new Promise(r => setTimeout(r, 400));
  await p.type('#term-input', 'herobrine');
  await p.keyboard.press('Enter');
  await new Promise(r => setTimeout(r, 700));
  const eyesVisible = await p.evaluate(() => !!document.querySelector('.mcfx-eye'));
  await p.type('#term-input', 'tnt');
  await p.keyboard.press('Enter');
  await new Promise(r => setTimeout(r, 500));
  await p.screenshot({ path: 'C:\\Users\\h\\AppData\\Local\\Temp\\opencode\\games-term.png' });

  console.log(JSON.stringify({ games, eyesDuringHerobrine: eyesVisible, pageErrors: errs }, null, 2));
  await b.close();
  srv.kill();
})().catch(e => { console.error('CRASH:', e.message); process.exit(1); });

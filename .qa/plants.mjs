import puppeteer from 'puppeteer-core';
const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const OUT = 'D:\\Clients_project\\gardening\\project\\mygreenhome\\.qa\\';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const b = await puppeteer.launch({ executablePath: EDGE, headless: 'new', args: ['--no-sandbox', '--disable-gpu'] });
const p = await b.newPage();
await p.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
const errs = [];
p.on('console', (m) => m.type() === 'error' && errs.push(m.text()));
p.on('pageerror', (e) => errs.push(e.message));
await p.goto('http://localhost:5173/', { waitUntil: 'load' });
await sleep(2600);

await p.evaluate(() => {
  const el = document.querySelector('#plants');
  window.__lenis.scrollTo(el.getBoundingClientRect().top + window.scrollY, { immediate: true });
});
await sleep(1200);
await p.screenshot({ path: OUT + 'c-plants-grid.png' });

// Open the first plant passport
await p.evaluate(() => document.querySelector('.plant-card-x')?.click());
await sleep(900);
await p.screenshot({ path: OUT + 'c-passport.png' });

console.log('errors:', errs.length ? '\n' + errs.join('\n') : 'none');
await b.close();

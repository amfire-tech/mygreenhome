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
await sleep(2800);

await p.screenshot({ path: OUT + 'p-0-hero.png' });

async function toEl(sel) {
  await p.evaluate((s) => {
    const el = document.querySelector(s);
    const y = el.getBoundingClientRect().top + window.scrollY;
    window.__lenis.scrollTo(y, { immediate: true });
  }, sel);
  await sleep(1100);
}
await toEl('.dawn-break');
await p.screenshot({ path: OUT + 'p-1-dawn.png' });
await toEl('#pricing');
await p.screenshot({ path: OUT + 'p-2-pricing.png' });
await toEl('#contact');
await sleep(400);
await p.screenshot({ path: OUT + 'p-3-cta-footer.png', fullPage: false });

console.log('errors:', errs.length ? '\n' + errs.join('\n') : 'none');
await b.close();

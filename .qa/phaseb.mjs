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

async function shoot(sel, name, extra = 0) {
  await p.evaluate((s, ex) => {
    const el = document.querySelector(s);
    const y = el.getBoundingClientRect().top + window.scrollY + ex;
    window.__lenis.scrollTo(y, { immediate: true });
  }, sel, extra);
  await sleep(1100);
  await p.screenshot({ path: OUT + name });
}

await shoot('#why', 'b-why.png');
await shoot('#process', 'b-process1.png', Math.round(900 * 1.4)); // ~step 2
await shoot('#process', 'b-process2.png', Math.round(900 * 3.2)); // ~step 4
await shoot('#spaces', 'b-spaces.png');
await shoot('#impact', 'b-impact.png');
await shoot('#faq', 'b-faq.png');

console.log('errors:', errs.length ? '\n' + errs.join('\n') : 'none');
await b.close();

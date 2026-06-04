// Visual QA harness — drives the existing Edge install headless, scrubs the
// scroll stage, and writes screenshots to .qa/. Usage: node .qa/shots.mjs [mobile]
import puppeteer from 'puppeteer-core';

const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const URL = 'http://localhost:5173/';
const OUT = 'D:\\Clients_project\\gardening\\project\\mygreenhome\\.qa\\';
const MOBILE = process.argv[2] === 'mobile';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await puppeteer.launch({
  executablePath: EDGE,
  headless: 'new',
  args: ['--no-sandbox', '--disable-gpu'],
});
const page = await browser.newPage();
await page.setViewport(
  MOBILE
    ? { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true }
    : { width: 1440, height: 900, deviceScaleFactor: 1 }
);

const errors = [];
page.on('console', (m) => m.type() === 'error' && errors.push('CONSOLE: ' + m.text()));
page.on('pageerror', (e) => errors.push('PAGE: ' + e.message));

// Expose Lenis for scroll-driving in QA only.
await page.evaluateOnNewDocument(() => {
  window.__qa = true;
});
await page.goto(URL, { waitUntil: 'load', timeout: 30000 });
await sleep(2600);

const p = MOBILE ? 'm-' : 'd-';
async function shoot(fraction, name) {
  await page.evaluate((f) => {
    const stage = document.querySelector('.scroll-stage');
    const max = stage.offsetHeight - window.innerHeight;
    (window.__lenis || { scrollTo: (y) => window.scrollTo(0, y) }).scrollTo(f * max, { immediate: true });
  }, fraction);
  await sleep(850);
  await page.screenshot({ path: OUT + p + name });
}

await page.screenshot({ path: OUT + p + '0-hero.png' });
await shoot(0.22, '1-outdoor.png');
await shoot(0.4, '2-indoor.png');
await shoot(0.58, '3-balcony.png');
await shoot(0.72, '4-terrace.png');
await shoot(0.92, '5-smart.png');

console.log(MOBILE ? 'MOBILE' : 'DESKTOP', 'errors:', errors.length ? '\n' + errors.join('\n') : 'none');
await browser.close();

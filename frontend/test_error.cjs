/* eslint-disable prettier/prettier */
const puppeteer = require('puppeteer');

(async () => {
  try {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
    page.on('pageerror', err => console.error('BROWSER ERROR:', err));
    await page.goto('http://localhost:8080');
    await new Promise(r => setTimeout(r, 3000));
    await browser.close();
  } catch (e) {
    console.error('SCRIPT ERROR:', e);
  }
})();

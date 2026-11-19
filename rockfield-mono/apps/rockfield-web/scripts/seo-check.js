const { chromium } = require('@playwright/test');

const BASE_URL = process.env.BASE_URL || 'http://localhost:3001';

async function check() {
  const executablePath = process.env.CHROME_PATH;
  const b = await chromium.launch(executablePath ? { executablePath } : {});
  const p = await b.newPage();

  for (const url of ['/shop', '/shop/sneakers', '/shop/sneakers?colour=black']) {
    await p.goto(BASE_URL + url);
    const c = await p.$eval('link[rel="canonical"]', e => e.href).catch(()=>'none');
    const r = await p.$eval('meta[name="robots"]', e => e.content).catch(()=>'none');
    console.log(`${url} -> canonical: ${c}, robots: ${r}`);
  }
  await b.close();
}
check();

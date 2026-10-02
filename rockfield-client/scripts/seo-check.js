const { chromium } = require('playwright');
async function check() {
  const b = await chromium.launch();
  const p = await b.newPage();
  
  for (const url of ['/shop', '/shop/sneakers', '/shop/sneakers?colour=black']) {
    await p.goto('http://localhost:3001' + url);
    const c = await p.$eval('link[rel="canonical"]', e => e.href).catch(()=>'none');
    const r = await p.$eval('meta[name="robots"]', e => e.content).catch(()=>'none');
    console.log(`${url} -> canonical: ${c}, robots: ${r}`);
  }
  await b.close();
}
check();

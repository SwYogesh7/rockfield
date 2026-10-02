const { chromium } = require('playwright');
async function run() {
  const b = await chromium.launch();
  const p = await b.newPage();
  
  // 1. Sort options
  await p.goto('http://localhost:3001/shop');
  await p.selectOption('select', 'price-asc');
  await p.waitForTimeout(1000); // let it re-render
  let prices = await p.$$eval('.font-body.text-sm.font-500', els => els.map(e => parseInt(e.innerText.replace(/\D/g, ''))));
  console.log('Sorted prices ASC:', prices.slice(0, 3)); // should be increasing
  
  // 2. Clear all
  await p.goto('http://localhost:3001/shop?category=sneakers');
  await p.locator('text=Clear All').first().click();
  await p.waitForTimeout(1000);
  console.log('URL after Clear All:', p.url());
  
  // 3. Combined filters reload
  await p.goto('http://localhost:3001/shop?category=boots&gender=men');
  await p.reload();
  console.log('URL after reload:', p.url());
  
  // 4. Links
  await p.goto('http://localhost:3001/');
  const links = await p.$$eval('a', els => Array.from(new Set(els.map(a => a.getAttribute('href')))));
  console.log('Links found:', links);

  await b.close();
}
run();

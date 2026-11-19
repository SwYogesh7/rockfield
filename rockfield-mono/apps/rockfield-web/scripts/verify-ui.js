const { chromium } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const BASE_URL = process.env.BASE_URL || 'http://localhost:3001';

const ROUTES = [
  { name: 'home', url: `${BASE_URL}/` },
  { name: 'shop', url: `${BASE_URL}/shop` },
  { name: 'pdp', url: `${BASE_URL}/products/terrain-runner-pro` },
];

const BREAKPOINTS = [
  { name: 'xs', width: 320, height: 800 },
  { name: 'sm', width: 640, height: 900 },
  { name: 'md', width: 768, height: 1024 },
  { name: 'lg', width: 1024, height: 800 },
  { name: 'xl', width: 1280, height: 800 },
];

async function run() {
  const executablePath = process.env.CHROME_PATH;
  const browser = await chromium.launch(executablePath ? { executablePath } : {});
  
  for (const route of ROUTES) {
    for (const bp of BREAKPOINTS) {
      const context = await browser.newContext({
        viewport: { width: bp.width, height: bp.height }
      });
      const page = await context.newPage();
      
      console.log(`Testing ${route.name} at ${bp.name} (${bp.width}x${bp.height})...`);
      try {
        await page.goto(route.url, { waitUntil: 'networkidle' });
        const screenshotPath = path.join(__dirname, '..', '.screenshots', `${route.name}-${bp.name}.png`);
        await page.screenshot({ path: screenshotPath, fullPage: true });
        console.log(`  -> Saved screenshot: ${screenshotPath}`);
      } catch (err) {
        console.error(`  -> Failed to load ${route.url}: ${err.message}`);
      }
      await context.close();
    }
  }
  
  await browser.close();
  console.log('Visual QA capture complete.');
}

run();

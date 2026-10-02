import { test, expect } from '@playwright/test';

test.describe('Health & Basics', () => {
  test('home page loads without console errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    await page.goto('/');
    expect(errors.length).toBe(0);
  });
});

test.describe('Shop & Filters', () => {
  test('shop loads with categories', async ({ page }) => {
    await page.goto('/shop');
    await expect(page.locator('h1')).toContainText('All Shoes');
  });

  test('mobile filter drawer opens', async ({ page, isMobile }) => {
    if (!isMobile) test.skip();
    await page.goto('/shop');
    // Stub for opening drawer
  });
});

test.describe('SEO', () => {
  test('canonical and title are present', async ({ page }) => {
    await page.goto('/shop/sneakers');
    await expect(page).toHaveTitle(/Sneakers Shoes/);
    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
    expect(canonical).toBe('/shop/sneakers');
  });
});

test.describe('PDP', () => {
  test('add to bag blocked without size', async ({ page }) => {
    await page.goto('/products/terrain-runner-pro');
    await page.getByRole('button', { name: 'Select Size' }).click();
    await expect(page.getByText('Please select a size')).toBeVisible();
  });
});

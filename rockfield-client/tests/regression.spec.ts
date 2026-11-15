import { test, expect } from '@playwright/test';

test.describe('Health & Basics', () => {
  test('home page loads without console errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
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

test.describe('Product card', () => {
  // globals.css used to stretch every direct child of .aspect-shoe-card to 100% x 100%, so the
  // wishlist button covered the whole image: it rendered as a giant circle on hover/tap, and
  // clicking the product image toggled the wishlist instead of opening the product.
  test('wishlist overlay stays small and the image opens the product', async ({ page }) => {
    await page.goto('/shop');
    const imageBox = page.locator('.aspect-shoe-card').first();
    const wishlist = imageBox.getByRole('button', { name: 'Add to wishlist' });
    await expect(wishlist).toBeAttached();

    // Desktop /shop briefly lays the grid out at zero width while loading; measure once settled.
    await expect(async () => {
      const card = (await imageBox.boundingBox())!;
      const button = (await wishlist.boundingBox())!;
      expect(card.width).toBeGreaterThan(100);
      expect(button.width).toBeLessThan(card.width / 3);
      expect(button.height).toBeLessThan(card.height / 3);
    }).toPass({ timeout: 10_000 });

    // The image itself must stay a plain link to the product (retry covers pre-hydration clicks)
    await expect(async () => {
      await imageBox.click();
      await expect(page).toHaveURL(/\/products\//, { timeout: 2_000 });
    }).toPass({ timeout: 15_000 });
    await page.goto('/shop');
    await expect(
      page
        .locator('.aspect-shoe-card')
        .first()
        .getByRole('button', { name: 'Remove from wishlist' })
    ).toHaveCount(0);
  });
});

test.describe('SEO', () => {
  test('canonical and title are present', async ({ page }) => {
    await page.goto('/shop/sneakers');
    await expect(page).toHaveTitle(/Sneakers Shoes/);
    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
    expect(new URL(canonical!).pathname).toBe('/shop/sneakers');
  });
});

test.describe('PDP', () => {
  test('add to bag blocked without size', async ({ page }) => {
    await page.goto('/products/terrain-runner-pro');
    await page.getByRole('button', { name: 'Select Size' }).click();
    await expect(page.getByText('Please select a size')).toBeVisible();
  });
});

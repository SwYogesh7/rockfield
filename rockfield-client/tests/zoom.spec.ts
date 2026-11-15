import { test, expect } from '@playwright/test';

test.describe('PDP Image Zoom', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/products/terrain-runner-pro');
    await page.waitForSelector('text=Terrain Runner Pro');
  });

  test('desktop hover changes transform and click opens lightbox', async ({ page, isMobile }) => {
    if (isMobile) test.skip();

    const mainImageContainer = page.locator('.cursor-zoom-in').first();
    const imageWrapper = mainImageContainer.locator('div[style*="transform"]');

    // Hover triggers scale(2).
    // The page is server-rendered, so the product title is visible before React hydrates and
    // attaches the mousemove handler. hover() fires a single mousemove, which is lost if it lands
    // before hydration (a real cursor keeps emitting moves, so users never see this). Move away and
    // re-hover until the handler is live, instead of depending on hydration timing.
    await expect(async () => {
      await page.mouse.move(0, 0);
      await mainImageContainer.hover();
      expect(await imageWrapper.getAttribute('style')).toContain('scale(2)');
    }).toPass({ timeout: 10_000 });

    // Click opens lightbox
    await mainImageContainer.click();
    await expect(page.locator('[role="dialog"]')).toBeVisible();
    await expect(page.locator('text=1 / 5')).toBeVisible(); // assuming 3 images

    // Arrows work
    await page.keyboard.press('ArrowRight');
    await expect(page.locator('text=2 / 5')).toBeVisible();
    await page.keyboard.press('ArrowLeft');
    await expect(page.locator('text=1 / 5')).toBeVisible();

    // Esc works
    await page.keyboard.press('Escape');
    await expect(page.locator('[role="dialog"]')).toBeHidden();
  });

  test('mobile tap opens lightbox and swipe changes image', async ({ page, isMobile }) => {
    if (!isMobile) test.skip();

    const mainImageContainer = page.locator('.cursor-zoom-in').first();
    await mainImageContainer.click();

    await expect(page.locator('[role="dialog"]')).toBeVisible();
    await expect(page.locator('text=1 / 5')).toBeVisible();

    // Emulate swipe
    const lightboxArea = page.locator('[role="dialog"] .touch-none');
    await lightboxArea.dragTo(lightboxArea, {
      sourcePosition: { x: 300, y: 300 },
      targetPosition: { x: 50, y: 300 }, // Swipe left
    });

    await expect(page.locator('text=2 / 5')).toBeVisible();

    // Close button works
    await page.getByRole('button', { name: 'Close' }).click();
    await expect(page.locator('[role="dialog"]')).toBeHidden();
  });
});

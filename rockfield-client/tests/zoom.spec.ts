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
    
    // Hover triggers scale(2)
    await mainImageContainer.hover();
    await page.waitForTimeout(200);
    const style = await imageWrapper.getAttribute('style');
    expect(style).toContain('scale(2)');
    
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
      targetPosition: { x: 50, y: 300 } // Swipe left
    });
    
    await expect(page.locator('text=2 / 5')).toBeVisible();
    
    // Close button works
    await page.getByRole('button', { name: 'Close' }).click();
    await expect(page.locator('[role="dialog"]')).toBeHidden();
  });
});


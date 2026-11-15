import { test, expect, type Locator, type Page } from '@playwright/test';

// "Add to bag" on shop grid cards.
//
// Stock in the mock catalogue is randomised per server start, so tests never assume which size or
// colour is picked: they read the variant off the card caption and check the bag matches it.

const STORAGE_KEY = 'rockfield-cart';

// By accessible name: only matches buttons currently reading "Add to bag" (use for counting).
const addButtons = (page: Page) => page.getByRole('button', { name: /^Add to bag/ });
// Stable across the "Added" label swap — use this for anything that clicks.
const quickAddButtons = (page: Page) => page.locator('button[data-variant-id]');
const cartButton = (page: Page) => page.locator('header button[aria-label^="Cart"]');
const drawer = (page: Page) => page.getByTestId('cart-drawer');

/** The card wrapping a given quick-add button (the motion.div around link + info). */
const cardOf = (button: Locator) =>
  button.locator('xpath=ancestor::div[contains(@class,"group")][1]');

async function storedItems(page: Page) {
  return page.evaluate((key) => {
    const raw = window.localStorage.getItem(key);
    return raw
      ? (JSON.parse(raw).state.items as { variantId: string; quantity: number; maxStock: number }[])
      : [];
  }, STORAGE_KEY);
}

// The grid is server-rendered, so a click can land before React hydrates and be lost. Retry until
// the button confirms, but never re-click once it has (that would add a second unit).
async function quickAdd(button: Locator) {
  await expect(async () => {
    if ((await button.getAttribute('data-state')) !== 'added') await button.click();
    await expect(button).toHaveAttribute('data-state', 'added', { timeout: 1_000 });
  }).toPass({ timeout: 15_000 });
}

test.describe('Shop grid — Add to bag', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/shop');
    await expect(quickAddButtons(page).first()).toBeVisible();
  });

  test('every card has an Add to bag button, outside the product link', async ({ page }) => {
    const cards = page.locator('main h3');
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
    await expect(addButtons(page)).toHaveCount(count);

    // A <button> inside an <a> is invalid HTML and breaks keyboard/screen-reader use
    await expect(page.locator('a button[data-variant-id]')).toHaveCount(0);

    // Accessible name starts with the visible label, then says exactly what gets added
    const first = quickAddButtons(page).first();
    const caption = await cardOf(first).getByTestId('quick-add-variant').textContent();
    const [size, colour] = caption!.split(' · '); // "UK 6 · Cloud White"
    const productName = await cardOf(first).locator('h3').textContent();
    await expect(first).toHaveAccessibleName(`Add to bag: ${productName}, ${colour}, ${size}`);
  });

  test('adds the first available variant without leaving the grid or opening the drawer', async ({
    page,
  }) => {
    const button = quickAddButtons(page).first();
    const card = cardOf(button);
    const productName = (await card.locator('h3').textContent())!;
    const [size, colour] = (await card.getByTestId('quick-add-variant').textContent())!.split(
      ' · '
    );

    await quickAdd(button);

    await expect(page).toHaveURL(/\/shop$/);
    await expect(drawer(page)).toBeHidden();
    await expect(cartButton(page)).toHaveAttribute('aria-label', 'Cart — 1 items');

    // The bag holds exactly the variant the card advertised
    await cartButton(page).click();
    const item = page.getByTestId('cart-item');
    await expect(item).toHaveCount(1);
    await expect(item.getByRole('link', { name: productName, exact: true })).toBeVisible();
    await expect(item.getByTestId('cart-item-color')).toHaveText(colour);
    await expect(item.getByTestId('cart-item-size')).toHaveText(size);
    await expect(item.getByTestId('cart-item-quantity')).toHaveText('1');
  });

  test('confirms briefly, announces to screen readers, then resets', async ({ page }) => {
    const button = quickAddButtons(page).first();
    const card = cardOf(button);
    const status = card.getByTestId('quick-add-status');
    await expect(status).toHaveText('');

    await quickAdd(button);

    // Visible confirmation, with the name still leading with the visible text
    await expect(button).toContainText('Added');
    await expect(button).toHaveAccessibleName(/^Added to bag: /);
    await expect(status).toHaveAttribute('role', 'status');
    await expect(status).toHaveText(/added to bag\. 1 in bag\.$/);

    // ...and it goes away on its own (QUICK_ADD_CONFIRM_MS = 2s)
    await expect(button).toHaveAttribute('data-state', 'idle', { timeout: 5_000 });
    await expect(button).toContainText('Add to bag');
    await expect(status).toHaveText('');
  });

  test('works from the keyboard', async ({ page }) => {
    const button = quickAddButtons(page).first();
    await expect(async () => {
      if ((await button.getAttribute('data-state')) !== 'added') {
        await button.focus();
        await page.keyboard.press('Enter');
      }
      await expect(button).toHaveAttribute('data-state', 'added', { timeout: 1_000 });
    }).toPass({ timeout: 15_000 });

    await expect(button).toBeFocused(); // focus isn't lost when the label swaps
    await expect(cartButton(page)).toHaveAttribute('aria-label', 'Cart — 1 items');
  });

  test('adding again increments the same line and re-announces', async ({ page }) => {
    const button = quickAddButtons(page).first();
    const status = cardOf(button).getByTestId('quick-add-status');

    await quickAdd(button);
    await expect(status).toHaveText(/1 in bag\.$/);

    // Second click while the confirmation is still showing
    await button.click();
    await expect(status).toHaveText(/2 in bag\.$/);

    const items = await storedItems(page);
    expect(items).toHaveLength(1);
    expect(items[0].quantity).toBe(2);
    await expect(cartButton(page)).toHaveAttribute('aria-label', 'Cart — 2 items');
  });

  test('different cards add separate lines', async ({ page }) => {
    const buttons = quickAddButtons(page);
    test.skip((await buttons.count()) < 2, 'needs at least two in-stock products on the page');

    await quickAdd(buttons.nth(0));
    await quickAdd(buttons.nth(1));

    const items = await storedItems(page);
    expect(items).toHaveLength(2);
    expect(items[0].variantId).not.toBe(items[1].variantId);
  });

  test('refuses to add past available stock and says why', async ({ page }) => {
    const button = quickAddButtons(page).first();
    const variantId = (await button.getAttribute('data-variant-id'))!;

    // Learn the variant's stock from a real add, then fill the line up to it
    await quickAdd(button);
    const [line] = await storedItems(page);
    expect(line.variantId).toBe(variantId);
    await page.evaluate(
      ({ key, max }) => {
        const data = JSON.parse(window.localStorage.getItem(key)!);
        data.state.items[0].quantity = max;
        window.localStorage.setItem(key, JSON.stringify(data));
      },
      { key: STORAGE_KEY, max: line.maxStock }
    );
    await page.reload();

    const reloaded = page.locator(`button[data-variant-id="${variantId}"]`);
    await expect(async () => {
      await reloaded.click();
      await expect(page.getByText(`Only ${line.maxStock} left in stock`)).toBeVisible({
        timeout: 1_000,
      });
    }).toPass({ timeout: 15_000 });

    // No false confirmation, and the bag is unchanged
    await expect(reloaded).toHaveAttribute('data-state', 'idle');
    expect((await storedItems(page))[0].quantity).toBe(line.maxStock);
  });
});

test('Add to bag only appears on the shop grid, not on other card lists', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('main h3').first()).toBeVisible();
  await expect(quickAddButtons(page)).toHaveCount(0);
});

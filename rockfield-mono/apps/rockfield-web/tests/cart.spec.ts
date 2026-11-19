import { test, expect, type Page } from '@playwright/test';

// Cart drawer + add-to-bag flow.
//
// Runs against the mock catalogue. Stock per size is randomised when the mock module loads, so
// tests never hardcode a size — they pick the first in-stock one. Prices are read back from the
// drawer rather than hardcoded, so the expectations stay valid if the mock price changes.

const PDP = '/products/terrain-runner-pro';

// Same formatter as src/constants formatPrice, but from rupees (tests read rupees off the DOM).
const rupees = (n: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);

const parseRupees = (text: string | null) => Number((text ?? '').replace(/[^\d]/g, ''));

const drawer = (page: Page) => page.getByTestId('cart-drawer');
// CSS rather than getByRole: while the (modal) drawer is open, Radix marks the rest of the page
// aria-hidden, which removes the navbar button from the accessibility tree.
const cartButton = (page: Page) => page.locator('header button[aria-label^="Cart"]');

// The PDP is server-rendered, so buttons are visible before React attaches handlers. A click that
// lands pre-hydration is silently lost, so every "first interaction" below retries until the UI
// actually reacts (same approach as tests/zoom.spec.ts).
async function openDrawerFromNavbar(page: Page) {
  await expect(async () => {
    await cartButton(page).click();
    await expect(drawer(page)).toBeVisible({ timeout: 1_000 });
  }).toPass({ timeout: 15_000 });
}

async function selectInStockSize(page: Page) {
  // Out-of-stock sizes render a strike-through <div>; in-stock ones are plain text buttons.
  const inStock = page
    .locator('button', { hasText: /^UK \d/ })
    .filter({ hasNot: page.locator('div') })
    .first();
  await expect(inStock).toBeVisible();
  const size = (await inStock.textContent())!.trim(); // e.g. "UK 8"

  await expect(async () => {
    await inStock.click();
    // Label flips from "Select Size" to "Add to Bag" once state has updated.
    await expect(page.getByRole('button', { name: 'Add to Bag' })).toBeVisible({ timeout: 1_000 });
  }).toPass({ timeout: 15_000 });

  return size;
}

async function addToBag(page: Page) {
  await page.goto(PDP);
  await page.waitForSelector('text=Terrain Runner Pro');
  const size = await selectInStockSize(page);
  await page.getByRole('button', { name: 'Add to Bag' }).click();
  await expect(drawer(page)).toBeVisible();
  await expect(page.getByTestId('cart-item')).toHaveCount(1);
  return size;
}

async function closeDrawer(page: Page) {
  await page.keyboard.press('Escape');
  await expect(drawer(page)).toBeHidden();
}

// ── Seeding the persisted cart ──────────────────────────────────────────────────────────────
// PDP stock is random, so stock-limit behaviour is tested against a cart with a known maxStock.
const STORAGE_KEY = 'rockfield-cart';
const UNIT_PRICE = 349900; // paise → ₹3,499

function cartLine(overrides: Record<string, unknown> = {}) {
  return {
    variantId: 'rf-001-rf-001-wht-8',
    productId: 'rf-001',
    slug: 'terrain-runner-pro',
    name: 'Terrain Runner Pro',
    colorName: 'Cloud White',
    size: 8,
    image: '/placeholders/shoe.svg',
    unitPrice: UNIT_PRICE,
    quantity: 1,
    maxStock: 3,
    ...overrides,
  };
}

/**
 * Writes a persisted cart before any page script runs. Only seeds an empty storage slot, so
 * changes made during the test survive page.reload().
 */
async function seedCart(page: Page, items: object[], version = 1) {
  await page.addInitScript(
    ({ key, value }) => {
      if (!window.localStorage.getItem(key)) window.localStorage.setItem(key, value);
    },
    {
      key: STORAGE_KEY,
      value: JSON.stringify({
        state: { items, couponCode: null, discountAmount: 0 },
        version,
      }),
    }
  );
}

async function storedItems(page: Page) {
  return page.evaluate((key) => {
    const raw = window.localStorage.getItem(key);
    return raw
      ? (JSON.parse(raw).state.items as { variantId: string; quantity: number; maxStock: number }[])
      : [];
  }, STORAGE_KEY);
}

test.describe('Cart drawer — open / close', () => {
  test('navbar cart icon opens an empty drawer that links to /shop', async ({ page }) => {
    await page.goto('/');
    await openDrawerFromNavbar(page);

    await expect(drawer(page)).toHaveAttribute('aria-label', 'Shopping bag');
    await expect(drawer(page).getByRole('heading', { name: 'Your Bag' })).toBeVisible();
    await expect(page.getByTestId('cart-empty')).toBeVisible();
    await expect(page.getByText('Your bag is empty')).toBeVisible();
    // No totals / coupon for an empty bag
    await expect(page.getByTestId('cart-subtotal')).toHaveCount(0);
    await expect(page.getByLabel('Coupon code')).toHaveCount(0);

    await page.getByRole('link', { name: 'Continue shopping' }).click();
    await expect(page).toHaveURL(/\/shop$/);
    // Drawer is global (lives in the root layout) — it must not stay open across navigation
    await expect(drawer(page)).toBeHidden();
  });

  test('is a right-hand panel on desktop and a bottom sheet on mobile', async ({
    page,
    isMobile,
  }) => {
    await page.goto('/');
    await openDrawerFromNavbar(page);

    await expect(drawer(page)).toHaveAttribute(
      'data-vaul-drawer-direction',
      isMobile ? 'bottom' : 'right'
    );

    const viewport = page.viewportSize()!;
    // Poll: the drawer is "visible" while still sliding in, so wait for it to settle in place.
    await expect(async () => {
      const box = (await drawer(page).boundingBox())!;
      if (isMobile) {
        // Bottom sheet: full width, anchored to the bottom edge
        expect(Math.round(box.x)).toBe(0);
        expect(Math.round(box.width)).toBe(viewport.width);
        expect(Math.round(box.y + box.height)).toBe(viewport.height);
      } else {
        // Side panel: full height, anchored to the right edge
        expect(Math.round(box.x + box.width)).toBe(viewport.width);
        expect(Math.round(box.height)).toBe(viewport.height);
        expect(box.width).toBeLessThan(viewport.width);
      }
    }).toPass({ timeout: 5_000 });
  });

  test('closes with the close button and with Escape', async ({ page }) => {
    await page.goto('/');
    await openDrawerFromNavbar(page);

    await page.getByRole('button', { name: 'Close bag' }).click();
    await expect(drawer(page)).toBeHidden();

    await openDrawerFromNavbar(page);
    await page.keyboard.press('Escape');
    await expect(drawer(page)).toBeHidden();
  });
});

test.describe('Add to bag from PDP', () => {
  test('adds the selected colour + size and opens the drawer', async ({ page }) => {
    const size = await addToBag(page);

    const item = page.getByTestId('cart-item');
    await expect(item.getByRole('link', { name: 'Terrain Runner Pro' })).toBeVisible();
    await expect(item.getByTestId('cart-item-color')).toHaveText('Cloud White'); // default colour
    await expect(item.getByTestId('cart-item-size')).toHaveText(size);
    await expect(item.getByTestId('cart-item-quantity')).toHaveText('1');
    await expect(item.getByTestId('cart-item-image')).toBeVisible();

    // Header count, navbar badge, and totals all agree
    await expect(page.getByTestId('cart-drawer-count')).toHaveText('(1)');
    await expect(cartButton(page)).toHaveAttribute('aria-label', 'Cart — 1 items');

    const unit = parseRupees(await item.getByTestId('cart-item-total').textContent());
    expect(unit).toBeGreaterThan(0);
    await expect(page.getByTestId('cart-subtotal')).toHaveText(rupees(unit));
    await expect(page.getByTestId('cart-total')).toHaveText(rupees(unit));
    await expect(page.getByTestId('cart-discount')).toHaveCount(0);
  });

  test('adding the same variant again increments quantity instead of adding a row', async ({
    page,
  }) => {
    await addToBag(page);
    await closeDrawer(page);

    await page.getByRole('button', { name: 'Add to Bag' }).click();
    await expect(drawer(page)).toBeVisible();

    await expect(page.getByTestId('cart-item')).toHaveCount(1);
    await expect(page.getByTestId('cart-item-quantity')).toHaveText('2');
    await expect(page.getByTestId('cart-drawer-count')).toHaveText('(2)');
  });

  test('still blocks add-to-bag until a size is selected', async ({ page }) => {
    await page.goto(PDP);
    await page.getByRole('button', { name: 'Select Size' }).click();
    await expect(page.getByText('Please select a size')).toBeVisible();
    await expect(drawer(page)).toBeHidden();
  });
});

test.describe('Cart items', () => {
  test('quantity stepper updates line total, subtotal and badge', async ({ page }) => {
    await addToBag(page);
    const item = page.getByTestId('cart-item');
    const unit = parseRupees(await item.getByTestId('cart-item-total').textContent());

    await item.getByRole('button', { name: 'Increase quantity' }).click();
    await expect(item.getByTestId('cart-item-quantity')).toHaveText('2');
    await expect(item.getByTestId('cart-item-total')).toHaveText(rupees(unit * 2));
    await expect(item.getByText(`${rupees(unit)} each`)).toBeVisible();
    await expect(page.getByTestId('cart-subtotal')).toHaveText(rupees(unit * 2));
    await expect(page.getByTestId('cart-total')).toHaveText(rupees(unit * 2));
    await expect(cartButton(page)).toHaveAttribute('aria-label', 'Cart — 2 items');

    await item.getByRole('button', { name: 'Decrease quantity' }).click();
    await expect(item.getByTestId('cart-item-quantity')).toHaveText('1');
    await expect(page.getByTestId('cart-subtotal')).toHaveText(rupees(unit));
  });

  test('decreasing quantity to zero removes the line', async ({ page }) => {
    await addToBag(page);
    await page.getByRole('button', { name: 'Decrease quantity' }).click();

    await expect(page.getByTestId('cart-item')).toHaveCount(0);
    await expect(page.getByTestId('cart-empty')).toBeVisible();
    await expect(cartButton(page)).toHaveAttribute('aria-label', 'Cart — 0 items');
  });

  test('remove button clears the line and shows the empty state', async ({ page }) => {
    await addToBag(page);
    await page.getByRole('button', { name: /^Remove Terrain Runner Pro/ }).click();

    await expect(page.getByTestId('cart-item')).toHaveCount(0);
    await expect(page.getByTestId('cart-empty')).toBeVisible();
    await expect(page.getByTestId('cart-subtotal')).toHaveCount(0);
  });

  test('product name links to the PDP and closes the drawer', async ({ page }) => {
    await addToBag(page);
    await page.goto('/shop');
    await openDrawerFromNavbar(page);

    await page.getByTestId('cart-item').getByRole('link', { name: 'Terrain Runner Pro' }).click();
    await expect(page).toHaveURL(/\/products\/terrain-runner-pro/);
    await expect(drawer(page)).toBeHidden();
  });
});

test.describe('Coupons', () => {
  test('ROCK10 takes 10% off and tracks quantity changes', async ({ page }) => {
    await addToBag(page);
    const unit = parseRupees(await page.getByTestId('cart-item-total').textContent());

    // Case-insensitive entry
    await page.getByLabel('Coupon code').fill('rock10');
    await page.getByRole('button', { name: 'Apply' }).click();

    await expect(page.getByTestId('coupon-applied')).toContainText('ROCK10');
    await expect(page.getByTestId('coupon-applied')).toContainText('10% off');
    await expect(page.getByTestId('cart-discount')).toHaveText(`−${rupees(unit * 0.1)}`);
    await expect(page.getByTestId('cart-subtotal')).toHaveText(rupees(unit));
    await expect(page.getByTestId('cart-total')).toHaveText(rupees(unit * 0.9));

    // Percentage discount must follow the subtotal, not stay frozen at the value it was applied on
    await page.getByRole('button', { name: 'Increase quantity' }).click();
    await expect(page.getByTestId('cart-subtotal')).toHaveText(rupees(unit * 2));
    await expect(page.getByTestId('cart-discount')).toHaveText(`−${rupees(unit * 2 * 0.1)}`);
    await expect(page.getByTestId('cart-total')).toHaveText(rupees(unit * 2 * 0.9));
  });

  test('removing the coupon restores the full total', async ({ page }) => {
    await addToBag(page);
    const unit = parseRupees(await page.getByTestId('cart-item-total').textContent());

    await page.getByLabel('Coupon code').fill('ROCK10');
    await page.getByRole('button', { name: 'Apply' }).click();
    await expect(page.getByTestId('cart-discount')).toBeVisible();

    await page.getByRole('button', { name: 'Remove coupon ROCK10' }).click();
    await expect(page.getByTestId('coupon-applied')).toHaveCount(0);
    await expect(page.getByTestId('cart-discount')).toHaveCount(0);
    await expect(page.getByTestId('cart-total')).toHaveText(rupees(unit));
    await expect(page.getByLabel('Coupon code')).toBeVisible();
  });

  test('invalid code shows an error and applies no discount', async ({ page }) => {
    await addToBag(page);
    const unit = parseRupees(await page.getByTestId('cart-item-total').textContent());

    const input = page.getByLabel('Coupon code');
    await input.fill('NOPE99');
    await page.getByRole('button', { name: 'Apply' }).click();

    await expect(page.getByRole('alert')).toHaveText('"NOPE99" is not a valid coupon code.');
    await expect(input).toHaveAttribute('aria-invalid', 'true');
    await expect(page.getByTestId('cart-discount')).toHaveCount(0);
    await expect(page.getByTestId('cart-total')).toHaveText(rupees(unit));

    // Error clears as soon as the user edits the code
    await input.fill('R');
    await expect(page.getByRole('alert')).toHaveCount(0);
  });

  test('apply is disabled while the input is empty', async ({ page }) => {
    await addToBag(page);
    await expect(page.getByRole('button', { name: 'Apply' })).toBeDisabled();
    await page.getByLabel('Coupon code').fill('x');
    await expect(page.getByRole('button', { name: 'Apply' })).toBeEnabled();
  });

  test('coupon is dropped when the bag is emptied', async ({ page }) => {
    await addToBag(page);
    await page.getByLabel('Coupon code').fill('ROCK10');
    await page.getByRole('button', { name: 'Apply' }).click();
    await expect(page.getByTestId('coupon-applied')).toBeVisible();

    await page.getByRole('button', { name: /^Remove Terrain Runner Pro/ }).click();
    await expect(page.getByTestId('cart-empty')).toBeVisible();

    // Add again — the stale coupon must not silently re-appear with an old amount
    await closeDrawer(page);
    await page.getByRole('button', { name: 'Add to Bag' }).click();
    await expect(page.getByTestId('cart-item')).toHaveCount(1);
    await expect(page.getByTestId('coupon-applied')).toHaveCount(0);
    await expect(page.getByTestId('cart-discount')).toHaveCount(0);
  });
});

test.describe('Persistence', () => {
  test('items and coupon survive a reload; open state does not', async ({ page }) => {
    const size = await addToBag(page);
    await page.getByLabel('Coupon code').fill('ROCK10');
    await page.getByRole('button', { name: 'Apply' }).click();
    await expect(page.getByTestId('coupon-applied')).toBeVisible();

    await page.reload();
    await page.waitForSelector('text=Terrain Runner Pro');

    // Drawer is closed after reload (isOpen isn't persisted), but the badge reflects the bag
    await expect(drawer(page)).toBeHidden();
    await expect(cartButton(page)).toHaveAttribute('aria-label', 'Cart — 1 items');

    await openDrawerFromNavbar(page);
    await expect(page.getByTestId('cart-item')).toHaveCount(1);
    await expect(page.getByTestId('cart-item-size')).toHaveText(size);
    await expect(page.getByTestId('coupon-applied')).toContainText('ROCK10');
    await expect(page.getByTestId('cart-discount')).toBeVisible();
  });
});

test.describe('Stock limits', () => {
  test('+ is disabled once quantity reaches the available stock', async ({ page }) => {
    await seedCart(page, [cartLine({ quantity: 1, maxStock: 3 })]);
    await page.goto('/');
    await openDrawerFromNavbar(page);

    const item = page.getByTestId('cart-item');
    const increase = item.getByRole('button', { name: 'Increase quantity' });
    const quantity = item.getByTestId('cart-item-quantity');

    await expect(increase).toBeEnabled();
    await expect(item.getByTestId('cart-item-stock-note')).toHaveCount(0);

    await increase.click();
    await expect(quantity).toHaveText('2');
    await expect(increase).toBeEnabled();

    await increase.click();
    await expect(quantity).toHaveText('3');

    // At the limit: button disabled, reason shown and tied to the button for screen readers
    await expect(increase).toBeDisabled();
    await expect(item.getByTestId('cart-item-stock-note')).toHaveText('Only 3 in stock');
    await expect(increase).toHaveAccessibleDescription('Only 3 in stock');

    // Clicking anyway must not push past stock
    await increase.click({ force: true });
    await expect(quantity).toHaveText('3');
    await expect(page.getByTestId('cart-subtotal')).toHaveText(rupees((UNIT_PRICE / 100) * 3));
    expect((await storedItems(page))[0].quantity).toBe(3);

    // Going back below the limit re-enables + and hides the note
    await item.getByRole('button', { name: 'Decrease quantity' }).click();
    await expect(quantity).toHaveText('2');
    await expect(increase).toBeEnabled();
    await expect(item.getByTestId('cart-item-stock-note')).toHaveCount(0);
  });

  test('a line with a single unit in stock cannot be increased at all', async ({ page }) => {
    await seedCart(page, [cartLine({ quantity: 1, maxStock: 1 })]);
    await page.goto('/');
    await openDrawerFromNavbar(page);

    const item = page.getByTestId('cart-item');
    await expect(item.getByRole('button', { name: 'Increase quantity' })).toBeDisabled();
    await expect(item.getByTestId('cart-item-stock-note')).toHaveText('Only 1 in stock');
    // Decrease still works (removes the line)
    await expect(item.getByRole('button', { name: 'Decrease quantity' })).toBeEnabled();
  });

  test('limits are per line — one item at its cap does not block another', async ({ page }) => {
    await seedCart(page, [
      cartLine({ quantity: 2, maxStock: 2 }),
      cartLine({
        variantId: 'rf-001-rf-001-blk-9',
        colorName: 'Midnight Black',
        size: 9,
        quantity: 1,
        maxStock: 10,
      }),
    ]);
    await page.goto('/');
    await openDrawerFromNavbar(page);

    const capped = page.locator('[data-variant-id="rf-001-rf-001-wht-8"]');
    const open = page.locator('[data-variant-id="rf-001-rf-001-blk-9"]');
    await expect(capped.getByRole('button', { name: 'Increase quantity' })).toBeDisabled();
    await expect(open.getByRole('button', { name: 'Increase quantity' })).toBeEnabled();

    await open.getByRole('button', { name: 'Increase quantity' }).click();
    await expect(open.getByTestId('cart-item-quantity')).toHaveText('2');
    await expect(capped.getByTestId('cart-item-quantity')).toHaveText('2');
  });

  test('the stock limit survives a reload', async ({ page }) => {
    await seedCart(page, [cartLine({ quantity: 1, maxStock: 2 })]);
    await page.goto('/');
    await openDrawerFromNavbar(page);
    await page.getByRole('button', { name: 'Increase quantity' }).click();
    await expect(page.getByRole('button', { name: 'Increase quantity' })).toBeDisabled();

    await page.reload();
    await openDrawerFromNavbar(page);
    await expect(page.getByTestId('cart-item-quantity')).toHaveText('2');
    await expect(page.getByRole('button', { name: 'Increase quantity' })).toBeDisabled();
  });

  test('PDP stores the variant stock, and the stepper stops exactly there', async ({ page }) => {
    await addToBag(page);

    // Stock is randomised per size in the mock data; read back what the PDP recorded.
    const [line] = await storedItems(page);
    expect(line.maxStock).toBeGreaterThan(0);

    const item = page.getByTestId('cart-item');
    const increase = item.getByRole('button', { name: 'Increase quantity' });
    for (let qty = 1; qty < line.maxStock; qty++) {
      await expect(increase).toBeEnabled();
      await increase.click();
      await expect(item.getByTestId('cart-item-quantity')).toHaveText(String(qty + 1));
    }
    await expect(increase).toBeDisabled();
    await expect(item.getByTestId('cart-item-stock-note')).toHaveText(
      `Only ${line.maxStock} in stock`
    );

    // Add to Bag on the PDP can't get around the cap either
    await closeDrawer(page);
    await page.getByRole('button', { name: 'Add to Bag' }).click();
    await expect(page.getByText(`Only ${line.maxStock} left in stock`)).toBeVisible();
    expect((await storedItems(page))[0].quantity).toBe(line.maxStock);
  });

  test('carts saved before maxStock existed are migrated to a safe cap', async ({ page }) => {
    // Storage v0 shape: no maxStock on the line
    const { maxStock: _omit, ...legacyLine } = cartLine({ quantity: 9 });
    void _omit;
    await seedCart(page, [legacyLine], 0);
    await page.goto('/');
    await openDrawerFromNavbar(page);

    // Without the migration `quantity >= undefined` is always false and + never disables
    const increase = page.getByRole('button', { name: 'Increase quantity' });
    await expect(increase).toBeEnabled();
    await increase.click();
    await expect(page.getByTestId('cart-item-quantity')).toHaveText('10');
    await expect(increase).toBeDisabled();
    expect((await storedItems(page))[0].maxStock).toBe(10);
  });
});

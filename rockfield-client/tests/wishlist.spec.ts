import { test, expect, type Locator, type Page } from '@playwright/test';

// Wishlist: saving from the shop grid, the /wishlist page, and the navbar badge.
//
// Stock in the mock catalogue is randomised per server start, so the variant a card saves is never
// hardcoded: tests read it off the heart (data-wishlist-variant-id) and the card's product name.
// Every test starts with empty localStorage (Playwright gives each test a fresh context).

const WISHLIST_KEY = 'rockfield-wishlist';
const CART_KEY = 'rockfield-cart';

// Hearts only carry data-wishlist-variant-id when the product has an in-stock variant to save,
// so this never matches the disabled heart on a sold-out card.
const hearts = (page: Page) => page.locator('button[data-wishlist-variant-id]');
const cardNames = (page: Page) => page.locator('main h3');
const wishlistNavButton = (page: Page) => page.locator('header a[aria-label^="Wishlist"]');
const wishlistBadge = (page: Page) => page.getByTestId('wishlist-count');
const cartButton = (page: Page) => page.locator('header button[aria-label^="Cart"]');

/** The card wrapping a given heart (the motion.div around link + info). */
const cardOf = (el: Locator) => el.locator('xpath=ancestor::div[contains(@class,"group")][1]');

const escapeRegExp = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

async function storedWishlist(page: Page) {
  return page.evaluate((key) => {
    const raw = window.localStorage.getItem(key);
    return raw
      ? (JSON.parse(raw).state.items as { variantId: string; productId: string; name: string }[])
      : [];
  }, WISHLIST_KEY);
}

async function storedCart(page: Page) {
  return page.evaluate((key) => {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw).state.items as { variantId: string; quantity: number }[]) : [];
  }, CART_KEY);
}

// Cards are server-rendered, so a click can land before React hydrates and be lost. Retry until
// the heart reports pressed, but never click again once it is (that would unsave it).
async function saveToWishlist(heart: Locator) {
  await expect(async () => {
    if ((await heart.getAttribute('aria-pressed')) !== 'true') await heart.click();
    await expect(heart).toHaveAttribute('aria-pressed', 'true', { timeout: 1_000 });
  }).toPass({ timeout: 15_000 });
}

/**
 * Saves the first `count` in-stock products on /shop, in page order.
 * Returns what was saved so tests can compare against the wishlist page.
 */
async function saveFromShop(page: Page, count: number) {
  await page.goto('/shop');
  await expect(hearts(page).first()).toBeAttached();
  test.skip((await hearts(page).count()) < count, `needs ${count} in-stock products on /shop`);

  const saved: { name: string; variantId: string }[] = [];
  for (let i = 0; i < count; i++) {
    const heart = hearts(page).nth(i);
    await saveToWishlist(heart);
    saved.push({
      name: (await cardOf(heart).locator('h3').textContent())!.trim(),
      variantId: (await heart.getAttribute('data-wishlist-variant-id'))!,
    });
  }
  return saved;
}

/** Opens /wishlist and waits until the saved cards have rendered (they need hydration). */
async function openWishlist(page: Page, expectedCount: number) {
  await page.goto('/wishlist');
  await expect(cardNames(page)).toHaveCount(expectedCount);
}

test.describe('Wishlist page — empty state', () => {
  test('explains the wishlist is empty and links back to the shop', async ({ page }) => {
    await page.goto('/wishlist');

    await expect(page).toHaveTitle(/^Wishlist \| Rockfield/);
    await expect(page.getByRole('heading', { level: 1, name: 'Wishlist' })).toBeVisible();
    await expect(page.getByText('Your wishlist is empty')).toBeVisible();
    await expect(page.getByText('0 Products')).toBeVisible();
    await expect(cardNames(page)).toHaveCount(0);

    await page.getByRole('link', { name: 'Continue Shopping' }).click();
    await expect(page).toHaveURL(/\/shop$/);
  });

  test('is shown again once the last item is removed', async ({ page }) => {
    await saveFromShop(page, 1);
    await openWishlist(page, 1);

    await page.getByRole('button', { name: /^Remove from wishlist: / }).click();

    await expect(page.getByText('Your wishlist is empty')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Continue Shopping' })).toBeVisible();
    expect(await storedWishlist(page)).toEqual([]);
  });
});

test.describe('Wishlist page — saved items', () => {
  test('items saved on the shop appear on the wishlist page, newest first', async ({ page }) => {
    const saved = await saveFromShop(page, 2);
    expect((await storedWishlist(page)).map((i) => i.variantId)).toEqual(
      saved.map((s) => s.variantId)
    );

    await openWishlist(page, 2);
    await expect(cardNames(page)).toHaveText([saved[1].name, saved[0].name]);
    await expect(page.getByText('2 Products')).toBeVisible();

    // Each card shows its heart filled, for the exact variant that was saved
    for (const { name, variantId } of saved) {
      const heart = page.locator(`button[data-wishlist-variant-id="${variantId}"]`);
      await expect(heart).toHaveAttribute('aria-pressed', 'true');
      await expect(heart).toHaveAccessibleName(`Remove from wishlist: ${name}`);
    }

    // Persisted: still there after a refresh
    await page.reload();
    await expect(cardNames(page)).toHaveText([saved[1].name, saved[0].name]);
  });

  test('clicking the heart removes that item from the wishlist page', async ({ page }) => {
    const [first, second] = await saveFromShop(page, 2);
    await openWishlist(page, 2);

    await page.locator(`button[data-wishlist-variant-id="${first.variantId}"]`).click();

    await expect(cardNames(page)).toHaveText([second.name]);
    await expect(page.getByText('1 Product', { exact: true })).toBeVisible();
    expect((await storedWishlist(page)).map((i) => i.variantId)).toEqual([second.variantId]);

    // And it stays removed after a refresh
    await page.reload();
    await expect(cardNames(page)).toHaveText([second.name]);
  });

  test('Add to bag on a wishlisted item puts the saved variant in the cart', async ({ page }) => {
    const [saved] = await saveFromShop(page, 1);
    await openWishlist(page, 1);

    const card = cardOf(page.locator(`button[data-wishlist-variant-id="${saved.variantId}"]`));
    // Located by variant, not by name: the name flips to "Added to bag: …" once clicked.
    const addToBag = card.locator(`button[data-variant-id="${saved.variantId}"]`);
    await expect(addToBag).toBeVisible();
    await expect(addToBag).toHaveAccessibleName(
      new RegExp(`^Add to bag: ${escapeRegExp(saved.name)}, `)
    );

    await addToBag.click();
    await expect(addToBag).toHaveAttribute('data-state', 'added');
    await expect(addToBag).toHaveAccessibleName(/^Added to bag: /);
    await expect(cartButton(page)).toHaveAttribute('aria-label', 'Cart — 1 items');

    const cart = await storedCart(page);
    expect(cart).toHaveLength(1);
    expect(cart[0]).toMatchObject({ variantId: saved.variantId, quantity: 1 });

    // Adding to the bag doesn't take it off the wishlist
    await expect(page).toHaveURL(/\/wishlist$/);
    await expect(cardNames(page)).toHaveText([saved.name]);
    expect(await storedWishlist(page)).toHaveLength(1);
  });
});

test.describe('Navbar wishlist badge', () => {
  test('desktop: count follows saves and removals, hidden at zero', async ({ page, isMobile }) => {
    test.skip(isMobile, 'the navbar wishlist icon is desktop only');

    await page.goto('/shop');
    await expect(wishlistNavButton(page)).toHaveAttribute('aria-label', 'Wishlist — 0 items');
    await expect(wishlistBadge(page)).toHaveCount(0);

    const [first] = await saveFromShop(page, 2);
    await expect(wishlistBadge(page)).toHaveText('2');
    await expect(wishlistNavButton(page)).toHaveAttribute('aria-label', 'Wishlist — 2 items');

    // Same count on another page, after a full navigation
    await openWishlist(page, 2);
    await expect(wishlistBadge(page)).toHaveText('2');

    await page.locator(`button[data-wishlist-variant-id="${first.variantId}"]`).click();
    await expect(wishlistBadge(page)).toHaveText('1');

    await page.getByRole('button', { name: /^Remove from wishlist: / }).click();
    await expect(wishlistBadge(page)).toHaveCount(0);
    await expect(wishlistNavButton(page)).toHaveAttribute('aria-label', 'Wishlist — 0 items');
  });

  test('desktop: caps the badge at 9+', async ({ page, isMobile }) => {
    test.skip(isMobile, 'the navbar wishlist icon is desktop only');

    // The badge counts saved items, so any 10 distinct variants will do here
    const items = Array.from({ length: 10 }, (_, i) => ({
      variantId: `test-variant-${i}`,
      productId: `test-product-${i}`,
      slug: `test-${i}`,
      name: `Test ${i}`,
      colorName: 'Black',
      size: 8,
      image: '/placeholders/shoe.svg',
      unitPrice: 100000,
    }));
    await page.addInitScript(({ key, value }) => window.localStorage.setItem(key, value), {
      key: WISHLIST_KEY,
      value: JSON.stringify({ state: { items }, version: 0 }),
    });

    await page.goto('/shop');
    await expect(wishlistBadge(page)).toHaveText('9+');
    await expect(wishlistNavButton(page)).toHaveAttribute('aria-label', 'Wishlist — 10 items');
  });

  test('mobile: no navbar wishlist icon or badge, but saving still works', async ({
    page,
    isMobile,
  }) => {
    test.skip(!isMobile, 'mobile-only behaviour');

    await saveFromShop(page, 1);
    expect(await storedWishlist(page)).toHaveLength(1);
    // The page has hydrated by now (the heart responded), so the icon really isn't rendered
    await expect(wishlistNavButton(page)).toHaveCount(0);
    await expect(wishlistBadge(page)).toHaveCount(0);

    // The page itself is reachable and shows the item
    await openWishlist(page, 1);
    await expect(wishlistBadge(page)).toHaveCount(0);
  });
});

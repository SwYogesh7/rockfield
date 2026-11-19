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

test.describe('Shop pagination & clear all filters', () => {
  // Regression: the empty-state "Clear All Filters" button used to clear only the category
  // filter, and clearing must also drop the page param so the user lands back on page 1.
  //
  // Stock per size is randomised when the mock module loads, but every product has 6+ variants,
  // so "In Stock Only" keeps all 8 products (2 pages at 4 per page). The test asserts pagination
  // is present rather than assuming it.
  test('empty-state "Clear All Filters" clears every filter and resets to page 1', async ({
    page,
    isMobile,
  }) => {
    const pagination = page.getByRole('navigation', { name: 'pagination' });
    const productNames = page.locator('a[href^="/products/"] h3');
    const emptyState = page.getByText('No products found');
    const inStockCheckbox = page.getByRole('checkbox', { name: 'In Stock Only' });
    const mobileFiltersButton = page.getByRole('button', { name: /^Filters/ });
    const searchParams = () => new URL(page.url()).searchParams;

    // 1. Open the shop and remember the unfiltered first page
    await page.goto('/shop');
    await expect(productNames.first()).toBeVisible();
    const unfilteredPageOne = await productNames.allTextContents();

    // 2. Apply a filter ("In Stock Only") from the sidebar, or from the drawer on mobile.
    //    The drawer trigger is server-rendered, so retry until a click lands after hydration.
    if (isMobile) {
      await expect(async () => {
        await mobileFiltersButton.click();
        await expect(inStockCheckbox).toBeVisible({ timeout: 1_000 });
      }).toPass({ timeout: 15_000 });
    }
    await inStockCheckbox.click();
    await expect.poll(() => searchParams().get('inStockOnly')).toBe('true');
    await expect(inStockCheckbox).toBeChecked();
    if (isMobile) {
      await page.keyboard.press('Escape');
      await expect(inStockCheckbox).toBeHidden();
    }

    // 3. Go to page 2 using the pagination
    await expect(pagination).toBeVisible();
    await pagination.getByRole('link', { name: '2', exact: true }).click();
    await expect.poll(() => searchParams().get('page')).toBe('2');
    await expect(pagination.locator('[aria-current="page"]')).toHaveText('2');
    expect(searchParams().get('inStockOnly')).toBe('true');

    // 4. Apply a filter combination with no results. There are no women's boots in the catalogue.
    //    This is done through the URL because any filter change in the UI already drops the page
    //    param, so this is the only way to reach the empty state while still on page 2 (e.g. a
    //    shared or bookmarked link), which is what checks that Clear All resets the page.
    const emptyUrl = new URL(page.url());
    emptyUrl.searchParams.set('category', 'boots');
    emptyUrl.searchParams.set('gender', 'women');
    await page.goto(emptyUrl.pathname + emptyUrl.search);
    await expect(emptyState).toBeVisible();
    expect(searchParams().get('page')).toBe('2');
    expect(searchParams().get('inStockOnly')).toBe('true');
    expect(searchParams().get('category')).toBe('boots');
    expect(searchParams().get('gender')).toBe('women');

    // 5. Click "Clear All Filters" in the empty state (retry in case the first click lands
    //    before hydration)
    const clearAllButton = page.getByRole('button', { name: 'Clear All Filters' });
    await expect(async () => {
      await clearAllButton.click();
      await expect(emptyState).toBeHidden({ timeout: 2_000 });
    }).toPass({ timeout: 15_000 });

    // 6. Every filter and the page param are gone, and the first unfiltered page is shown
    await expect.poll(() => [...searchParams().keys()]).toEqual([]);
    await expect(page).toHaveURL(/\/shop\??$/);
    await expect(productNames).toHaveText(unfilteredPageOne);
    await expect(pagination.locator('[aria-current="page"]')).toHaveText('1');
    await expect(page.getByRole('button', { name: /^Remove .* filter$/ })).toHaveCount(0);
    if (isMobile) {
      await expect(mobileFiltersButton).toHaveText('Filters');
    } else {
      await expect(inStockCheckbox).not.toBeChecked();
      await expect(page.getByRole('button', { name: 'Clear all' })).toHaveCount(0);
    }
  });
});

test.describe('Category page clear all filters', () => {
  // On /shop/[category] the category comes from the route, not a query param, so clearing only
  // the query string used to leave the user inside the category. The empty-state button must go
  // back to /shop with every filter (including the category) and the page cleared; sort is kept.
  test('empty-state "Clear All Filters" leaves the category page for /shop', async ({ page }) => {
    const emptyState = page.getByText('No products found');

    // There are no women's boots in the catalogue
    await page.goto('/shop/boots?gender=women&page=2&sortBy=price-asc');
    await expect(emptyState).toBeVisible();

    // Retry in case the first click lands before hydration
    const clearAllButton = page.getByRole('button', { name: 'Clear All Filters' });
    await expect(async () => {
      await clearAllButton.click();
      await expect(emptyState).toBeHidden({ timeout: 2_000 });
    }).toPass({ timeout: 15_000 });

    await expect.poll(() => new URL(page.url()).pathname).toBe('/shop');
    expect([...new URL(page.url()).searchParams.entries()]).toEqual([['sortBy', 'price-asc']]);
    await expect(page.locator('h1')).toContainText('All Shoes');
    await expect(page.getByRole('navigation', { name: 'pagination' })).toBeVisible();
    await expect(
      page.getByRole('navigation', { name: 'pagination' }).locator('[aria-current="page"]')
    ).toHaveText('1');
  });
});

test.describe('Price filter chip', () => {
  // The price chip's remove button used to call setFilter twice (minPrice, then maxPrice). Both
  // calls built the URL from the same searchParams snapshot, so the second replace restored
  // minPrice and the chip stayed. Both bounds must be removed in one go; other filters and the
  // sort stay, and the page resets.
  const cases = [
    {
      start: '/shop?inStockOnly=true&minPrice=100000&maxPrice=2000000&sortBy=price-asc&page=2',
      path: '/shop',
      kept: [
        ['inStockOnly', 'true'],
        ['sortBy', 'price-asc'],
      ],
      remainingChip: 'Remove In Stock Only filter',
    },
    {
      start: '/shop/sports?gender=men&minPrice=100000&maxPrice=2000000',
      path: '/shop/sports',
      kept: [['gender', 'men']],
      remainingChip: 'Remove men filter',
    },
  ];

  for (const { start, path, kept, remainingChip } of cases) {
    test(`removing the price chip clears minPrice and maxPrice on ${path}`, async ({ page }) => {
      await page.goto(start);
      const priceChipRemove = page.getByRole('button', { name: /^Remove ₹/ });
      await expect(priceChipRemove).toHaveAccessibleName('Remove ₹1,000 – ₹20,000 filter');

      // Retry in case the first click lands before hydration
      await expect(async () => {
        await priceChipRemove.click();
        await expect
          .poll(() => new URL(page.url()).searchParams.has('maxPrice'), { timeout: 2_000 })
          .toBe(false);
      }).toPass({ timeout: 15_000 });

      const url = new URL(page.url());
      expect(url.pathname).toBe(path);
      expect([...url.searchParams.entries()]).toEqual(kept);
      await expect(page.getByRole('button', { name: /^Remove ₹/ })).toHaveCount(0);
      await expect(page.getByRole('button', { name: remainingChip })).toBeVisible();
      await expect(page.locator('a[href^="/products/"] h3').first()).toBeVisible();
    });
  }
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

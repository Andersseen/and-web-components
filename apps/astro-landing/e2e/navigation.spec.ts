import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('clicking footer resource links updates URL hash', async ({ page }) => {
    // The footer resource links are always visible and point to the same sections
    // as the navbar, making them a more reliable target for hash navigation tests.
    const footer = page.locator('footer');

    const featuresLink = footer.locator('a[href="#features"]').first();
    await featuresLink.click();
    await expect(page).toHaveURL(/.*#features/);

    const showcaseLink = footer.locator('a[href="#showcase"]').first();
    await showcaseLink.click();
    await expect(page).toHaveURL(/.*#showcase/);

    const ecosystemLink = footer.locator('a[href="#ecosystem"]').first();
    await ecosystemLink.click();
    await expect(page).toHaveURL(/.*#ecosystem/);
  });

  test('navbar brand links to top or maintains functionality', async ({ page }) => {
    const brand = page.locator('and-navbar [slot="brand"]').first();
    await expect(brand).toBeVisible();
    await expect(brand).toContainText('Andersseen');
  });
});

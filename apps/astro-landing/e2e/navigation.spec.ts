import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('clicking header links updates URL hash and scrolls to section', async ({ page, isMobile }) => {
    // On mobile viewports, nav links are outside the viewport (behind a mobile menu),
    // so we skip link-click assertions for mobile.
    if (isMobile) {
      test.skip();
      return;
    }

    // Test Features link
    const featuresLink = page.locator('and-navbar').getByText('Features', { exact: true }).first();
    await featuresLink.click();
    await expect(page).toHaveURL(/.*#features/);

    // Test Showcase link
    const showcaseLink = page.locator('and-navbar').getByText('Showcase', { exact: true }).first();
    await showcaseLink.click();
    await expect(page).toHaveURL(/.*#showcase/);

    // Test Ecosystem link
    const ecosystemLink = page.locator('and-navbar').getByText('Ecosystem', { exact: true }).first();
    await ecosystemLink.click();
    await expect(page).toHaveURL(/.*#ecosystem/);

    // Test Home link
    const homeLink = page.locator('and-navbar').getByText('Home', { exact: true }).first();
    await homeLink.click();
    await expect(page).toHaveURL(/.*#hero/);
  });

  test('navbar brand links to top or maintains functionality', async ({ page }) => {
    const brand = page.locator('and-navbar [slot="brand"]').first();
    await expect(brand).toBeVisible();
    await expect(brand).toContainText('Andersseen');
  });
});

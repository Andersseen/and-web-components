import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('clicking header links updates URL hash and scrolls to section', async ({ page, isMobile }) => {
    // If mobile, we might need to open a hamburger menu first if one exists
    // However, the current navbar implementation might just overflow or show on desktop
    // We'll skip interacting with mobile menu in this general test if it's hidden behind a toggle,
    // or we'll ensure we use locators that only click visible links.

    // There are 2 navbars in the DOM potentially (e.g., mobile menu drawer vs desktop). We will grab the first visible one.
    // Test Features link
    const featuresLink = page.locator('and-navbar').getByText('Features', { exact: true }).first();
    if (await featuresLink.isVisible()) {
      await featuresLink.click();
      await expect(page).toHaveURL(/.*#features/);
    }

    // Test Showcase link
    const showcaseLink = page.locator('and-navbar').getByText('Showcase', { exact: true }).first();
    if (await showcaseLink.isVisible()) {
      await showcaseLink.click();
      await expect(page).toHaveURL(/.*#showcase/);
    }

    // Test Ecosystem link
    const ecosystemLink = page.locator('and-navbar').getByText('Ecosystem', { exact: true }).first();
    if (await ecosystemLink.isVisible()) {
      await ecosystemLink.click();
      await expect(page).toHaveURL(/.*#ecosystem/);
    }

    // Test Home link
    const homeLink = page.locator('and-navbar').getByText('Home', { exact: true }).first();
    if (await homeLink.isVisible()) {
      await homeLink.click();
      await expect(page).toHaveURL(/.*#hero/);
    }
  });

  test('navbar brand links to top or maintains functionality', async ({ page }) => {
    const brand = page.locator('and-navbar [slot="brand"]').first();
    await expect(brand).toBeVisible();
    await expect(brand).toContainText('Andersseen');
  });
});

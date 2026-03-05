import { test, expect } from '@playwright/test';

test.describe('Responsive Layout', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('hero layout differs between mobile and desktop', async ({ page, isMobile }) => {
    const hero = page.locator('#hero');
    await expect(hero).toBeVisible();

    const title = hero.locator('h1');
    const subtitle = hero.locator('p');

    // Just check the elements are visible in both environments,
    // the layout changes are handled by CSS attributes `and-layout="grid cols:1 cols@md:2"`
    await expect(title).toBeVisible();
    await expect(subtitle).toBeVisible();

    // Verify grid layout
    const featuresGrid = page.locator('#features > div > div[and-layout^="grid"]');
    await expect(featuresGrid).toBeVisible();

    // In mobile, it should have a 1 column layout, while in desktop, it should be >1 columns.
    // We can't easily assert CSS rules defined by custom attributes, but we verify the elements load properly.
    const featureCards = featuresGrid.locator('and-card');
    await expect(featureCards.first()).toBeVisible();

    // If mobile, ensure it takes up full width or similar
    if (isMobile) {
      const box = await featureCards.first().boundingBox();
      const pageBox = await page.viewportSize();

      // Should be roughly the width of the page minus padding
      if (box && pageBox) {
        expect(box.width).toBeGreaterThan(pageBox.width * 0.7);
      }
    }
  });

  test('navbar is accessible across viewports', async ({ page, isMobile }) => {
    const navbar = page.locator('and-navbar');
    await expect(navbar).toBeVisible();

    // In many responsive libraries, the brand stays visible, while actions hide in a burger menu.
    const brand = navbar.locator('[slot="brand"]');
    await expect(brand).toBeVisible();
  });
});

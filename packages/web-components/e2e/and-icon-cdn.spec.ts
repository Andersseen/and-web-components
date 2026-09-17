import { test, expect } from '@playwright/test';

/**
 * Proves the documented CDN recipe for `<and-icon>` (icon/overview.md,
 * "Using <and-icon> from a CDN") actually works: two <script type="module">
 * tags and no explicit registration/define call. jsDelivr/unpkg would serve
 * the exact same published files this fixture loads from node_modules/dist.
 */
test.describe('and-icon via CDN-style loading (icon/browser + web-components lazy bundle)', () => {
  test('renders a real <svg> with no explicit registration or defineCustomElements() call', async ({ page }) => {
    await page.goto('/e2e/fixtures/and-icon-cdn.html');

    const icon = page.locator('and-icon[name="home"]');
    await expect(icon).toBeVisible();

    const svgCount = await icon.locator('svg').count();
    expect(svgCount).toBe(1);
  });
});

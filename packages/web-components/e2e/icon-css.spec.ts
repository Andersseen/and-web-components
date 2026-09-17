import { test, expect } from '@playwright/test';

/**
 * Proves the CSS-only `and-icon="name"` attribute API
 * (`@andersseen/icon/icons.css`) actually renders in a real browser with
 * zero JavaScript — the fixture page has no <script> tag at all.
 */
test.describe('and-icon CSS-only attribute — real browser, zero JS', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/e2e/fixtures/icon-css.html');
  });

  test('computes a non-empty mask-image on a <span> host', async ({ page }) => {
    const maskImage = await page.locator('#plain').evaluate(el => {
      const style = getComputedStyle(el);
      return style.maskImage || style.webkitMaskImage;
    });

    expect(maskImage).toMatch(/^url\("data:image\/svg\+xml;base64,/);
  });

  test('works identically on <i> and <div> hosts — the API is the attribute, not the element', async ({ page }) => {
    for (const id of ['italic-host', 'div-host']) {
      const maskImage = await page.locator(`#${id}`).evaluate(el => {
        const style = getComputedStyle(el);
        return style.maskImage || style.webkitMaskImage;
      });
      expect(maskImage).toMatch(/^url\("data:image\/svg\+xml;base64,/);
    }
  });

  test('sizes to 1em — tracks font-size', async ({ page }) => {
    const box = await page.locator('#red').boundingBox();
    // font-size: 40px => 1em == 40px, allow for sub-pixel rounding.
    expect(box?.width).toBeGreaterThanOrEqual(38);
    expect(box?.width).toBeLessThanOrEqual(42);
    expect(box?.height).toBeGreaterThanOrEqual(38);
    expect(box?.height).toBeLessThanOrEqual(42);

    const smallBox = await page.locator('#blue').boundingBox();
    expect(smallBox?.width).toBeLessThan(box!.width);
  });

  test('paints via currentColor — background-color resolves the element color', async ({ page }) => {
    const redBg = await page.locator('#red').evaluate(el => getComputedStyle(el).backgroundColor);
    expect(redBg).toBe('rgb(255, 0, 0)');

    const blueBg = await page.locator('#blue').evaluate(el => getComputedStyle(el).backgroundColor);
    expect(blueBg).toBe('rgb(0, 0, 255)');
  });

  test('an unregistered name still gets the base rule but no mask-image', async ({ page }) => {
    const styles = await page.locator('#unregistered').evaluate(el => {
      const style = getComputedStyle(el);
      return { display: style.display, maskImage: style.maskImage || style.webkitMaskImage };
    });

    expect(styles.display).toBe('inline-block');
    expect(styles.maskImage === 'none' || styles.maskImage === '').toBe(true);
  });
});

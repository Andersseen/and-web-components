import { test, expect } from '@playwright/test';

/**
 * Proves the documented runtime lazy loading strategy (icon/overview.md,
 * "Runtime lazy loading"): `initLazyIcons()` loads only the CSS for icons
 * actually present in the DOM, on demand, deduplicated — not the full
 * `icons.css` catalog and not a `base.css` network request (the base rule is
 * injected inline). Structurally identical to the documented CDN recipe: a
 * single `<script type="module">` importing `initLazyIcons` and calling it
 * explicitly, no auto-init on import.
 */
const addIcon = ({ id, name }: { id: string; name: string }): void => {
  const el = document.createElement('span');
  el.id = id;
  el.setAttribute('and-icon', name);
  el.setAttribute('aria-hidden', 'true');
  document.body.appendChild(el);
};

test.describe('and-icon runtime lazy loading (@andersseen/icon/lazy)', () => {
  test('loads the CSS for an icon already in the DOM and computes a real mask', async ({ page }) => {
    const iconRequests: string[] = [];
    page.on('request', request => {
      if (/\/dist\/icons\/[^/]+\.css$/.test(request.url())) {
        iconRequests.push(request.url());
      }
    });

    await page.goto('/e2e/fixtures/and-icon-lazy.html');

    await expect(page.locator('link[data-and-icon="home"]')).toHaveCount(1);
    expect(iconRequests.filter(url => url.endsWith('/home.css'))).toHaveLength(1);

    const homeMask = await page.locator('#home').evaluate(el => {
      const style = getComputedStyle(el);
      return style.maskImage || style.webkitMaskImage;
    });
    expect(homeMask).toMatch(/^url\("data:image\/svg\+xml;base64,/);
  });

  test('does not request the full icons.css catalog or a separate base.css file', async ({ page }) => {
    const requests: string[] = [];
    page.on('request', request => requests.push(request.url()));

    await page.goto('/e2e/fixtures/and-icon-lazy.html');
    await expect(page.locator('link[data-and-icon="home"]')).toHaveCount(1);

    expect(requests.some(url => url.endsWith('/icons.css'))).toBe(false);
    expect(requests.some(url => url.endsWith('/base.css'))).toBe(false);
    await expect(page.locator('style[data-and-icons-base]')).toHaveCount(1);
  });

  test('does not re-fetch or duplicate a <link> for an icon already loaded', async ({ page }) => {
    const homeRequests: string[] = [];
    page.on('request', request => {
      if (request.url().endsWith('/home.css')) {
        homeRequests.push(request.url());
      }
    });

    await page.goto('/e2e/fixtures/and-icon-lazy.html');
    await expect(page.locator('link[data-and-icon="home"]')).toHaveCount(1);

    await page.evaluate(addIcon, { id: 'home-2', name: 'home' });
    await page.locator('#home-2').waitFor();
    await page.waitForTimeout(150); // let the MutationObserver callback settle

    expect(homeRequests).toHaveLength(1);
    await expect(page.locator('link[data-and-icon="home"]')).toHaveCount(1);
  });

  test('loads a second icon’s CSS the first time it appears in the DOM', async ({ page }) => {
    await page.goto('/e2e/fixtures/and-icon-lazy.html');
    await expect(page.locator('link[data-and-icon="home"]')).toHaveCount(1);
    await expect(page.locator('link[data-and-icon="search"]')).toHaveCount(0);

    await page.evaluate(addIcon, { id: 'search-1', name: 'search' });

    await expect(page.locator('link[data-and-icon="search"]')).toHaveCount(1);
    const searchMask = await page.locator('#search-1').evaluate(el => {
      const style = getComputedStyle(el);
      return style.maskImage || style.webkitMaskImage;
    });
    expect(searchMask).toMatch(/^url\("data:image\/svg\+xml;base64,/);
  });
});

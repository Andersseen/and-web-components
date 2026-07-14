import { test, expect } from '@playwright/test';

test.describe('Docs site basics', () => {
  test('homepage has the right title and hero', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle('And Web Components | And Web Components');
    await expect(page.getByRole('heading', { name: 'And Web Components', level: 1 })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Getting Started' })).toBeVisible();
  });

  test('getting started guide is reachable and documents install', async ({ page }) => {
    await page.goto('/guides/getting-started/');
    await expect(page.getByRole('heading', { name: 'Getting Started', level: 1 })).toBeVisible();
    await expect(page.getByText('pnpm add @andersseen/web-components')).toBeVisible();
  });

  // The homepage uses Starlight's `splash` template, which hides the
  // sidebar entirely — start these from a regular doc page instead, where
  // the sidebar (and its Components/Motion groups) is actually rendered.
  test('sidebar navigates to a component page and its live example renders', async ({ page }) => {
    await page.goto('/guides/getting-started/');
    await page.getByRole('link', { name: 'Button', exact: true }).click();
    await expect(page).toHaveURL(/\/components\/button\/?$/);
    await expect(page.locator('and-button', { hasText: 'Default' })).toBeVisible();
  });

  test('motion section is reachable from the sidebar', async ({ page }) => {
    await page.goto('/guides/getting-started/');
    // Scoped to the left nav — the page's own "On this page" TOC also has
    // an "Overview" entry (its first heading anchor), which is otherwise
    // ambiguous with the sidebar link of the same name.
    await page.getByLabel('Main').getByRole('link', { name: 'Overview', exact: true }).click();
    await expect(page).toHaveURL(/\/motion\/overview\/?$/);
    await expect(page.getByRole('heading', { name: 'Motion — Overview', level: 1 })).toBeVisible();
  });
});

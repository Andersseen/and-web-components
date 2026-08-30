import { test, expect } from '@playwright/test';

test.describe('and-tabs — horizontal', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/e2e/fixtures/tabs.html');
  });

  test('renders the default-value tab as selected with a coherent panel relationship', async ({ page }) => {
    const tabs = page.locator('and-tabs#horizontal');
    const accountTab = tabs.getByRole('tab', { name: 'Account' });
    const passwordTab = tabs.getByRole('tab', { name: 'Password' });

    await expect(accountTab).toHaveAttribute('aria-selected', 'true');
    await expect(accountTab).toHaveAttribute('tabindex', '0');
    await expect(passwordTab).toHaveAttribute('aria-selected', 'false');
    await expect(passwordTab).toHaveAttribute('tabindex', '-1');

    const panel = tabs.locator('and-tabs-content[value="tab-1"]');
    await expect(panel).toBeVisible();
    await expect(panel).toHaveText('Account settings panel.');
    await expect(panel).toHaveAttribute('data-state', 'active');
    await expect(tabs.locator('and-tabs-content[value="tab-2"]')).toHaveAttribute('data-state', 'inactive');

    // aria-controls / aria-labelledby form a coherent, resolvable pair.
    const controlsId = await accountTab.getAttribute('aria-controls');
    await expect(panel).toHaveAttribute('id', controlsId!);
    const labelledBy = await panel.getAttribute('aria-labelledby');
    await expect(accountTab).toHaveAttribute('id', labelledBy!);
  });

  test('clicking another tab activates it and swaps the visible panel', async ({ page }) => {
    const tabs = page.locator('and-tabs#horizontal');
    await tabs.getByRole('tab', { name: 'Password' }).click();

    await expect(tabs.getByRole('tab', { name: 'Password' })).toHaveAttribute('aria-selected', 'true');
    await expect(tabs.getByRole('tab', { name: 'Account' })).toHaveAttribute('aria-selected', 'false');
    await expect(tabs.locator('and-tabs-content[value="tab-2"]')).toBeVisible();
    await expect(tabs.locator('and-tabs-content[value="tab-2"]')).toHaveText('Password settings panel.');
  });

  test('emits andTabChange with the newly selected value', async ({ page }) => {
    const tabs = page.locator('and-tabs#horizontal');
    const changes: string[] = [];
    await page.exposeFunction('recordTabChange', (v: string) => changes.push(v));
    await page.evaluate(() => {
      document
        .querySelector('and-tabs#horizontal')
        ?.addEventListener('andTabChange', (e: Event) => (window as any).recordTabChange((e as CustomEvent).detail));
    });

    await tabs.getByRole('tab', { name: 'Password' }).click();
    await expect.poll(() => changes).toEqual(['tab-2']);
  });

  test('ArrowRight moves focus and (automatic mode) activates the next enabled tab, skipping the disabled one', async ({
    page,
  }) => {
    const tabs = page.locator('and-tabs#horizontal');
    await tabs.getByRole('tab', { name: 'Account' }).focus();

    await page.keyboard.press('ArrowRight');
    await expect(tabs.getByRole('tab', { name: 'Password' })).toBeFocused();
    await expect(tabs.getByRole('tab', { name: 'Password' })).toHaveAttribute('aria-selected', 'true');

    // Billing is disabled — ArrowRight from Password must skip straight to Notifications.
    await page.keyboard.press('ArrowRight');
    await expect(tabs.getByRole('tab', { name: 'Notifications' })).toBeFocused();
    await expect(tabs.getByRole('tab', { name: 'Notifications' })).toHaveAttribute('aria-selected', 'true');
  });

  test('ArrowLeft from the first tab wraps to the last enabled tab', async ({ page }) => {
    const tabs = page.locator('and-tabs#horizontal');
    await tabs.getByRole('tab', { name: 'Account' }).focus();

    await page.keyboard.press('ArrowLeft');
    await expect(tabs.getByRole('tab', { name: 'Notifications' })).toBeFocused();
    await expect(tabs.getByRole('tab', { name: 'Notifications' })).toHaveAttribute('aria-selected', 'true');
  });

  test('Home and End jump to the first and last tab', async ({ page }) => {
    const tabs = page.locator('and-tabs#horizontal');
    await tabs.getByRole('tab', { name: 'Password' }).focus();

    await page.keyboard.press('End');
    await expect(tabs.getByRole('tab', { name: 'Notifications' })).toBeFocused();

    await page.keyboard.press('Home');
    await expect(tabs.getByRole('tab', { name: 'Account' })).toBeFocused();
  });

  test('the disabled tab cannot be activated by click and is excluded from the tab order', async ({ page }) => {
    const tabs = page.locator('and-tabs#horizontal');
    const billing = tabs.getByRole('tab', { name: 'Billing' });

    await expect(billing).toHaveAttribute('aria-disabled', 'true');
    await billing.click({ force: true });

    await expect(billing).toHaveAttribute('aria-selected', 'false');
    await expect(tabs.getByRole('tab', { name: 'Account' })).toHaveAttribute('aria-selected', 'true');
  });
});

test.describe('and-tabs — vertical orientation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/e2e/fixtures/tabs.html');
  });

  test('list reports vertical orientation and uses ArrowDown/ArrowUp instead of Left/Right', async ({ page }) => {
    const tabs = page.locator('and-tabs#vertical');
    await expect(tabs.getByRole('tablist')).toHaveAttribute('aria-orientation', 'vertical');

    await tabs.getByRole('tab', { name: 'First' }).focus();
    await page.keyboard.press('ArrowDown');
    await expect(tabs.getByRole('tab', { name: 'Second' })).toBeFocused();
    await expect(tabs.getByRole('tab', { name: 'Second' })).toHaveAttribute('aria-selected', 'true');

    await page.keyboard.press('ArrowUp');
    await expect(tabs.getByRole('tab', { name: 'First' })).toBeFocused();
  });
});

import { test, expect } from '@playwright/test';

test.describe('and-drawer — focus trap, naming, page side effects', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/e2e/fixtures/drawer.html');
  });

  test('opens and focuses the first focusable element (the header close button, which precedes the body slot in DOM order)', async ({
    page,
  }) => {
    await page.getByRole('button', { name: 'Open settings drawer' }).click();

    await expect(page.locator('and-drawer#labeled-drawer').getByRole('button', { name: 'Close' })).toBeFocused();
  });

  test('resolves its accessible name from the label prop', async ({ page }) => {
    await page.getByRole('button', { name: 'Open settings drawer' }).click();

    await expect(page.getByRole('dialog', { name: 'Settings' })).toBeVisible();
  });

  test('Tab from the last focusable element (Save) loops to the first (Close), including slotted content in between', async ({
    page,
  }) => {
    await page.getByRole('button', { name: 'Open settings drawer' }).click();

    const saveButton = page.locator('and-drawer#labeled-drawer').getByRole('button', { name: 'Save' });
    await saveButton.focus();

    await page.keyboard.press('Tab');
    await expect(page.locator('and-drawer#labeled-drawer').getByRole('button', { name: 'Close' })).toBeFocused();
  });

  test('Shift+Tab from the first focusable element (Close) loops to the last (Save)', async ({ page }) => {
    await page.getByRole('button', { name: 'Open settings drawer' }).click();
    await expect(page.locator('and-drawer#labeled-drawer').getByRole('button', { name: 'Close' })).toBeFocused();

    await page.keyboard.press('Shift+Tab');
    await expect(page.locator('and-drawer#labeled-drawer').getByRole('button', { name: 'Save' })).toBeFocused();
  });

  test('Tab from Close reaches the slotted name input next (DOM order within the trap)', async ({ page }) => {
    await page.getByRole('button', { name: 'Open settings drawer' }).click();
    await expect(page.locator('and-drawer#labeled-drawer').getByRole('button', { name: 'Close' })).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(page.locator('#name-input')).toBeFocused();
  });

  test('Escape closes and returns focus to the trigger', async ({ page }) => {
    const trigger = page.getByRole('button', { name: 'Open settings drawer' });
    // Keyboard-activate, not click: WebKit does not focus a clicked
    // <button> by default, so a click-opened trigger was never actually
    // focused to begin with there (same rationale as modal-a11y.spec.ts).
    await trigger.focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('and-drawer#labeled-drawer').getByRole('button', { name: 'Close' })).toBeFocused();

    await page.keyboard.press('Escape');

    await expect(page.getByRole('dialog')).toHaveCount(0);
    await expect(trigger).toBeFocused();
  });

  test('clicking the close button closes and emits andDrawerClose', async ({ page }) => {
    await page.getByRole('button', { name: 'Open settings drawer' }).click();

    const closeSpy: boolean[] = [];
    await page.exposeFunction('recordDrawerClose', () => closeSpy.push(true));
    await page.evaluate(() => {
      document
        .querySelector('and-drawer#labeled-drawer')
        ?.addEventListener('andDrawerClose', () => (window as any).recordDrawerClose());
    });

    await page.locator('and-drawer#labeled-drawer').getByRole('button', { name: 'Close' }).click();

    await expect(page.getByRole('dialog')).toHaveCount(0);
    await expect.poll(() => closeSpy).toEqual([true]);
  });

  test('clicking the overlay closes the drawer', async ({ page }) => {
    await page.getByRole('button', { name: 'Open settings drawer' }).click();
    await expect(page.getByRole('dialog')).toBeVisible();

    // Click far from the panel (which is anchored right) to hit the overlay.
    await page.mouse.click(5, 5);
    await expect(page.getByRole('dialog')).toHaveCount(0);
  });

  test('locks body scroll and makes the background inert while open', async ({ page }) => {
    const otherTrigger = page.getByRole('button', { name: 'Open unlabeled drawer' });

    await expect(otherTrigger).not.toHaveAttribute('inert', '');
    await expect(page.locator('body')).not.toHaveCSS('overflow', 'hidden');

    await page.getByRole('button', { name: 'Open settings drawer' }).click();

    await expect(otherTrigger).toHaveAttribute('inert', '');
    await expect(page.locator('body')).toHaveCSS('overflow', 'hidden');

    await page.keyboard.press('Escape');

    await expect(otherTrigger).not.toHaveAttribute('inert', '');
    await expect(page.locator('body')).not.toHaveCSS('overflow', 'hidden');
  });

  test('a drawer with no label prop gets no invented accessible name', async ({ page }) => {
    await page.getByRole('button', { name: 'Open unlabeled drawer' }).click();

    const dialog = page.locator('and-drawer#unlabeled-drawer').locator('[role="dialog"]');
    await expect(dialog).toBeVisible();
    await expect(dialog).not.toHaveAttribute('aria-label');
  });
});

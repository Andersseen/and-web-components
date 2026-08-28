import { test, expect } from '@playwright/test';

test.describe('and-modal — focus trap, naming, page side effects', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/e2e/fixtures/modal-a11y.html');
  });

  test('opens and focuses the first focusable slotted element', async ({ page }) => {
    await page.getByRole('button', { name: 'Open labeled modal' }).click();

    await expect(page.locator('#confirm-input')).toBeFocused();
  });

  test('resolves its accessible name from the slotted heading', async ({ page }) => {
    await page.getByRole('button', { name: 'Open labeled modal' }).click();

    await expect(page.getByRole('dialog', { name: 'Delete account' })).toBeVisible();
  });

  test('Tab from the last focusable element loops to the first, including slotted content', async ({ page }) => {
    await page.getByRole('button', { name: 'Open labeled modal' }).click();

    const closeButton = page.locator('and-modal#labeled-modal').getByRole('button', { name: 'Close' });
    await closeButton.focus();

    await page.keyboard.press('Tab');
    await expect(page.locator('#confirm-input')).toBeFocused();
  });

  test('Shift+Tab from the first focusable element loops to the last', async ({ page }) => {
    await page.getByRole('button', { name: 'Open labeled modal' }).click();
    await expect(page.locator('#confirm-input')).toBeFocused();

    await page.keyboard.press('Shift+Tab');
    await expect(page.locator('and-modal#labeled-modal').getByRole('button', { name: 'Close' })).toBeFocused();
  });

  test('Escape closes and returns focus to the trigger', async ({ page }) => {
    const trigger = page.getByRole('button', { name: 'Open labeled modal' });
    // Open via keyboard (focus + Enter), not a raw click: WebKit does not
    // focus <button> elements on mouse click by default (real Safari
    // behavior, "Full Keyboard Access" off), so a click-opened trigger was
    // never actually focused to begin with there and "returns focus" would
    // be untestable. Keyboard activation always focuses first regardless of
    // that setting, and keyboard users are the ones this requirement is for.
    await trigger.focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('#confirm-input')).toBeFocused();

    await page.keyboard.press('Escape');

    await expect(page.getByRole('dialog')).toHaveCount(0);
    await expect(trigger).toBeFocused();
  });

  test('locks body scroll and makes the background inert while open', async ({ page }) => {
    const otherTrigger = page.getByRole('button', { name: 'Open unlabeled modal' });

    await expect(otherTrigger).not.toHaveAttribute('inert', '');
    await expect(page.locator('body')).not.toHaveCSS('overflow', 'hidden');

    await page.getByRole('button', { name: 'Open labeled modal' }).click();

    await expect(otherTrigger).toHaveAttribute('inert', '');
    await expect(page.locator('body')).toHaveCSS('overflow', 'hidden');

    await page.keyboard.press('Escape');

    await expect(otherTrigger).not.toHaveAttribute('inert', '');
    await expect(page.locator('body')).not.toHaveCSS('overflow', 'hidden');
  });

  test('an unlabeled modal (no label prop, no heading) gets no invented accessible name', async ({ page }) => {
    await page.getByRole('button', { name: 'Open unlabeled modal' }).click();

    const dialog = page.locator('and-modal#unlabeled-modal').locator('[role="dialog"]');
    await expect(dialog).toBeVisible();
    await expect(dialog).not.toHaveAttribute('aria-label');
    await expect(dialog).not.toHaveAttribute('aria-labelledby');
  });
});

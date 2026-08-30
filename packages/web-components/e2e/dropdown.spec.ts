import { test, expect } from '@playwright/test';

test.describe('and-dropdown — trigger/menu contract', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/e2e/fixtures/dropdown.html');
  });

  test('trigger exposes aria-haspopup and starts closed', async ({ page }) => {
    const trigger = page.locator('and-dropdown#basic').getByRole('button', { name: 'Options' });
    await expect(trigger).toHaveAttribute('aria-haspopup', 'menu');
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  test('pointer click opens the menu and flips aria-expanded', async ({ page }) => {
    const trigger = page.locator('and-dropdown#basic').getByRole('button', { name: 'Options' });
    await trigger.click();

    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await expect(page.locator('and-dropdown#basic').getByRole('menu')).toBeVisible();
  });

  test('clicking the trigger again closes the menu', async ({ page }) => {
    const trigger = page.locator('and-dropdown#basic').getByRole('button', { name: 'Options' });
    await trigger.click();
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');

    await trigger.click();
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  test('keyboard: ArrowDown on the trigger opens the menu and focuses the first item', async ({ page }) => {
    const trigger = page.locator('and-dropdown#basic').getByRole('button', { name: 'Options' });
    await trigger.focus();
    await page.keyboard.press('ArrowDown');

    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await expect(page.getByRole('menuitem', { name: 'Edit' })).toBeFocused();
  });

  test('keyboard: ArrowDown/ArrowUp cycle focus between enabled items, skipping disabled ones', async ({ page }) => {
    const trigger = page.locator('and-dropdown#basic').getByRole('button', { name: 'Options' });
    await trigger.focus();
    await page.keyboard.press('ArrowDown');
    await expect(page.getByRole('menuitem', { name: 'Edit' })).toBeFocused();

    await page.keyboard.press('ArrowDown');
    await expect(page.getByRole('menuitem', { name: 'Duplicate' })).toBeFocused();

    // Delete is disabled — ArrowDown from the last enabled item wraps back to the first.
    await page.keyboard.press('ArrowDown');
    await expect(page.getByRole('menuitem', { name: 'Edit' })).toBeFocused();

    await page.keyboard.press('ArrowUp');
    await expect(page.getByRole('menuitem', { name: 'Duplicate' })).toBeFocused();
  });

  test('Escape closes the menu', async ({ page }) => {
    const trigger = page.locator('and-dropdown#basic').getByRole('button', { name: 'Options' });
    await trigger.focus();
    await page.keyboard.press('ArrowDown');
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');

    await page.keyboard.press('Escape');
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  test('clicking an enabled item selects it, closes the menu, and emits andDropdownSelect', async ({ page }) => {
    const trigger = page.locator('and-dropdown#basic').getByRole('button', { name: 'Options' });
    await trigger.click();
    await page.getByRole('menuitem', { name: 'Edit' }).click();

    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect(page.locator('#basic-log')).toHaveText('selected:edit');
  });

  test('disabled items cannot be activated by click', async ({ page }) => {
    const trigger = page.locator('and-dropdown#basic').getByRole('button', { name: 'Options' });
    await trigger.click();

    const disabledItem = page.getByRole('menuitem', { name: 'Delete' });
    await expect(disabledItem).toHaveAttribute('tabindex', '-1');
    await disabledItem.click({ force: true });

    // No selection happened: menu is still open and no log was written.
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await expect(page.locator('#basic-log')).toHaveText('');
  });

  test('outside click dismisses the open menu', async ({ page }) => {
    const trigger = page.locator('and-dropdown#basic').getByRole('button', { name: 'Options' });
    await trigger.click();
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');

    await page.locator('body').click({ position: { x: 5, y: 5 } });
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  test('opening one dropdown does not affect a sibling dropdown', async ({ page }) => {
    const trigger = page.locator('and-dropdown#basic').getByRole('button', { name: 'Options' });
    const secondTrigger = page.locator('and-dropdown#second').getByRole('button', { name: 'Second' });

    await trigger.click();
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await expect(secondTrigger).toHaveAttribute('aria-expanded', 'false');

    // Opening the second dropdown closes the first via the window-click outside handler.
    await secondTrigger.click();
    await expect(secondTrigger).toHaveAttribute('aria-expanded', 'true');
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });
});

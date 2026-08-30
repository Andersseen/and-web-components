import { test, expect } from '@playwright/test';

test.describe('and-menu-list — data-driven, keyboard-navigable', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/e2e/fixtures/menu.html');
  });

  test('renders items with the configured accessible label', async ({ page }) => {
    const menu = page.getByRole('menu', { name: 'File actions' });
    await expect(menu).toBeVisible();
    await expect(menu.getByRole('menuitem')).toHaveCount(3);
  });

  test('ArrowDown/ArrowUp move focus between enabled items, skipping the disabled one', async ({ page }) => {
    const menu = page.getByRole('menu', { name: 'File actions' });
    await menu.getByRole('menuitem', { name: 'Open' }).focus();

    await page.keyboard.press('ArrowDown');
    await expect(menu.getByRole('menuitem', { name: 'Rename' })).toBeFocused();

    // Delete is disabled — ArrowDown wraps back to Open instead of landing on it.
    await page.keyboard.press('ArrowDown');
    await expect(menu.getByRole('menuitem', { name: 'Open' })).toBeFocused();

    await page.keyboard.press('ArrowUp');
    await expect(menu.getByRole('menuitem', { name: 'Rename' })).toBeFocused();
  });

  test('Home and End jump to the first and last enabled item', async ({ page }) => {
    const menu = page.getByRole('menu', { name: 'File actions' });
    await menu.getByRole('menuitem', { name: 'Rename' }).focus();

    await page.keyboard.press('End');
    await expect(menu.getByRole('menuitem', { name: 'Rename' })).toBeFocused();

    await page.keyboard.press('Home');
    await expect(menu.getByRole('menuitem', { name: 'Open' })).toBeFocused();
  });

  test('clicking an enabled item selects it and emits andMenuItemSelect', async ({ page }) => {
    const menu = page.getByRole('menu', { name: 'File actions' });
    await menu.getByRole('menuitem', { name: 'Open' }).click();

    await expect(page.locator('#menu-log')).toHaveText('selected:open');
  });

  test('the disabled item exposes aria-disabled and cannot be selected by click', async ({ page }) => {
    const menu = page.getByRole('menu', { name: 'File actions' });
    const deleteItem = menu.getByRole('menuitem', { name: 'Delete' });

    await expect(deleteItem).toHaveAttribute('aria-disabled', 'true');
    await deleteItem.click({ force: true });

    await expect(page.locator('#menu-log')).toHaveText('');
  });
});

test.describe('and-context-menu — right-click activation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/e2e/fixtures/menu.html');
  });

  test('right-click on the trigger opens the panel with items', async ({ page }) => {
    const trigger = page.getByText('Right-click inside this box');
    await trigger.click({ button: 'right' });

    const panel = page.getByRole('menu', { name: 'Row actions' });
    await expect(panel).toBeVisible();
    await expect(panel.getByRole('menuitem')).toHaveCount(3);
  });

  test('outside click dismisses the open panel', async ({ page }) => {
    const trigger = page.getByText('Right-click inside this box');
    await trigger.click({ button: 'right' });
    await expect(page.getByRole('menu', { name: 'Row actions' })).toBeVisible();

    await page.locator('body').click({ position: { x: 5, y: 5 } });
    await expect(page.getByRole('menu', { name: 'Row actions' })).toBeHidden();
  });

  test('Escape dismisses the open panel', async ({ page }) => {
    const trigger = page.getByText('Right-click inside this box');
    await trigger.click({ button: 'right' });
    await expect(page.getByRole('menu', { name: 'Row actions' })).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(page.getByRole('menu', { name: 'Row actions' })).toBeHidden();
  });

  test('keyboard: ArrowDown navigates, Enter selects, closes the panel, and emits andContextMenuSelect', async ({
    page,
  }) => {
    const trigger = page.getByText('Right-click inside this box');
    await trigger.click({ button: 'right' });

    const panel = page.getByRole('menu', { name: 'Row actions' });
    await expect(panel.getByRole('menuitem', { name: 'Copy' })).toBeFocused();

    await page.keyboard.press('ArrowDown');
    await expect(panel.getByRole('menuitem', { name: 'Paste' })).toBeFocused();
    await page.keyboard.press('Enter');

    await expect(panel).toBeHidden();
    await expect(page.locator('#ctx-log')).toHaveText('selected:paste');
  });

  test('disabled items cannot be selected', async ({ page }) => {
    const trigger = page.getByText('Right-click inside this box');
    await trigger.click({ button: 'right' });

    const panel = page.getByRole('menu', { name: 'Row actions' });
    const deleteItem = panel.getByRole('menuitem', { name: 'Delete' });
    await expect(deleteItem).toHaveAttribute('aria-disabled', 'true');

    await deleteItem.click({ force: true });
    await expect(panel).toBeVisible();
    await expect(page.locator('#ctx-log')).toHaveText('');
  });
});

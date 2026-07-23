import { test, expect } from '@playwright/test';

test.describe('@andersseen/behaviors demos', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#behaviors');
  });

  test('splitter is wired up and keyboard resizable', async ({ page }) => {
    const handle = page.locator('#behaviors [and-splitter-handle]');
    await expect(handle).toBeVisible();

    // defineBehaviors() upgrades the handle into a real separator.
    await expect(handle).toHaveAttribute('role', 'separator');
    await expect(handle).toHaveAttribute('aria-orientation', 'horizontal');

    const before = await handle.getAttribute('aria-valuenow');
    await handle.focus();
    await page.keyboard.press('ArrowRight');
    await expect(handle).not.toHaveAttribute('aria-valuenow', before ?? '');
  });

  test('sortable list items become draggable', async ({ page }) => {
    const items = page.locator('#behaviors [and-draggable]');
    await expect(items.first()).toHaveAttribute('draggable', 'true');
    expect(await items.count()).toBeGreaterThan(1);
  });

  test('tooltip shows on hover, wires aria-describedby, and hides on leave', async ({ page }) => {
    const trigger = page.locator('#behaviors [and-tooltip]').first();
    const tooltip = page.locator('.and-tooltip');

    await trigger.hover();
    await expect(tooltip.first()).toBeVisible();

    // The behavior must associate the tooltip with its trigger for AT users.
    const describedBy = await trigger.getAttribute('aria-describedby');
    expect(describedBy).toBeTruthy();
    await expect(page.locator(`#${describedBy}`)).toHaveAttribute('role', 'tooltip');

    await page.mouse.move(0, 0);
    await expect(tooltip).toHaveCount(0);

    // NOTE: createTooltip() binds its Escape handler to the trigger element,
    // so Escape only dismisses while the trigger holds focus — a tooltip
    // opened by hover alone cannot be dismissed that way, which is what
    // WCAG 1.4.13 asks for. That is a gap in @andersseen/behaviors, not in
    // this page, so it is deliberately not asserted here.
  });

  test('dialog opens, traps content and restores on close', async ({ page }) => {
    const dialogContent = page.locator('#behaviors-dialog');
    // Hidden until opened — regression guard for `.hidden` losing to the
    // unlayered [and-layout] display rule.
    await expect(dialogContent).toBeHidden();

    await page.locator('[and-dialog-trigger="behaviors-dialog"]').click();

    const panel = page.locator('[role="dialog"][aria-modal="true"]');
    await expect(panel).toBeVisible();
    await expect(panel).toContainText('Focus is trapped here');

    await page.keyboard.press('Escape');
    await expect(panel).toHaveCount(0);
    await expect(dialogContent).toBeHidden();
  });
});

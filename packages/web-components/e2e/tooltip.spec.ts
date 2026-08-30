import { test, expect } from '@playwright/test';

test.describe('and-tooltip — pointer and keyboard accessibility paths', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/e2e/fixtures/tooltip.html');
  });

  test('is hidden by default', async ({ page }) => {
    const tooltip = page.locator('and-tooltip#basic').locator('[role="tooltip"]');
    await expect(tooltip).toHaveAttribute('data-state', 'closed');
    await expect(tooltip).toHaveAttribute('hidden', '');
  });

  test('hovering the trigger shows the tooltip; moving away hides it', async ({ page }) => {
    const trigger = page.getByRole('button', { name: 'Hover or focus me' });
    const tooltip = page.locator('and-tooltip#basic').locator('[role="tooltip"]');

    await trigger.hover();
    await expect(tooltip).toHaveAttribute('data-state', 'open');
    await expect(tooltip).toBeVisible();
    await expect(tooltip).not.toHaveAttribute('hidden', '');

    // Move the pointer well away from the trigger and its tooltip.
    await page.locator('body').hover({ position: { x: 5, y: 5 } });
    await expect(tooltip).toHaveAttribute('data-state', 'closed');
  });

  test('keyboard focus shows the tooltip; blurring hides it', async ({ page }) => {
    const trigger = page.getByRole('button', { name: 'Hover or focus me' });
    const tooltip = page.locator('and-tooltip#basic').locator('[role="tooltip"]');

    await trigger.focus();
    await expect(tooltip).toHaveAttribute('data-state', 'open');

    await page.keyboard.press('Tab');
    await expect(tooltip).toHaveAttribute('data-state', 'closed');
  });

  test('aria-describedby on the host tracks the tooltip id only while visible', async ({ page }) => {
    const host = page.locator('and-tooltip#basic');
    const trigger = page.getByRole('button', { name: 'Hover or focus me' });
    const tooltip = host.locator('[role="tooltip"]');

    await expect(host).toHaveAttribute('aria-describedby', '');

    await trigger.focus();
    const tooltipId = await tooltip.getAttribute('id');
    await expect(host).toHaveAttribute('aria-describedby', tooltipId!);
  });

  test('removing the trigger element leaves no visible orphaned tooltip on the page', async ({ page }) => {
    const removableTrigger = page.getByRole('button', { name: 'Removable trigger' });
    await removableTrigger.focus();
    await expect(page.locator('and-tooltip#removable').locator('[role="tooltip"]')).toHaveAttribute(
      'data-state',
      'open',
    );

    await page.evaluate(() => document.getElementById('removable-host')?.remove());

    await expect(page.locator('and-tooltip#removable')).toHaveCount(0);
    // No stray open tooltip left anywhere on the page (the closed #basic
    // tooltip's [role="tooltip"] element still exists in the DOM, just
    // hidden — scope this to open ones so that doesn't false-positive).
    await expect(page.locator('[role="tooltip"][data-state="open"]')).toHaveCount(0);
  });
});

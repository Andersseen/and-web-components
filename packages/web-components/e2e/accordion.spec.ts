import { test, expect } from '@playwright/test';

test.describe('and-accordion — single expansion (default)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/e2e/fixtures/accordion.html');
  });

  test('all items start collapsed', async ({ page }) => {
    const accordion = page.locator('and-accordion#single');
    const trigger1 = accordion.getByRole('button', { name: 'Section one' });

    await expect(trigger1).toHaveAttribute('aria-expanded', 'false');
    await expect(accordion.locator('and-accordion-item[value="item-1"] and-accordion-content')).toHaveAttribute(
      'hidden',
      '',
    );
  });

  test('clicking a trigger expands it and reveals its associated content', async ({ page }) => {
    const accordion = page.locator('and-accordion#single');
    const trigger1 = accordion.getByRole('button', { name: 'Section one' });

    await trigger1.click();
    await expect(trigger1).toHaveAttribute('aria-expanded', 'true');

    const content1 = accordion.locator('and-accordion-item[value="item-1"] and-accordion-content');
    await expect(content1).toBeVisible();
    await expect(content1).not.toHaveAttribute('hidden', '');
    // No aria-controls here by design: the trigger and content render in
    // separate shadow trees (and-accordion-trigger / and-accordion-content
    // are sibling shadow-DOM components), so an ID reference between them
    // could never resolve — same root cause already fixed on <and-modal>'s
    // aria-labelledby. aria-expanded plus DOM adjacency convey the
    // relationship instead. Verified this is really absent, not just unset:
    await expect(trigger1).not.toHaveAttribute('aria-controls');
  });

  test('opening a second item collapses the first (single-expansion mode)', async ({ page }) => {
    const accordion = page.locator('and-accordion#single');
    const trigger1 = accordion.getByRole('button', { name: 'Section one' });
    const trigger2 = accordion.getByRole('button', { name: 'Section two' });

    await trigger1.click();
    await expect(trigger1).toHaveAttribute('aria-expanded', 'true');

    await trigger2.click();
    await expect(trigger2).toHaveAttribute('aria-expanded', 'true');
    await expect(trigger1).toHaveAttribute('aria-expanded', 'false');
  });

  test('keyboard: Enter and Space toggle the focused trigger', async ({ page }) => {
    const accordion = page.locator('and-accordion#single');
    const trigger1 = accordion.getByRole('button', { name: 'Section one' });

    await trigger1.focus();
    await page.keyboard.press('Enter');
    await expect(trigger1).toHaveAttribute('aria-expanded', 'true');

    await page.keyboard.press('Space');
    await expect(trigger1).toHaveAttribute('aria-expanded', 'false');
  });

  test('a disabled item cannot be focused or expanded', async ({ page }) => {
    const accordion = page.locator('and-accordion#single');
    const trigger3 = accordion.getByRole('button', { name: 'Section three (disabled)' });

    await expect(trigger3).toBeDisabled();
    await expect(accordion.locator('and-accordion-item[value="item-3"]')).toHaveAttribute('data-disabled', '');

    // A real native <button disabled> refuses focus and click entirely.
    await trigger3.click({ force: true }).catch(() => {});
    await expect(trigger3).toHaveAttribute('aria-expanded', 'false');
  });
});

test.describe('and-accordion — allow-multiple', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/e2e/fixtures/accordion.html');
  });

  test('multiple items can be expanded at the same time', async ({ page }) => {
    const accordion = page.locator('and-accordion#multi');
    const alpha = accordion.getByRole('button', { name: 'Alpha' });
    const beta = accordion.getByRole('button', { name: 'Beta' });

    await alpha.click();
    await expect(alpha).toHaveAttribute('aria-expanded', 'true');

    await beta.click();
    await expect(beta).toHaveAttribute('aria-expanded', 'true');
    // Opening Beta must NOT have collapsed Alpha, unlike single-expansion mode.
    await expect(alpha).toHaveAttribute('aria-expanded', 'true');
  });

  test('clicking an expanded trigger collapses just that item', async ({ page }) => {
    const accordion = page.locator('and-accordion#multi');
    const alpha = accordion.getByRole('button', { name: 'Alpha' });
    const beta = accordion.getByRole('button', { name: 'Beta' });

    await alpha.click();
    await beta.click();
    await alpha.click();

    await expect(alpha).toHaveAttribute('aria-expanded', 'false');
    await expect(beta).toHaveAttribute('aria-expanded', 'true');
  });
});

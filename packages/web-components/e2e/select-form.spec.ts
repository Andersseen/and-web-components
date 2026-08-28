import { test, expect, type Locator } from '@playwright/test';

/**
 * and-select's visible trigger `<button role="combobox">` and its visually
 * hidden mirror `<select>` (added for real `required` constraint validation)
 * both compute to ARIA role "combobox" with the same accessible name in
 * Chromium — `getByRole('combobox', { name })` matches both and Playwright's
 * strict mode then refuses to act. Target the real trigger unambiguously.
 */
function trigger(form: Locator, label: string): Locator {
  return form.locator(`button[role="combobox"][aria-label="${label}"]`);
}

/**
 * The mirror `<select>`'s native `<option>` elements also compute an ARIA
 * role of "option" with the same text as the visible custom listbox's
 * buttons, and `getByRole('option', ...)` at the page level matches across
 * every form on the fixture — scope to this form's real listbox.
 */
function option(form: Locator, name: string): Locator {
  return form.getByRole('listbox').getByRole('option', { name, exact: true });
}

test.describe('and-select — real form participation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/e2e/fixtures/select-form.html');
  });

  test('required blocks submission and fires native validation when nothing is selected', async ({ page }) => {
    const form = page.locator('#form-required');
    await form.getByRole('button', { name: 'Submit' }).click();

    // Blocked: no FormData was ever read, so the result <pre> stays empty.
    await expect(form.locator('.result')).toHaveText('');

    // The browser actually ran constraint validation against our mirror <select>.
    await expect(page.locator('#invalid-log')).toContainText('Country (required)');
  });

  test('selecting a value allows submission and the correct value reaches FormData', async ({ page }) => {
    const form = page.locator('#form-required');

    await trigger(form, 'Country (required)').click();
    await option(form, 'Canada').click();
    await form.getByRole('button', { name: 'Submit' }).click();

    await expect(form.locator('.result')).toHaveText(JSON.stringify({ country: 'ca' }));
  });

  test('submits the current value via FormData', async ({ page }) => {
    const form = page.locator('#form-value');
    await form.getByRole('button', { name: 'Submit' }).click();

    await expect(form.locator('.result')).toHaveText(JSON.stringify({ country: 'us' }));
  });

  test('disabled (direct prop) excludes the field from FormData', async ({ page }) => {
    const form = page.locator('#form-disabled');

    await expect(trigger(form, 'Country (disabled)')).toBeDisabled();
    await form.getByRole('button', { name: 'Submit' }).click();

    await expect(form.locator('.result')).toHaveText('{}');
  });

  test('<fieldset disabled> excludes the field from FormData via native inheritance', async ({ page }) => {
    const form = page.locator('#form-fieldset-disabled');

    await expect(trigger(form, 'Country (fieldset disabled)')).toBeDisabled();
    await form.getByRole('button', { name: 'Submit' }).click();

    await expect(form.locator('.result')).toHaveText('{}');
  });

  test('form.reset() restores the default selection', async ({ page }) => {
    const form = page.locator('#form-value');
    const select = trigger(form, 'Country');

    await select.click();
    await option(form, 'Mexico').click();
    await expect(select).toContainText('Mexico');

    await form.getByRole('button', { name: 'Reset' }).click();

    await expect(select).toContainText('United States');
    await form.getByRole('button', { name: 'Submit' }).click();
    await expect(form.locator('.result')).toHaveText(JSON.stringify({ country: 'us' }));
  });

  test('keyboard: Enter opens, ArrowDown navigates, Enter selects, Escape closes', async ({ page }) => {
    const form = page.locator('#form-value');
    const select = trigger(form, 'Country');

    await select.focus();
    await page.keyboard.press('Enter');
    await expect(select).toHaveAttribute('aria-expanded', 'true');

    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');

    await expect(select).toHaveAttribute('aria-expanded', 'false');
    await expect(select).toContainText('Mexico');

    await select.focus();
    await page.keyboard.press('Enter');
    await expect(select).toHaveAttribute('aria-expanded', 'true');
    await page.keyboard.press('Escape');
    await expect(select).toHaveAttribute('aria-expanded', 'false');
    await expect(select).toBeFocused();
  });

  test('outside click closes the menu', async ({ page }) => {
    const form = page.locator('#form-value');
    const select = trigger(form, 'Country');

    await select.click();
    await expect(select).toHaveAttribute('aria-expanded', 'true');

    await page.locator('body').click({ position: { x: 5, y: 5 } });
    await expect(select).toHaveAttribute('aria-expanded', 'false');
  });
});

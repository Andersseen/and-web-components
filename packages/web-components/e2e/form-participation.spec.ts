import { test, expect } from '@playwright/test';

test.describe('and-input / and-switch / and-button — real form participation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/e2e/fixtures/form-participation.html');
  });

  test('and-button type="submit" submits through its shadow DOM with correct FormData', async ({ page }) => {
    const form = page.locator('#form-basic');
    await form.getByRole('button', { name: 'Submit' }).click();

    const result = JSON.parse((await form.locator('.result').textContent()) ?? '{}');
    expect(result.email).toBe('a@b.com');
    expect(result.subscribe).toBe('on');
  });

  test('and-switch: Space toggles when focused, and disabled state is keyboard-inert', async ({ page }) => {
    const switchControl = page.getByRole('switch', { name: 'Subscribe', exact: true });
    await expect(switchControl).toBeChecked();

    await switchControl.focus();
    await page.keyboard.press('Space');
    await expect(switchControl).not.toBeChecked();
  });

  test('and-button type="reset" restores and-input and and-switch to their original defaults', async ({ page }) => {
    const form = page.locator('#form-basic');
    const emailInput = form.getByRole('textbox', { name: 'Email' });
    const switchControl = page.getByRole('switch', { name: 'Subscribe', exact: true });

    await emailInput.fill('changed@example.com');
    // The real <input> is visually hidden (sr-only) under the visible
    // track/thumb <span>s inside its wrapping <label> — exactly the native
    // "click the label to toggle the hidden checkbox" pattern. Click the
    // label (what a real mouse user would actually click), not the
    // precise, visually-obscured input coordinates.
    await page.locator('label').filter({ has: switchControl }).click();
    await expect(switchControl).not.toBeChecked();

    await form.getByRole('button', { name: 'Reset' }).click();

    await expect(emailInput).toHaveValue('a@b.com');
    await expect(switchControl).toBeChecked();
  });

  test('<fieldset disabled> excludes and-input and and-switch from FormData', async ({ page }) => {
    const form = page.locator('#form-fieldset-disabled');

    await expect(form.getByRole('textbox', { name: 'Email (disabled)' })).toBeDisabled();
    await expect(page.getByRole('switch', { name: 'Subscribe (disabled)' })).toBeDisabled();

    await form.getByRole('button', { name: 'Submit' }).click();

    await expect(form.locator('.result')).toHaveText('{}');
  });
});

import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('axe accessibility scan — representative rendered states', () => {
  test('select-form fixture, with a select open, has no serious/critical violations', async ({ page }) => {
    await page.goto('/e2e/fixtures/select-form.html');
    // The visible trigger and the visually-hidden mirror <select> (added for
    // real `required` validation) both compute to role "combobox" with the
    // same name — target the real button unambiguously.
    const trigger = page.locator('#form-value button[role="combobox"][aria-label="Country"]');
    await trigger.click();
    // Wait for the open state to actually settle before scanning — a bare
    // click() only dispatches the event; the menu's aria-expanded flip
    // happens on the next render, and axe must not race it (see the modal
    // test below for the CI failure this exact race caused there).
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');

    const results = await new AxeBuilder({ page })
      // Same justified, narrow exclusion as the form-participation test
      // below — see its comment. Here it also catches and-select's trigger
      // button: its `aria-disabled` only reflects the component's own
      // `disabled` prop, not `<fieldset disabled>` ancestry, so the
      // fieldset-disabled trigger renders dimmed (CVA `disabled:opacity-*`
      // via the native `:disabled` pseudo-class) without axe recognizing it
      // as an inactive, contrast-exempt component.
      .exclude('#form-fieldset-disabled')
      .analyze();
    const seriousOrCritical = results.violations.filter(v => v.impact === 'serious' || v.impact === 'critical');

    expect(seriousOrCritical, JSON.stringify(seriousOrCritical, null, 2)).toEqual([]);
  });

  test('a properly labeled open modal has no serious/critical violations', async ({ page }) => {
    await page.goto('/e2e/fixtures/modal-a11y.html');
    await page.getByRole('button', { name: 'Open labeled modal' }).click();
    // The dialog's aria-label is set by syncAccessibleName(), which runs
    // from componentDidRender() *after* Stencil commits the open state —
    // not synchronously with the click. Without this wait, axe can scan the
    // DOM mid-render on a slow/CI machine and see a momentarily unnamed
    // dialog, flooding aria-dialog-name as a false failure (verified: this
    // exact race failed consistently on WebKit in CI while passing locally).
    // Waiting on the *named* role query, not just "dialog", makes the test
    // assert the real precondition instead of merely papering over the race.
    await expect(page.getByRole('dialog', { name: 'Delete account' })).toBeVisible();

    const results = await new AxeBuilder({ page }).analyze();
    const seriousOrCritical = results.violations.filter(v => v.impact === 'serious' || v.impact === 'critical');

    expect(seriousOrCritical, JSON.stringify(seriousOrCritical, null, 2)).toEqual([]);
  });

  test('an unlabeled open modal IS flagged by axe for missing an accessible name', async ({ page }) => {
    await page.goto('/e2e/fixtures/modal-a11y.html');
    await page.getByRole('button', { name: 'Open unlabeled modal' }).click();
    // Same race as above — wait for the dialog itself to be rendered (it
    // has no name to wait on, by design) before scanning.
    await expect(page.locator('and-modal#unlabeled-modal [role="dialog"]')).toBeVisible();

    const results = await new AxeBuilder({ page }).analyze();

    // This is the load-bearing proof for the and-modal fix: removing the
    // `aria-label="Dialog"` fallback must make a genuinely unnamed dialog
    // show up as a real, detectable accessibility violation instead of
    // silently passing with a meaningless name.
    expect(results.violations.some(v => v.id === 'aria-dialog-name')).toBe(true);
  });

  test('form-participation fixture has no serious/critical violations', async ({ page }) => {
    await page.goto('/e2e/fixtures/form-participation.html');
    // Wait for Stencil hydration to actually finish (component upgrade from
    // plain custom element to its rendered form) before scanning, same
    // rationale as the modal race above.
    await expect(page.getByRole('switch', { name: 'Subscribe', exact: true })).toBeChecked();

    const results = await new AxeBuilder({ page })
      // Justified, narrow exclusion (not a blanket rule disable): controls
      // inside a <fieldset disabled> are genuinely inactive, which WCAG
      // 1.4.3's own "Inactive user interface components" clause exempts
      // from the contrast requirement. axe-core's color-contrast check
      // doesn't detect that exemption here because
      // `HTMLInputElement.disabled` only reflects the element's own
      // `disabled` attribute, not fieldset-inherited disabling (verified
      // live: `.disabled` reads `false` while `:matches(':disabled')`
      // correctly reads `true`) — so axe still measures contrast against
      // the CVA `disabled:opacity-50` dimming and flags it. Filed as
      // SSD.md §15 TD-29; not a real accessibility defect.
      .exclude('#form-fieldset-disabled')
      .analyze();
    const seriousOrCritical = results.violations.filter(v => v.impact === 'serious' || v.impact === 'critical');

    expect(seriousOrCritical, JSON.stringify(seriousOrCritical, null, 2)).toEqual([]);
  });
});

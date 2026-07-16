import { describe, it, expect } from 'vitest';
import { render, h } from '@stencil/vitest';
import './and-switch';

describe('and-switch', () => {
  it('renders a checkbox with role=switch in light DOM', async () => {
    const { root } = await render(<and-switch label="Enable notifications"></and-switch>);

    expect(root.shadowRoot).toBeNull();
    const input = root.querySelector('input[type="checkbox"]');
    expect(input).toBeTruthy();
    expect(input?.getAttribute('role')).toBe('switch');
    expect(input?.getAttribute('aria-label')).toBe('Enable notifications');
  });

  it('reflects checked state', async () => {
    const { root } = await render(<and-switch checked></and-switch>);
    const input = root.querySelector('input') as HTMLInputElement;
    expect(input.checked).toBe(true);
    expect(input.getAttribute('aria-checked')).toBe('true');
  });

  it('emits andSwitchChange on toggle', async () => {
    const { root, waitForChanges, spyOnEvent } = await render(<and-switch></and-switch>);

    const changeSpy = spyOnEvent('andSwitchChange');
    const input = root.querySelector('input') as HTMLInputElement;
    input.checked = true;
    input.dispatchEvent(new Event('change'));
    await waitForChanges();

    expect(changeSpy).toHaveReceivedEventTimes(1);
    expect(changeSpy).toHaveReceivedEventDetail(true);
  });

  it('reflects disabled state', async () => {
    const { root } = await render(<and-switch disabled></and-switch>);
    const input = root.querySelector('input');
    expect(input?.hasAttribute('disabled')).toBe(true);
  });

  it('renders its checkbox in light DOM (not Shadow DOM) so a wrapping <form> can see it', async () => {
    const { root } = await render(<and-switch name="notifications" checked></and-switch>);
    expect(root.shadowRoot).toBeNull();

    const form = root.ownerDocument.createElement('form');
    form.appendChild(root);
    root.ownerDocument.body.appendChild(form);

    const input = root.querySelector('input') as HTMLInputElement;
    expect(input.getAttribute('name')).toBe('notifications');
    // A real descendant of <form> in the DOM tree — the actual condition FormData relies on.
    expect(form.contains(input)).toBe(true);

    form.remove();
  });

  it('restores its default checked state when the wrapping <form> is reset', async () => {
    const { root, waitForChanges } = await render(<and-switch name="notifications"></and-switch>);

    const form = root.ownerDocument.createElement('form');
    form.appendChild(root);
    root.ownerDocument.body.appendChild(form);

    (root as HTMLAndSwitchElement).checked = true;
    await waitForChanges();
    expect((root as HTMLAndSwitchElement).checked).toBe(true);

    form.dispatchEvent(new Event('reset'));
    await waitForChanges();

    expect((root as HTMLAndSwitchElement).checked).toBe(false);
    const input = root.querySelector('input') as HTMLInputElement;
    expect(input.checked).toBe(false);

    form.remove();
  });

  it('stops listening for reset after being removed from the DOM', async () => {
    const { root, waitForChanges } = await render(<and-switch name="notifications"></and-switch>);

    const form = root.ownerDocument.createElement('form');
    form.appendChild(root);
    root.ownerDocument.body.appendChild(form);

    root.remove();

    // Dispatching reset after disconnection must not throw (listener removed).
    expect(() => form.dispatchEvent(new Event('reset'))).not.toThrow();
    await waitForChanges();

    form.remove();
  });
});

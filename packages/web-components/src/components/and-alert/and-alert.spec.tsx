import { describe, it, expect } from 'vitest';
import { render, h } from '@stencil/vitest';
import './and-alert';

describe('and-alert', () => {
  it('renders with default variant', async () => {
    const { root } = await render(<and-alert>Alert message</and-alert>);

    expect(root).toBeTruthy();
    expect(root.getAttribute('role')).toBe('status');
    const slot = root.shadowRoot.querySelector('slot');
    expect(slot).toBeTruthy();
  });

  it('renders dismissible button when dismissible prop is true', async () => {
    const { root } = await render(<and-alert dismissible>Dismissible alert</and-alert>);

    const button = root.shadowRoot.querySelector('button');
    expect(button).toBeTruthy();
  });

  it('emits andDismiss when dismiss button is clicked', async () => {
    const { root, waitForChanges, spyOnEvent } = await render(<and-alert dismissible>Dismissible alert</and-alert>);

    const dismissSpy = spyOnEvent('andDismiss');
    const button = root.shadowRoot.querySelector('button') as HTMLElement;
    button.click();
    await waitForChanges();

    expect(dismissSpy).toHaveReceivedEventTimes(1);
  });
});

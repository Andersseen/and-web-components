import { describe, it, expect } from 'vitest';
import { render, h } from '@stencil/vitest';
import './and-button';

describe('and-button', () => {
  it('renders with accessibility attributes', async () => {
    const { root } = await render(<and-button>Click me</and-button>);

    const button = root.shadowRoot.querySelector('button');
    expect(button).toBeTruthy();
    expect(button.getAttribute('type')).toBe('button');
    expect(button.getAttribute('data-state')).toBe('active');
    expect(button.getAttribute('tabindex')).toBe('0');
    expect(button.className).toContain('bg-primary');
  });

  it('applies destructive variant', async () => {
    const { root } = await render(<and-button variant="destructive">Delete</and-button>);

    const button = root.shadowRoot.querySelector('button');
    expect(button.className).toContain('bg-destructive');
  });

  it('emits andButtonClick on click', async () => {
    const { root, waitForChanges, spyOnEvent } = await render(<and-button>Click me</and-button>);

    const clickSpy = spyOnEvent('andButtonClick');
    const button = root.shadowRoot.querySelector('button');
    button.click();
    await waitForChanges();

    expect(clickSpy).toHaveReceivedEventTimes(1);
  });
});

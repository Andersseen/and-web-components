import { describe, it, expect } from 'vitest';
import { render, h } from '@stencil/vitest';
import './and-tooltip';

describe('and-tooltip', () => {
  it('renders trigger slot and tooltip content', async () => {
    const { root } = await render(
      <and-tooltip content="Tooltip text">
        <button>Hover me</button>
      </and-tooltip>,
    );

    expect(root).toBeTruthy();
    const tooltip = root.shadowRoot.querySelector('[role="tooltip"]');
    expect(tooltip).toBeTruthy();
    expect(tooltip?.textContent).toContain('Tooltip text');
  });

  it('shows tooltip on focusin and hides on focusout', async () => {
    const { root, waitForChanges } = await render(
      <and-tooltip content="Tooltip text">
        <button>Focus me</button>
      </and-tooltip>,
    );

    root.dispatchEvent(new FocusEvent('focusin'));
    await waitForChanges();

    const tooltip = root.shadowRoot.querySelector('[role="tooltip"]') as HTMLElement;
    expect(tooltip?.getAttribute('data-state')).toBe('open');

    root.dispatchEvent(new FocusEvent('focusout'));
    await waitForChanges();

    expect(tooltip?.getAttribute('data-state')).toBe('closed');
  });
});

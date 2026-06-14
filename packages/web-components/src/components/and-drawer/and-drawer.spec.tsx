import { describe, it, expect } from 'vitest';
import { render, h } from '@stencil/vitest';
import './and-drawer';

describe('and-drawer', () => {
  it('renders closed by default', async () => {
    const { root } = await render(<and-drawer></and-drawer>);

    const overlay = root.shadowRoot.querySelector('.and-drawer-overlay');
    expect(overlay).toBeTruthy();
    expect(overlay?.getAttribute('data-state')).toBe('closed');
  });

  it('renders open when open prop is true', async () => {
    const { root, waitForChanges } = await render(<and-drawer open></and-drawer>);
    await waitForChanges();

    const overlay = root.shadowRoot.querySelector('.and-drawer-overlay');
    expect(overlay?.getAttribute('data-state')).toBe('open');

    const content = root.shadowRoot.querySelector('.and-drawer-content');
    expect(content?.getAttribute('role')).toBe('dialog');
  });

  it('emits andDrawerClose when overlay is clicked', async () => {
    const { root, waitForChanges, spyOnEvent } = await render(<and-drawer open></and-drawer>);

    const closeSpy = spyOnEvent('andDrawerClose');
    const overlay = root.shadowRoot.querySelector('.and-drawer-overlay') as HTMLElement;
    overlay.click();
    await waitForChanges();

    expect(closeSpy).toHaveReceivedEventTimes(1);
  });
});

import { describe, it, expect } from 'vitest';
import { render, h } from '@stencil/vitest';
import './and-modal';

describe('and-modal', () => {
  it('renders closed by default', async () => {
    const { root } = await render(<and-modal></and-modal>);

    expect(root.shadowRoot.children.length).toBe(0);
  });

  it('renders open when open prop is true', async () => {
    const { root } = await render(<and-modal open></and-modal>);

    const backdrop = root.shadowRoot.querySelector('.and-modal-backdrop');
    expect(backdrop).toBeTruthy();
  });

  it('emits andClose when overlay is clicked', async () => {
    const { root, waitForChanges, spyOnEvent } = await render(<and-modal open></and-modal>);

    const closeSpy = spyOnEvent('andClose');
    const backdrop = root.shadowRoot.querySelector('.and-modal-backdrop') as HTMLElement;
    backdrop.click();
    await waitForChanges();

    expect(closeSpy).toHaveReceivedEventTimes(1);
  });
});

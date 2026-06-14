import { describe, it, expect } from 'vitest';
import { render, h } from '@stencil/vitest';
import { AndToast } from './and-toast';
import './and-toast';

describe('and-toast', () => {
  it('renders empty by default', async () => {
    const { root } = await render(<and-toast></and-toast>);

    const region = root.shadowRoot.querySelector('[role="region"]');
    expect(region).toBeTruthy();
    expect(region?.children.length).toBe(0);
  });

  it('presents a toast via method', async () => {
    const { root, waitForChanges } = await render(<and-toast></and-toast>);

    await (root as unknown as AndToast).present('Hello world', 'default', 3000);
    await waitForChanges();

    const toastItems = root.shadowRoot.querySelectorAll('.and-toast-item');
    expect(toastItems.length).toBe(1);
    expect(toastItems[0].textContent).toContain('Hello world');
  });
});

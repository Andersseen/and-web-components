import { describe, expect, it } from 'vitest';
import { h, render } from '@stencil/vitest';
import './and-sidebar';

describe('and-sidebar', () => {
  it('renders items and exposes the active state', async () => {
    const items = [
      { id: 'home', label: 'Home' },
      { id: 'settings', label: 'Settings' },
    ];
    const { root } = await render(
      <and-sidebar items={items} active-item="settings" mobile-collapse={false}></and-sidebar>,
    );

    expect(root.shadowRoot.querySelector('aside')).toBeTruthy();
    const active = root.shadowRoot.querySelector('[data-state="active"]');
    expect(active?.textContent).toContain('Settings');
    expect(active?.getAttribute('aria-current')).toBe('page');
  });

  it('reflects the collapsed state on the host', async () => {
    const { root } = await render(<and-sidebar collapsed mobile-collapse={false}></and-sidebar>);

    expect(root.getAttribute('data-state')).toBe('collapsed');
    expect(root.getAttribute('data-collapsed')).toBe('true');
  });
});

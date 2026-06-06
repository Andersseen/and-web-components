import { describe, it, expect } from 'vitest';
import { render, h } from '@stencil/vitest';
import '../and-sidebar';

describe('and-sidebar', () => {
  it('renders with navigation structure', async () => {
    const { root } = await render(<and-sidebar></and-sidebar>);

    expect(root).toBeTruthy();
    expect(root.getAttribute('role')).toBe('navigation');

    const aside = root.shadowRoot.querySelector('aside');
    expect(aside).toBeTruthy();

    const nav = root.shadowRoot.querySelector('nav[role="menu"]');
    expect(nav).toBeTruthy();

    const toggle = root.shadowRoot.querySelector('button.sidebar-toggle');
    expect(toggle).toBeTruthy();
  });
});

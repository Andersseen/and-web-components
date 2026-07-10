import { describe, expect, it } from 'vitest';
import { h, render } from '@stencil/vitest';
import './and-navbar';

describe('and-navbar', () => {
  it('renders navigation items with the active item exposed', async () => {
    const items = [
      { id: 'home', label: 'Home', href: '/home' },
      { id: 'docs', label: 'Docs', href: '/docs' },
    ];
    const { root } = await render(
      <and-navbar items={items} active-item="docs" active-mode="manual" mobile-breakpoint={0}></and-navbar>,
    );

    expect(root.shadowRoot.querySelector('nav')).toBeTruthy();
    const active = root.shadowRoot.querySelector('[data-state="active"]');
    expect(active?.textContent).toContain('Docs');
    expect(active?.getAttribute('aria-current')).toBe('page');
  });
});

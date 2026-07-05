import { describe, it, expect } from 'vitest';
import { render, h } from '@stencil/vitest';
import './and-breadcrumb';

describe('and-breadcrumb', () => {
  it('renders navigation with default aria-label', async () => {
    const { root } = await render(<and-breadcrumb>Home / Products</and-breadcrumb>);

    const nav = root.shadowRoot.querySelector('nav');
    const list = root.shadowRoot.querySelector('ol');

    expect(nav).toBeTruthy();
    expect(nav.getAttribute('role')).toBe('navigation');
    expect(nav.getAttribute('aria-label')).toBe('Breadcrumb');
    expect(list).toBeTruthy();
    expect(list.getAttribute('role')).toBe('list');
    expect(root.textContent).toContain('Home / Products');
  });

  it('uses custom aria-label', async () => {
    const { root } = await render(<and-breadcrumb aria-label="Page path">Path</and-breadcrumb>);

    const nav = root.shadowRoot.querySelector('nav');
    expect(nav.getAttribute('aria-label')).toBe('Page path');
  });

  it('applies size variants', async () => {
    const { root: sm } = await render(<and-breadcrumb size="sm">Small</and-breadcrumb>);
    const { root: lg } = await render(<and-breadcrumb size="lg">Large</and-breadcrumb>);

    expect(sm.shadowRoot.querySelector('ol').className).toContain('text-xs');
    expect(lg.shadowRoot.querySelector('ol').className).toContain('text-base');
  });

  it('merges custom classes', async () => {
    const { root } = await render(<and-breadcrumb class="trail-custom">Trail</and-breadcrumb>);

    expect(root.shadowRoot.querySelector('ol').className).toContain('trail-custom');
  });
});

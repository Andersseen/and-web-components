import { newSpecPage } from '@stencil/core/testing';
import { AndSidebar } from '../and-sidebar';

describe('and-sidebar', () => {
  it('renders with navigation structure', async () => {
    const page = await newSpecPage({
      components: [AndSidebar],
      html: `<and-sidebar></and-sidebar>`,
    });

    expect(page.root).toBeTruthy();
    expect(page.root.getAttribute('role')).toBe('navigation');

    const aside = page.root.shadowRoot.querySelector('aside');
    expect(aside).toBeTruthy();

    const nav = page.root.shadowRoot.querySelector('nav[role="menu"]');
    expect(nav).toBeTruthy();

    const toggle = page.root.shadowRoot.querySelector('button.sidebar-toggle');
    expect(toggle).toBeTruthy();
  });
});

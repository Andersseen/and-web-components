import { newSpecPage } from '@stencil/core/testing';
import { AndDropdown } from './and-dropdown';

describe('and-dropdown', () => {
  it('renders trigger button with label', async () => {
    const page = await newSpecPage({
      components: [AndDropdown],
      html: `<and-dropdown label="Menu"></and-dropdown>`,
    });

    const button = page.root.shadowRoot.querySelector('button');
    expect(button).toBeTruthy();
    expect(button.textContent).toContain('Menu');
  });

  it('renders closed menu by default', async () => {
    const page = await newSpecPage({
      components: [AndDropdown],
      html: `<and-dropdown></and-dropdown>`,
    });

    const menu = page.root.shadowRoot.querySelector('.and-dropdown-menu');
    expect(menu.className).toContain('invisible');
  });
});

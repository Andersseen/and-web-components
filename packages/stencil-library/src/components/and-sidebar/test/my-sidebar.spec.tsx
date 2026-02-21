import { newSpecPage } from '@stencil/core/testing';
import { AndSidebar } from '../and-sidebar';

describe('and-sidebar', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [AndSidebar],
      html: `<and-sidebar></and-sidebar>`,
    });
    expect(page.root).toEqualHtml(`
      <and-sidebar>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </and-sidebar>
    `);
  });
});

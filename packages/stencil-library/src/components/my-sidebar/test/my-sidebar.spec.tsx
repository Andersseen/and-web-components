import { newSpecPage } from '@stencil/core/testing';
import { MySidebar } from '../my-sidebar';

describe('my-sidebar', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [MySidebar],
      html: `<my-sidebar></my-sidebar>`,
    });
    expect(page.root).toEqualHtml(`
      <my-sidebar>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </my-sidebar>
    `);
  });
});

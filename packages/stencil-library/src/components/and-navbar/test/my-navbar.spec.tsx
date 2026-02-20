import { newSpecPage } from '@stencil/core/testing';
import { MyNavbar } from '../and-navbar';

describe('and-navbar', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [MyNavbar],
      html: `<and-navbar></and-navbar>`,
    });
    expect(page.root).toEqualHtml(`
      <and-navbar>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </and-navbar>
    `);
  });
});

import { newSpecPage } from '@stencil/core/testing';
import { MyNavbar } from '../my-navbar';

describe('my-navbar', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [MyNavbar],
      html: `<my-navbar></my-navbar>`,
    });
    expect(page.root).toEqualHtml(`
      <my-navbar>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </my-navbar>
    `);
  });
});

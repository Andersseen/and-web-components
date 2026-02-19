import { newSpecPage } from '@stencil/core/testing';
import { MyIcon } from './my-icon';

describe('my-icon', () => {
  it('renders with default values', async () => {
    const page = await newSpecPage({
      components: [MyIcon],
      html: `<my-icon name="close"></my-icon>`,
    });

    expect(page.root).toEqualHtml(`
          <my-icon name="close">
            <mock:shadow-root>
              <svg fill="none" height="24px" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" width="24px" xmlns="http://www.w3.org/2000/svg">
                <g>
                  <g>
                    <path d="M18 6 6 18">
                      <path d="m6 6 12 12"></path>
                    </path>
                  </g>
                </g>
              </svg>
            </mock:shadow-root>
          </my-icon>
        `);
  });
});

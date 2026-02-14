import { newSpecPage } from '@stencil/core/testing';
import { MyStack } from './my-stack';

describe('my-stack', () => {
  it('renders with default props', async () => {
    const page = await newSpecPage({
      components: [MyStack],
      html: `<my-stack>Content</my-stack>`,
    });
    expect(page.root).toEqualHtml(`
      <my-stack class="flex flex-col gap-4 items-stretch justify-start flex-nowrap">
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
        Content
      </my-stack>
    `);
  });

  it('applies classes based on props', async () => {
    const page = await newSpecPage({
      components: [MyStack],
      html: `<my-stack direction="row" gap="lg" align="center" justify="between" wrap="true">Content</my-stack>`,
    });
    expect(page.root).toEqualHtml(`
      <my-stack class="flex flex-row gap-6 items-center justify-between flex-wrap" direction="row" gap="lg" align="center" justify="between" wrap="true">
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
        Content
      </my-stack>
    `);
  });
});

import { newSpecPage } from '@stencil/core/testing';
import { AndButton } from './and-button';

describe('and-button', () => {
  it('renders correctly with default slots', async () => {
    const page = await newSpecPage({
      components: [AndButton],
      html: `<and-button>Click me</and-button>`,
    });

    expect(page.root).toEqualHtml(`
      <and-button variant="default" size="default" type="button">
        <mock:shadow-root>
          <button class="bg-primary hover:bg-primary/90 hover:shadow-md inline-flex items-center justify-center gap-1.5 rounded-lg text-sm font-medium font-sans transition-all duration-normal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background disabled:opacity-50 disabled:pointer-events-none text-primary-foreground shadow-sm h-11 sm:h-10 py-2 px-4">
            <slot name="start"></slot>
            <slot></slot>
            <slot name="end"></slot>
          </button>
        </mock:shadow-root>
        Click me
      </and-button>
    `);
  });

  it('handles custom variants', async () => {
    const page = await newSpecPage({
      components: [AndButton],
      html: `<and-button variant="destructive">Delete</and-button>`,
    });

    // We verify the destructive class is present in the rendered shadow dom
    expect(page.root.shadowRoot.querySelector('button').className).toContain('bg-destructive');
  });
});

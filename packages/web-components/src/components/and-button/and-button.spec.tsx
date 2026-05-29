import { newSpecPage } from '@stencil/core/testing';
import { AndButton } from './and-button';

describe('and-button', () => {
  it('renders with accessibility attributes', async () => {
    const page = await newSpecPage({
      components: [AndButton],
      html: `<and-button>Click me</and-button>`,
    });

    const button = page.root.shadowRoot.querySelector('button');
    expect(button).toBeTruthy();
    expect(button.getAttribute('type')).toBe('button');
    expect(button.getAttribute('data-state')).toBe('active');
    expect(button.getAttribute('tabindex')).toBe('0');
    expect(button.className).toContain('bg-primary');
  });

  it('applies destructive variant', async () => {
    const page = await newSpecPage({
      components: [AndButton],
      html: `<and-button variant="destructive">Delete</and-button>`,
    });

    const button = page.root.shadowRoot.querySelector('button');
    expect(button.className).toContain('bg-destructive');
  });

  it('emits andButtonClick on click', async () => {
    const page = await newSpecPage({
      components: [AndButton],
      html: `<and-button>Click me</and-button>`,
    });

    const listener = jest.fn();
    page.root.addEventListener('andButtonClick', listener);

    const button = page.root.shadowRoot.querySelector('button');
    button.click();
    await page.waitForChanges();

    expect(listener).toHaveBeenCalledTimes(1);
  });
});

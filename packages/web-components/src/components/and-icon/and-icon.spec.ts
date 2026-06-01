import { newSpecPage } from '@stencil/core/testing';
import { AndIcon } from './and-icon';

describe('and-icon', () => {
  it('renders host with correct attributes', async () => {
    const page = await newSpecPage({
      components: [AndIcon],
      html: `<and-icon name="close" size="16" stroke-width="1.5"></and-icon>`,
    });

    expect(page.root).toBeTruthy();
    expect(page.root.getAttribute('name')).toBe('close');
    expect(page.root.getAttribute('size')).toBe('16');
    expect(page.root.getAttribute('stroke-width')).toBe('1.5');
    expect(page.root.getAttribute('role')).toBe('img');
    expect(page.root.getAttribute('aria-hidden')).toBe('true');
  });
});

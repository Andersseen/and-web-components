import { newE2EPage } from '@stencil/core/testing';

describe('my-sidebar', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<my-sidebar></my-sidebar>');

    const element = await page.find('my-sidebar');
    expect(element).toHaveClass('hydrated');
  });
});

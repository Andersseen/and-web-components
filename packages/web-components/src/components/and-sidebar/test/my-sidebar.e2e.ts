import { newE2EPage } from '@stencil/core/testing';

describe('and-sidebar', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<and-sidebar></and-sidebar>');

    const element = await page.find('and-sidebar');
    expect(element).toHaveClass('hydrated');
  });
});

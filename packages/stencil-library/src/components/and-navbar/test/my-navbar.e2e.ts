import { newE2EPage } from '@stencil/core/testing';

describe('and-navbar', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<and-navbar></and-navbar>');

    const element = await page.find('and-navbar');
    expect(element).toHaveClass('hydrated');
  });
});

import { newE2EPage } from '@stencil/core/testing';

describe('my-navbar', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<my-navbar></my-navbar>');

    const element = await page.find('my-navbar');
    expect(element).toHaveClass('hydrated');
  });
});

import { newSpecPage } from '@stencil/core/testing';
import { AndNavbar } from '../and-navbar';

describe('and-navbar', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [AndNavbar],
      html: `<and-navbar></and-navbar>`,
    });
    expect(page.root).toBeTruthy();
  });
});

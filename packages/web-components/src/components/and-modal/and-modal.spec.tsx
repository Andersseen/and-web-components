import { newSpecPage } from '@stencil/core/testing';
import { AndModal } from './and-modal';

describe('and-modal', () => {
  it('renders closed by default', async () => {
    const page = await newSpecPage({
      components: [AndModal],
      html: `<and-modal></and-modal>`,
    });

    expect(page.root.shadowRoot.children.length).toBe(0);
  });

  it('renders open when open prop is true', async () => {
    const page = await newSpecPage({
      components: [AndModal],
      html: `<and-modal open></and-modal>`,
    });

    const backdrop = page.root.shadowRoot.querySelector('.and-modal-backdrop');
    expect(backdrop).toBeTruthy();
  });

  it('emits andClose when overlay is clicked', async () => {
    const page = await newSpecPage({
      components: [AndModal],
      html: `<and-modal open></and-modal>`,
    });

    const listener = jest.fn();
    page.root.addEventListener('andClose', listener);

    const backdrop = page.root.shadowRoot.querySelector('.and-modal-backdrop') as HTMLElement;
    backdrop.click();
    await page.waitForChanges();

    expect(listener).toHaveBeenCalledTimes(1);
  });
});

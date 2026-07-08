import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { VanillaModal } from './vanilla-modal';

if (!customElements.get('and-vanilla-modal')) {
  customElements.define('and-vanilla-modal', VanillaModal);
}

describe('VanillaModal', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  it('is hidden by default', async () => {
    const el = document.createElement('and-vanilla-modal') as VanillaModal;
    container.appendChild(el);

    await vi.waitFor(() => expect(el.querySelector('.and-modal-content')).toBeFalsy());
  });

  it('renders content when open attribute is set', async () => {
    const el = document.createElement('and-vanilla-modal') as VanillaModal;
    el.setAttribute('open', '');
    el.textContent = 'Hello';
    container.appendChild(el);

    await vi.waitFor(() => expect(el.querySelector('.and-modal-content')).toBeTruthy());
    expect(el.querySelector('.and-modal-body')?.textContent).toContain('Hello');
  });

  it('renders dialog content inside a fixed viewport wrapper', async () => {
    const el = document.createElement('and-vanilla-modal') as VanillaModal;
    el.setAttribute('open', '');
    el.textContent = 'Hello';
    container.appendChild(el);

    await vi.waitFor(() => expect(el.querySelector('.and-modal-content')).toBeTruthy());

    const viewport = el.querySelector('.and-modal-viewport');
    const content = el.querySelector('.and-modal-content');
    expect(viewport).toBeTruthy();
    expect(viewport?.contains(content)).toBe(true);
  });

  it('toggles open and closed multiple times', async () => {
    const el = document.createElement('and-vanilla-modal') as VanillaModal;
    el.textContent = 'Hello';
    container.appendChild(el);

    await vi.waitFor(() => expect(el.querySelector('.and-modal-content')).toBeFalsy());

    for (let i = 0; i < 3; i++) {
      el.setAttribute('open', '');
      await vi.waitFor(() => expect(el.querySelector('.and-modal-content')).toBeTruthy());

      el.removeAttribute('open');
      await vi.waitFor(() => expect(el.querySelector('.and-modal-content')).toBeFalsy());
    }
  });

  it('closes when clicking the close button', async () => {
    const el = document.createElement('and-vanilla-modal') as VanillaModal;
    el.setAttribute('open', '');
    el.textContent = 'Hello';
    container.appendChild(el);

    await vi.waitFor(() => expect(el.querySelector('.and-modal-content')).toBeTruthy());

    const closeBtn = el.querySelector('.and-modal-close') as HTMLButtonElement;
    closeBtn?.click();

    await vi.waitFor(() => expect(el.querySelector('.and-modal-content')).toBeFalsy());
  });

  it('closes when clicking the backdrop', async () => {
    const el = document.createElement('and-vanilla-modal') as VanillaModal;
    el.setAttribute('open', '');
    el.textContent = 'Hello';
    container.appendChild(el);

    await vi.waitFor(() => expect(el.querySelector('.and-modal-content')).toBeTruthy());

    const backdrop = el.querySelector('.and-modal-backdrop') as HTMLDivElement;
    backdrop?.click();

    await vi.waitFor(() => expect(el.querySelector('.and-modal-content')).toBeFalsy());
  });

  it('emits andModalClose event after closing', async () => {
    const el = document.createElement('and-vanilla-modal') as VanillaModal;
    el.setAttribute('open', '');
    container.appendChild(el);

    await vi.waitFor(() => expect(el.querySelector('.and-modal-content')).toBeTruthy());

    const closeHandler = vi.fn();
    el.addEventListener('andModalClose', closeHandler);

    el.removeAttribute('open');

    await vi.waitFor(() => expect(el.querySelector('.and-modal-content')).toBeFalsy());
    expect(closeHandler).toHaveBeenCalled();
  });
});

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { VanillaModal } from './vanilla-modal';

if (!customElements.get('and-modal')) {
  customElements.define('and-modal', VanillaModal);
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
    const el = document.createElement('and-modal') as VanillaModal;
    container.appendChild(el);

    await vi.waitFor(() => expect(el.querySelector('.and-modal-content')).toBeFalsy());
  });

  it('renders content when open attribute is set', async () => {
    const el = document.createElement('and-modal') as VanillaModal;
    el.setAttribute('open', '');
    el.textContent = 'Hello';
    container.appendChild(el);

    await vi.waitFor(() => expect(el.querySelector('.and-modal-content')).toBeTruthy());
    expect(el.querySelector('.and-modal-body')?.textContent).toContain('Hello');
  });
});

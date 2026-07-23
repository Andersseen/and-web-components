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

describe('VanillaModal — regressions', () => {
  let host: HTMLElement;

  beforeEach(() => {
    host = document.createElement('div');
    document.body.appendChild(host);
  });

  afterEach(() => {
    host.remove();
    document.body.style.overflow = '';
  });

  const mount = (): HTMLElement => {
    host.innerHTML = `
      <and-vanilla-modal>
        <h2>Delete account</h2>
        <input id="field" />
        <button id="confirm">Confirm</button>
      </and-vanilla-modal>`;
    return host.querySelector('and-vanilla-modal') as HTMLElement;
  };

  it('keeps the author content when the element is moved in the DOM', () => {
    // connectedCallback fires again on every re-insertion. It used to
    // re-read childNodes into `originalContent` — which is empty while the
    // modal is closed — permanently destroying the slotted content.
    const modal = mount();
    modal.setAttribute('open', '');
    expect(modal.querySelector('#field')).toBeTruthy();
    modal.removeAttribute('open');

    const elsewhere = document.createElement('section');
    document.body.appendChild(elsewhere);
    elsewhere.appendChild(modal);

    modal.setAttribute('open', '');

    expect(modal.querySelector('#field')).toBeTruthy();
    expect(modal.querySelector('#confirm')).toBeTruthy();
    expect(modal.querySelector('h2')?.textContent).toBe('Delete account');
    elsewhere.remove();
  });

  it('survives repeated open/close cycles', () => {
    const modal = mount();
    for (let i = 0; i < 3; i++) {
      modal.setAttribute('open', '');
      expect(modal.querySelector('#field')).toBeTruthy();
      modal.removeAttribute('open');
    }
    modal.setAttribute('open', '');
    expect(modal.querySelector('#confirm')).toBeTruthy();
  });

  it('closes on Escape', () => {
    // Nothing was listening for keydown, so the headless closeOnEscape
    // policy could never fire.
    const modal = mount();
    modal.setAttribute('open', '');
    expect(modal.hasAttribute('open')).toBe(true);

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));

    expect(modal.hasAttribute('open')).toBe(false);
  });

  it('locks and restores body scroll', () => {
    const modal = mount();
    modal.setAttribute('open', '');
    expect(document.body.style.overflow).toBe('hidden');

    modal.removeAttribute('open');
    expect(document.body.style.overflow).toBe('');
  });

  it('moves focus into the dialog and restores it on close', () => {
    const opener = document.createElement('button');
    document.body.appendChild(opener);
    opener.focus();

    const modal = mount();
    modal.setAttribute('open', '');
    expect(document.activeElement?.id).toBe('field');

    modal.removeAttribute('open');
    expect(document.activeElement).toBe(opener);
    opener.remove();
  });

  it('names the dialog from a slotted heading', () => {
    const modal = mount();
    modal.setAttribute('open', '');

    const dialog = modal.querySelector('[role="dialog"]') as HTMLElement;
    const heading = modal.querySelector('h2') as HTMLElement;
    expect(dialog.getAttribute('aria-labelledby')).toBe(heading.id);
    expect(heading.id).toBeTruthy();
  });

  it('prefers an explicit label attribute over the heading', () => {
    const modal = mount();
    modal.setAttribute('label', 'Confirm deletion');
    modal.setAttribute('open', '');

    const dialog = modal.querySelector('[role="dialog"]') as HTMLElement;
    expect(dialog.getAttribute('aria-label')).toBe('Confirm deletion');
    expect(dialog.hasAttribute('aria-labelledby')).toBe(false);
  });
});

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { VanillaButton } from './vanilla-button';

if (!customElements.get('and-vanilla-button')) {
  customElements.define('and-vanilla-button', VanillaButton);
}

describe('VanillaButton', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  it('renders a button with the provided text', async () => {
    const el = document.createElement('and-vanilla-button') as VanillaButton;
    el.textContent = 'Click me';
    container.appendChild(el);

    await vi.waitFor(() => expect(el.querySelector('button')?.textContent?.trim()).toBe('Click me'));
  });

  it('reflects the disabled attribute', async () => {
    const el = document.createElement('and-vanilla-button') as VanillaButton;
    el.setAttribute('disabled', '');
    container.appendChild(el);

    await vi.waitFor(() => expect(el.querySelector('button')).toBeTruthy());
    expect(el.querySelector('button')?.hasAttribute('disabled')).toBe(true);
  });
});

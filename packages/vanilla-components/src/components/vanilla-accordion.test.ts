import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { VanillaAccordion } from './vanilla-accordion';

if (!customElements.get('and-vanilla-accordion')) {
  customElements.define('and-vanilla-accordion', VanillaAccordion);
}

describe('VanillaAccordion', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  it('renders items from slotted children', async () => {
    const el = document.createElement('and-vanilla-accordion') as VanillaAccordion;
    el.innerHTML = `
      <div title="First" value="first">Content 1</div>
      <div title="Second" value="second">Content 2</div>
    `;
    container.appendChild(el);

    await vi.waitFor(() => expect(el.querySelectorAll('.and-accordion-trigger')).toHaveLength(2));
    const triggers = el.querySelectorAll('.and-accordion-trigger');
    expect(triggers[0]?.textContent).toContain('First');
    expect(triggers[1]?.textContent).toContain('Second');
  });

  it('expands an item when its trigger is clicked', async () => {
    const el = document.createElement('and-vanilla-accordion') as VanillaAccordion;
    el.innerHTML = `<div title="Only" value="only">Only content</div>`;
    container.appendChild(el);

    await vi.waitFor(() => expect(el.querySelector('.and-accordion-trigger')).toBeTruthy());
    el.querySelector<HTMLElement>('.and-accordion-trigger')?.click();

    await vi.waitFor(() => {
      const content = el.querySelector('.and-accordion-content');
      expect(content?.hasAttribute('hidden')).toBe(false);
    });
  });
});

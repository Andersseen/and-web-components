import { VanillaButton } from './components/vanilla-button';
import { VanillaModal } from './components/vanilla-modal';
import { VanillaAccordion } from './components/vanilla-accordion';
import { isBrowser } from './utils/env';

export { VanillaButton, VanillaModal, VanillaAccordion };
export { isBrowser } from './utils/env';

/**
 * Register the custom elements. Safe to call more than once, and a no-op on
 * the server — importing this package from an Astro/Next server build must
 * not throw, so nothing touches `customElements` without a DOM.
 */
export function defineAndComponents(): void {
  if (!isBrowser || typeof customElements === 'undefined') {
    return;
  }
  const registry: Array<[string, CustomElementConstructor]> = [
    ['and-vanilla-button', VanillaButton],
    ['and-vanilla-modal', VanillaModal],
    ['and-vanilla-accordion', VanillaAccordion],
  ];
  for (const [tag, ctor] of registry) {
    if (!customElements.get(tag)) {
      customElements.define(tag, ctor);
    }
  }
}

defineAndComponents();

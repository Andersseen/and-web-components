import { VanillaButton } from './components/vanilla-button';
import { VanillaModal } from './components/vanilla-modal';
import { VanillaAccordion } from './components/vanilla-accordion';

export { VanillaButton, VanillaModal, VanillaAccordion };

export function defineAndComponents(): void {
  if (!customElements.get('and-vanilla-button')) {
    customElements.define('and-vanilla-button', VanillaButton);
  }
  if (!customElements.get('and-vanilla-modal')) {
    customElements.define('and-vanilla-modal', VanillaModal);
  }
  if (!customElements.get('and-vanilla-accordion')) {
    customElements.define('and-vanilla-accordion', VanillaAccordion);
  }
}

if (typeof window !== 'undefined') {
  defineAndComponents();
}

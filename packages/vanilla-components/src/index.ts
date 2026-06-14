import { VanillaButton } from './components/vanilla-button';
import { VanillaModal } from './components/vanilla-modal';
import { VanillaAccordion } from './components/vanilla-accordion';

export { VanillaButton, VanillaModal, VanillaAccordion };

export function defineAndComponents(): void {
  if (!customElements.get('and-button')) {
    customElements.define('and-button', VanillaButton);
  }
  if (!customElements.get('and-modal')) {
    customElements.define('and-modal', VanillaModal);
  }
  if (!customElements.get('and-accordion')) {
    customElements.define('and-accordion', VanillaAccordion);
  }
}

if (typeof window !== 'undefined') {
  defineAndComponents();
}

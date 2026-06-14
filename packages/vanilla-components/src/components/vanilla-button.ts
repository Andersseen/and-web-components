import { createButton, type ButtonReturn } from '@andersseen/headless-components';
import { createMotionPlayer, type MotionPlayer } from '@andersseen/motion';

const ATTRS = {
  VARIANT: 'variant',
  SIZE: 'size',
  DISABLED: 'disabled',
  ANIMATED: 'animated',
};

/**
 * `<and-button>` — Vanilla custom element wrapper around the headless button.
 *
 * Supports variant, size, disabled and animated attributes, and delegates
 * all accessibility and state logic to @andersseen/headless-components.
 */
export class VanillaButton extends HTMLElement {
  static observedAttributes = [ATTRS.VARIANT, ATTRS.SIZE, ATTRS.DISABLED, ATTRS.ANIMATED];

  private buttonLogic: ButtonReturn | null = null;
  private motionPlayer: MotionPlayer | null = null;
  private buttonEl: HTMLButtonElement | null = null;
  private originalContent: Node[] = [];

  connectedCallback(): void {
    this.originalContent = Array.from(this.childNodes);
    this.innerHTML = '';

    this.buttonLogic = createButton({
      disabled: this.hasAttribute(ATTRS.DISABLED),
    });

    if (this.hasAttribute(ATTRS.ANIMATED)) {
      this.motionPlayer = createMotionPlayer(this);
    }

    this.render();
  }

  disconnectedCallback(): void {
    this.motionPlayer?.destroy();
    this.motionPlayer = null;
  }

  attributeChangedCallback(name: string, _oldValue: string | null, newValue: string | null): void {
    if (!this.buttonLogic) {
      return;
    }

    switch (name) {
      case ATTRS.DISABLED:
        this.buttonLogic.actions.setDisabled(newValue !== null);
        this.render();
        break;
      case ATTRS.VARIANT:
      case ATTRS.SIZE:
      case ATTRS.ANIMATED:
        this.render();
        break;
    }
  }

  private render(): void {
    const props = this.buttonLogic?.getButtonProps();
    const variant = this.getAttribute(ATTRS.VARIANT) ?? 'default';
    const size = this.getAttribute(ATTRS.SIZE) ?? 'default';

    if (!this.buttonEl) {
      this.buttonEl = document.createElement('button');
      this.appendChild(this.buttonEl);
    }

    this.buttonEl.className = [
      'and-button',
      `and-button--${variant}`,
      `and-button--${size}`,
      props?.disabled ? 'and-button--disabled' : '',
    ]
      .filter(Boolean)
      .join(' ');

    if (props?.disabled) {
      this.buttonEl.setAttribute('disabled', '');
    } else {
      this.buttonEl.removeAttribute('disabled');
    }

    this.buttonEl.innerHTML = '';
    this.buttonEl.append(...this.originalContent);

    this.buttonEl.onclick = () => {
      this.buttonLogic?.handleClick(new MouseEvent('click'));
      if (this.hasAttribute(ATTRS.ANIMATED)) {
        void this.motionPlayer?.play('pulse');
      }
    };
  }
}

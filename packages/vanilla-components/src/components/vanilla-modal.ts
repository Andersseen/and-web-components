import { createModal, type ModalReturn } from '@andersseen/headless-components';
import { createMotionPlayer, type MotionPlayer } from '@andersseen/motion';

const ATTR_OPEN = 'open';
const ATTR_ANIMATED = 'animated';

/**
 * `<and-modal>` — Vanilla custom element modal backed by the headless modal.
 *
 * Usage:
 * ```html
 * <and-modal open animated>
 *   <h2 slot="title">Hello</h2>
 *   <p>Content</p>
 *   <button slot="close">Close</button>
 * </and-modal>
 * ```
 */
export class VanillaModal extends HTMLElement {
  static observedAttributes = [ATTR_OPEN, ATTR_ANIMATED];

  private modalLogic: ModalReturn | null = null;
  private motionPlayer: MotionPlayer | null = null;
  private contentEl: HTMLElement | null = null;
  private originalContent: Node[] = [];

  connectedCallback(): void {
    this.originalContent = Array.from(this.childNodes);
    this.innerHTML = '';

    this.modalLogic = createModal({
      defaultOpen: this.hasAttribute(ATTR_OPEN),
      onOpenChange: isOpen => {
        this.toggleAttribute(ATTR_OPEN, isOpen);
        if (!isOpen) {
          this.dispatchEvent(new CustomEvent('andClose', { bubbles: true, composed: true }));
        }
      },
    });

    this.render();
    this.setupAnimation();
  }

  disconnectedCallback(): void {
    this.motionPlayer?.destroy();
    this.motionPlayer = null;
  }

  attributeChangedCallback(name: string): void {
    if (!this.modalLogic) {
      return;
    }

    if (name === ATTR_OPEN) {
      const shouldOpen = this.hasAttribute(ATTR_OPEN);
      if (shouldOpen !== this.modalLogic.state.isOpen) {
        if (shouldOpen) {
          this.modalLogic.actions.open();
          this.playEnter();
        } else {
          void this.playExit().then(() => {
            this.modalLogic?.actions.close();
          });
        }
      }
    }

    if (name === ATTR_ANIMATED) {
      this.setupAnimation();
    }
  }

  private setupAnimation(): void {
    this.motionPlayer?.destroy();
    this.motionPlayer = null;

    if (this.hasAttribute(ATTR_ANIMATED) && this.contentEl) {
      this.motionPlayer = createMotionPlayer(this.contentEl);
    }
  }

  private playEnter(): void {
    if (!this.hasAttribute(ATTR_ANIMATED) || !this.contentEl) {
      return;
    }
    this.setupAnimation();
    void this.motionPlayer?.play('fade-zoom-in');
  }

  private async playExit(): Promise<void> {
    if (!this.hasAttribute(ATTR_ANIMATED) || !this.contentEl) {
      return;
    }
    this.setupAnimation();
    await this.motionPlayer?.play('fade-zoom-out');
  }

  private render(): void {
    const isOpen = this.modalLogic?.state.isOpen ?? false;

    if (isOpen) {
      const overlayProps = this.modalLogic?.getOverlayProps() ?? {};
      const contentProps = this.modalLogic?.getContentProps() ?? {};
      const closeProps = this.modalLogic?.getCloseButtonProps() ?? {};

      this.innerHTML = `
        <div class="and-modal-backdrop" ${this.attrString(overlayProps)}></div>
        <div class="and-modal-content" ${this.attrString(contentProps)}>
          <div class="and-modal-title" role="slot" name="title"></div>
          <div class="and-modal-body"></div>
          <button class="and-modal-close" ${this.attrString(closeProps)}>×</button>
        </div>
      `;

      this.contentEl = this.querySelector('.and-modal-content');

      const body = this.querySelector('.and-modal-body');
      if (body) {
        body.append(...this.originalContent);
      }

      const backdrop = this.querySelector('.and-modal-backdrop');
      backdrop?.addEventListener('click', () => this.modalLogic?.handleOverlayClick());

      const closeBtn = this.querySelector('.and-modal-close');
      closeBtn?.addEventListener('click', () => this.modalLogic?.actions.close());
    } else {
      this.innerHTML = '';
      this.contentEl = null;
    }
  }

  private attrString(props: Record<string, string | undefined>): string {
    return Object.entries(props)
      .filter(([, value]) => value !== undefined)
      .map(([key, value]) => `${key}="${String(value).replace(/"/g, '&quot;')}"`)
      .join(' ');
  }
}

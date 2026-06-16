import { createModal, type ModalReturn } from '@andersseen/headless-components';
import { loadMotionPlayer, type MotionPlayerLike } from '../utils/motion-loader';

const ATTR_OPEN = 'open';
const ATTR_ANIMATED = 'animated';

type AttributeValue = string | boolean | number | undefined;

/**
 * `<and-vanilla-modal>` — Vanilla custom element modal backed by the headless modal.
 *
 * Usage:
 * ```html
 * <and-vanilla-modal open animated>
 *   <h2>Hello</h2>
 *   <p>Content</p>
 * </and-vanilla-modal>
 * ```
 *
 * Motion is optional: add `animated` and install `@andersseen/motion`.
 */
export class VanillaModal extends HTMLElement {
  static observedAttributes = [ATTR_OPEN, ATTR_ANIMATED];

  private modalLogic: ModalReturn | null = null;
  private motionPlayer: MotionPlayerLike | null = null;
  private contentEl: HTMLElement | null = null;
  private originalContent: Node[] = [];
  private isClosing = false;
  private ignoreAttributeChange = false;
  private closeRequestId = 0;

  connectedCallback(): void {
    this.originalContent = Array.from(this.childNodes);
    this.innerHTML = '';

    this.modalLogic = createModal({
      defaultOpen: this.hasAttribute(ATTR_OPEN),
      onOpenChange: isOpen => {
        this.syncOpenAttribute(isOpen);
        this.render();
        if (isOpen) {
          this.playEnter();
        } else if (!this.isClosing) {
          this.dispatchEvent(new CustomEvent('andClose', { bubbles: true, composed: true }));
        }
      },
    });

    this.render();
  }

  disconnectedCallback(): void {
    this.motionPlayer?.destroy();
    this.motionPlayer = null;
  }

  attributeChangedCallback(name: string): void {
    if (!this.modalLogic) {
      return;
    }

    if (name === ATTR_OPEN && !this.ignoreAttributeChange) {
      const shouldOpen = this.hasAttribute(ATTR_OPEN);
      const isOpen = this.modalLogic.state.isOpen;
      if (shouldOpen === isOpen) {
        return;
      }
      if (shouldOpen) {
        this.open();
      } else {
        this.close();
      }
    }

    if (name === ATTR_ANIMATED) {
      this.ensureMotion();
    }
  }

  private syncOpenAttribute(isOpen: boolean): void {
    this.ignoreAttributeChange = true;
    this.toggleAttribute(ATTR_OPEN, isOpen);
    this.ignoreAttributeChange = false;
  }

  private open(): void {
    if (!this.modalLogic) {
      return;
    }
    const wasClosing = this.isClosing;

    this.closeRequestId++;
    this.isClosing = false;
    this.motionPlayer?.stop();

    if (this.modalLogic.state.isOpen) {
      if (wasClosing) {
        this.render();
        void this.playEnter();
      }
      return;
    }

    this.modalLogic.actions.open();
  }

  private close(): void {
    if (!this.modalLogic || this.isClosing || !this.modalLogic.state.isOpen) {
      return;
    }

    const requestId = ++this.closeRequestId;

    if (this.hasAttribute(ATTR_ANIMATED)) {
      this.isClosing = true;
      this.render();
      void this.playExit().then(() => this.finishClose(requestId));
    } else {
      this.finishClose(requestId);
    }
  }

  private finishClose(requestId: number): void {
    if (requestId !== this.closeRequestId) {
      return;
    }

    this.isClosing = false;

    if (this.modalLogic?.state.isOpen) {
      this.modalLogic.actions.close();
    } else {
      this.render();
    }
  }

  private async ensureMotion(): Promise<MotionPlayerLike | null> {
    if (!this.hasAttribute(ATTR_ANIMATED) || !this.contentEl) {
      return null;
    }
    if (this.motionPlayer) {
      return this.motionPlayer;
    }
    const player = await loadMotionPlayer(this.contentEl);
    if (this.hasAttribute(ATTR_ANIMATED) && this.contentEl) {
      this.motionPlayer = player;
    }
    return player;
  }

  private async playEnter(): Promise<void> {
    if (!this.hasAttribute(ATTR_ANIMATED) || !this.contentEl) {
      return;
    }
    const player = await this.ensureMotion();
    await player?.play('fade-zoom-in');
  }

  private async playExit(): Promise<void> {
    if (!this.hasAttribute(ATTR_ANIMATED) || !this.contentEl) {
      return;
    }
    const player = await this.ensureMotion();
    if (!this.isClosing) {
      return;
    }
    await player?.play('fade-zoom-out');
  }

  private render(): void {
    const isOpen = this.modalLogic?.state.isOpen ?? false;
    const shouldRender = isOpen || this.isClosing;

    if (shouldRender) {
      // The motion player is bound to a specific content element. Replacing the
      // DOM creates a new content element, so discard the old player to avoid
      // animating a detached node (which would leave the close promise pending).
      this.motionPlayer?.destroy();
      this.motionPlayer = null;

      const overlayProps = this.modalLogic?.getOverlayProps() ?? {};
      const contentProps = this.modalLogic?.getContentProps() ?? {};
      const closeProps = this.modalLogic?.getCloseButtonProps() ?? {};
      const state = this.isClosing ? 'closed' : 'open';

      this.innerHTML = `
        <div class="and-modal-backdrop" ${this.attrString({ ...overlayProps, 'data-state': state })}></div>
        <div class="and-modal-viewport" data-state="${state}">
          <div class="and-modal-content" ${this.attrString({ ...contentProps, 'data-state': state })}>
            <div class="and-modal-body"></div>
            <button class="and-modal-close" ${this.attrString(closeProps)}>×</button>
          </div>
        </div>
      `;

      this.contentEl = this.querySelector('.and-modal-content');

      const body = this.querySelector('.and-modal-body');
      if (body) {
        body.append(...this.originalContent);
      }

      const backdrop = this.querySelector('.and-modal-backdrop');
      backdrop?.addEventListener('click', () => this.close());

      const closeBtn = this.querySelector('.and-modal-close');
      closeBtn?.addEventListener('click', () => this.close());
    } else {
      this.innerHTML = '';
      this.contentEl = null;
    }
  }

  private attrString(props: Record<string, AttributeValue>): string {
    return Object.entries(props)
      .filter(([, value]) => value !== undefined)
      .map(([key, value]) => `${key}="${String(value).replace(/"/g, '&quot;')}"`)
      .join(' ');
  }
}

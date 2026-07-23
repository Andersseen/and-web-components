import { createModal, type ModalReturn } from '@andersseen/headless-components';
import { loadMotionPlayer, type MotionPlayerLike } from '../utils/motion-loader';
import { HTMLElementBase } from '../utils/env';
import { focusFirst, lockBodyScroll, trapTab, unlockBodyScroll } from '../utils/overlay';

const ATTR_OPEN = 'open';
const ATTR_ANIMATED = 'animated';
const ATTR_LABEL = 'label';

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
export class VanillaModal extends HTMLElementBase {
  static observedAttributes = [ATTR_OPEN, ATTR_ANIMATED, ATTR_LABEL];

  private modalLogic: ModalReturn | null = null;
  private motionPlayer: MotionPlayerLike | null = null;
  private contentEl: HTMLElement | null = null;
  /**
   * The author's original children, moved out of the element on first
   * connect and re-parented into the rendered body each time it opens.
   *
   * Held in a DocumentFragment and captured exactly once: `connectedCallback`
   * fires again whenever the element is moved in the DOM, and re-reading
   * `childNodes` there used to overwrite this with whatever was rendered at
   * the time (nothing, when closed) — permanently destroying the content.
   */
  private slottedContent: DocumentFragment | null = null;
  private isClosing = false;
  private ignoreAttributeChange = false;
  private closeRequestId = 0;
  private previouslyFocused: Element | null = null;
  private scrollLocked = false;

  connectedCallback(): void {
    if (!this.slottedContent) {
      const fragment = document.createDocumentFragment();
      fragment.append(...Array.from(this.childNodes));
      this.slottedContent = fragment;
    }

    if (!this.modalLogic) {
      this.modalLogic = createModal({
        defaultOpen: this.hasAttribute(ATTR_OPEN),
        label: this.getAttribute(ATTR_LABEL) || undefined,
        onOpenChange: isOpen => {
          this.syncOpenAttribute(isOpen);
          this.render();
          if (isOpen) {
            this.applyOpenSideEffects();
            this.playEnter();
          } else if (!this.isClosing) {
            this.releaseOpenSideEffects();
            this.dispatchEvent(new CustomEvent('andModalClose', { bubbles: true, composed: true }));
          }
        },
      });
    }

    document.addEventListener('keydown', this.handleKeyDown);
    this.render();
    if (this.modalLogic.state.isOpen) {
      this.applyOpenSideEffects();
    }
  }

  disconnectedCallback(): void {
    document.removeEventListener('keydown', this.handleKeyDown);
    this.releaseOpenSideEffects();
    this.motionPlayer?.destroy();
    this.motionPlayer = null;
  }

  /**
   * Escape-to-close (delegated to the headless logic, which owns the
   * `closeOnEscape` policy) plus Tab containment while open. Nothing was
   * listening for keydown before, so neither worked.
   */
  private handleKeyDown = (event: KeyboardEvent): void => {
    if (!this.modalLogic?.state.isOpen) {
      return;
    }
    this.modalLogic.handleKeyDown(event);
    if (this.contentEl) {
      trapTab(event, this.contentEl);
    }
  };

  private applyOpenSideEffects(): void {
    if (!this.scrollLocked) {
      lockBodyScroll();
      this.scrollLocked = true;
    }
    this.previouslyFocused = document.activeElement;
    this.syncAccessibleName();
    if (this.contentEl) {
      focusFirst(this.contentEl);
    }
  }

  private releaseOpenSideEffects(): void {
    if (this.scrollLocked) {
      unlockBodyScroll();
      this.scrollLocked = false;
    }
    if (this.previouslyFocused instanceof HTMLElement && this.previouslyFocused.isConnected) {
      this.previouslyFocused.focus();
    }
    this.previouslyFocused = null;
  }

  /**
   * Prefer the `label` attribute; otherwise adopt a slotted heading as
   * `aria-labelledby` so the dialog gets a real accessible name from the
   * markup an author would write anyway.
   */
  private syncAccessibleName(): void {
    const dialog = this.contentEl;
    if (!dialog) {
      return;
    }
    const label = this.getAttribute(ATTR_LABEL);
    if (label) {
      dialog.setAttribute('aria-label', label);
      dialog.removeAttribute('aria-labelledby');
      return;
    }
    const heading = dialog.querySelector<HTMLElement>('h1, h2, h3, h4, h5, h6');
    if (!heading) {
      return;
    }
    if (!heading.id) {
      heading.id = `and-vanilla-modal-title-${Math.random().toString(36).slice(2, 9)}`;
    }
    dialog.setAttribute('aria-labelledby', heading.id);
    dialog.removeAttribute('aria-label');
  }

  attributeChangedCallback(name: string): void {
    if (!this.modalLogic) {
      return;
    }

    if (name === ATTR_LABEL) {
      this.syncAccessibleName();
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

    // Reclaim the author's nodes before any innerHTML wipe below.
    this.stashSlottedContent();

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
      if (body && this.slottedContent) {
        // Moves every child out of the fragment in one go; the fragment is
        // left empty and refilled by stashSlottedContent() before the next
        // innerHTML wipe, so the author's nodes are never discarded.
        body.append(this.slottedContent);
      }
      this.syncAccessibleName();

      const backdrop = this.querySelector('.and-modal-backdrop');
      backdrop?.addEventListener('click', () => this.close());

      const closeBtn = this.querySelector('.and-modal-close');
      closeBtn?.addEventListener('click', () => this.close());
    } else {
      this.innerHTML = '';
      this.contentEl = null;
    }
  }

  /**
   * Move whatever the author slotted back out of the rendered body and into
   * the holding fragment, so the next `innerHTML` assignment cannot destroy
   * it. Safe to call when nothing is rendered.
   */
  private stashSlottedContent(): void {
    const body = this.querySelector('.and-modal-body');
    if (!body || !this.slottedContent) {
      return;
    }
    this.slottedContent.append(...Array.from(body.childNodes));
  }

  private attrString(props: Record<string, AttributeValue>): string {
    return Object.entries(props)
      .filter(([, value]) => value !== undefined)
      .map(([key, value]) => `${key}="${String(value).replace(/"/g, '&quot;')}"`)
      .join(' ');
  }
}

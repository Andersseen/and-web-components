import { Component, Prop, h, Host, Event, EventEmitter, Listen, Watch, Element } from '@stencil/core';
import { cva } from 'class-variance-authority';
import { createModal, type ModalReturn } from '@andersseen/headless-components';
import { cn } from '../../utils/cn';
import { applyGlobalAnimationFlag } from '../../utils/animation-config';

/* ────────────────────────────────────────────────────────────────────
 * Variants
 * ──────────────────────────────────────────────────────────────────── */

const overlayClass = [
  'and-modal-backdrop fixed inset-0 z-50 bg-foreground/80 backdrop-blur-sm',
].join(' ');

const contentVariants = cva(
  [
    'and-modal-content relative z-50 grid w-full max-w-lg gap-4 border border-border bg-background p-6 shadow-lg pointer-events-auto',
    'rounded-lg',
  ].join(' '),
);

const closeButtonClass = [
  'absolute right-4 top-4 rounded-sm opacity-70',
  'ring-offset-background transition-opacity',
  'hover:opacity-100',
  'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  'disabled:pointer-events-none',
].join(' ');

/* ────────────────────────────────────────────────────────────────────
 * Component
 * ──────────────────────────────────────────────────────────────────── */

@Component({
  tag: 'and-modal',
  styleUrls: ['and-modal.css', '../../global/global.css'],
  shadow: true,
})
export class AndModal {
  @Element() el: HTMLElement;

  /** Whether the modal is open. */
  @Prop({ reflect: true, mutable: true }) open: boolean = false;

  /** Emitted when the modal is closed. */
  @Event({ bubbles: true, composed: true }) andClose: EventEmitter<void>;

  private modalLogic: ModalReturn;

  /* ── Lifecycle ──────────────────────────────────────────────────── */

  componentWillLoad() {
    applyGlobalAnimationFlag(this.el);
    this.modalLogic = createModal({
      defaultOpen: this.open,
      onOpenChange: (isOpen: boolean) => {
        this.open = isOpen;
        if (!isOpen) {
          this.andClose.emit();
        }
      },
    });
  }

  /* ── Watchers ───────────────────────────────────────────────────── */

  @Watch('open')
  openChanged(newValue: boolean) {
    if (newValue) {
      this.modalLogic.actions.open();
    } else {
      this.modalLogic.actions.close();
    }
  }

  /* ── Keyboard ───────────────────────────────────────────────────── */

  @Listen('keydown', { target: 'window' })
  handleKeyDown(ev: KeyboardEvent) {
    this.modalLogic.handleKeyDown(ev);
  }

  /* ── Render ─────────────────────────────────────────────────────── */

  render() {
    if (!this.open) return <Host />;

    const overlayProps = this.modalLogic.getOverlayProps();
    const contentProps = this.modalLogic.getContentProps();
    const closeButtonProps = this.modalLogic.getCloseButtonProps();

    return (
      <Host>
        {/* Backdrop */}
        <div
          class={overlayClass}
          {...overlayProps}
          onClick={() => this.modalLogic.handleOverlayClick()}
        />

        {/* Modal Container */}
        <div class="fixed inset-0 z-50 flex items-center justify-center pointer-events-none p-4">
          <div class={cn(contentVariants())} data-state="open" {...contentProps}>
            <div class="flex flex-col gap-4">
              <slot />
              <button
                class={closeButtonClass}
                onClick={() => this.modalLogic.actions.close()}
                {...closeButtonProps}
              >
                <and-icon name="close" class="h-4 w-4" />
                <span class="sr-only">Close</span>
              </button>
            </div>
          </div>
        </div>
      </Host>
    );
  }
}

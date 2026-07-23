import { Component, Prop, h, Host, Event, EventEmitter, Listen, Watch, Element, State, Method } from '@stencil/core';
import { createModal, type ModalReturn } from '@andersseen/headless-components';
import { cn } from '../../utils/cn';
import { applyGlobalAnimationFlag, isAnimationsEnabled } from '../../utils/animation-config';
import { focusFirst, handleTabInFocusTrap } from '../../utils/focus-trap';
import { lockBodyScroll, unlockBodyScroll, setBackgroundInert } from '../../utils/overlay-page';
import { createOpenCloseAnimation } from '../../utils/animation';
import { overlayVariants, contentVariants, closeButtonVariants } from './and-modal-variants';

/**
 * Centered dialog (`role="dialog"`, `aria-modal="true"`) with a focus
 * trap that spans slotted content, Escape-to-close, backdrop click, body
 * scroll lock, an inert background, and focus restoration on close.
 * Renders nothing (`<Host />`, no DOM) while closed.
 *
 * Give every modal an accessible name: either set `label`, or slot a
 * heading (`<h1>`–`<h6>`) as the first element — it is wired up as
 * `aria-labelledby` automatically.
 *
 * @example
 * ```html
 * <and-modal open="true" animated="true">
 *   <h2>Confirm</h2>
 *   <p>Are you sure?</p>
 * </and-modal>
 * ```
 */
@Component({
  tag: 'and-modal',
  styleUrls: ['and-modal.css', '../../global/component-base.css', '../../global/animations.css'],
  shadow: true,
})
export class AndModal {
  @Element() el!: HTMLElement;

  /** Whether the modal is open. */
  @Prop({ reflect: true, mutable: true }) open: boolean = false;

  /** Whether to animate the modal entrance and exit. */
  @Prop({ reflect: true }) animated: boolean = false;

  /**
   * Accessible name for the dialog. When empty, a slotted heading is used
   * via `aria-labelledby` instead.
   */
  @Prop() label: string = '';

  /** Whether pressing Escape closes the modal. */
  @Prop() closeOnEscape: boolean = true;

  /** Whether clicking the backdrop closes the modal. */
  @Prop() closeOnOverlayClick: boolean = true;

  /** Hides the built-in close button when true. */
  @Prop() hideClose: boolean = false;

  /** Emitted when the modal is closed. Fires exactly once per close. */
  @Event({ bubbles: true, composed: true }) andModalClose!: EventEmitter<void>;

  @State() private isClosing = false;
  @State() private labelledById: string | undefined;

  private modalLogic!: ModalReturn;
  private previouslyFocused: Element | null = null;
  /** Re-entrancy guard: the close sequence writes `open`, which re-enters the watcher. */
  private closeInProgress = false;
  private releaseInert: (() => void) | null = null;
  private scrollLocked = false;
  /** Set on open, consumed by componentDidRender once the content exists. */
  private pendingOpenFocus = false;
  private animation = createOpenCloseAnimation(
    () => this.el.shadowRoot?.querySelector<HTMLElement>('.and-modal-content') ?? null,
    'modal',
    {
      onExitEnd: () => this.finalizeClose(),
    },
  );

  /* ── Lifecycle ──────────────────────────────────────────────────── */

  componentWillLoad() {
    applyGlobalAnimationFlag(this.el);
    if (isAnimationsEnabled()) {
      this.animated = true;
    }
    // `closeOnEscape` / `closeOnOverlayClick` are enabled in the headless
    // config and gated here instead, so toggling the props at runtime takes
    // effect (the headless reads its config once, at creation).
    this.modalLogic = createModal({
      defaultOpen: this.open,
      label: this.label || undefined,
      closeOnEscape: true,
      closeOnOverlayClick: true,
      onOpenChange: (isOpen: boolean) => {
        if (isOpen) {
          this.open = true;
        } else {
          this.beginClose();
        }
      },
    });
  }

  componentDidLoad() {
    if (this.open) {
      // Opened via the initial attribute: the @Watch never fires, and
      // componentDidRender has already run for this render pass, so flush
      // the deferred work here instead.
      this.applyOpenSideEffects();
      this.flushPendingOpen();
    }
  }

  disconnectedCallback() {
    this.releaseSideEffects();
    this.closeInProgress = false;
    if (this.open) {
      this.modalLogic.actions.close();
    }
  }

  /* ── Public API ─────────────────────────────────────────────────── */

  /** Open the modal imperatively. */
  @Method()
  async show(): Promise<void> {
    this.open = true;
  }

  /** Close the modal imperatively, running the exit animation if enabled. */
  @Method()
  async hide(): Promise<void> {
    this.beginClose();
  }

  /* ── Watchers ───────────────────────────────────────────────────── */

  @Watch('open')
  openChanged(newValue: boolean) {
    if (newValue) {
      if (this.closeInProgress) {
        return;
      }
      this.modalLogic.actions.open();
      this.applyOpenSideEffects();
    } else {
      this.beginClose();
    }
  }

  @Watch('label')
  labelChanged() {
    this.syncAccessibleName();
  }

  /* ── Open / close sequencing ────────────────────────────────────── */

  private applyOpenSideEffects() {
    this.isClosing = false;
    this.previouslyFocused = document.activeElement;

    if (!this.scrollLocked) {
      lockBodyScroll();
      this.scrollLocked = true;
    }
    this.releaseInert?.();
    this.releaseInert = setBackgroundInert(this.el);

    // Focus and the enter animation both need the dialog content to exist.
    // A bare requestAnimationFrame is not enough — Stencil schedules its
    // render asynchronously, so the frame can fire while the shadow root is
    // still empty (which silently left focus on <body>). Defer to
    // componentDidRender instead, which runs after the DOM is committed.
    this.pendingOpenFocus = true;
  }

  componentDidRender() {
    this.flushPendingOpen();
  }

  private flushPendingOpen() {
    if (!this.pendingOpenFocus || !this.open) {
      return;
    }
    this.pendingOpenFocus = false;
    this.syncAccessibleName();
    this.trapFocus();
    if (this.animated) {
      void this.animation.enter();
    }
  }

  /**
   * Start closing. Idempotent: repeated calls while an exit animation is
   * running are ignored, so `andModalClose` fires exactly once per close.
   */
  private beginClose() {
    if (this.closeInProgress) {
      return;
    }
    this.closeInProgress = true;

    if (this.animated && this.open) {
      this.isClosing = true;
      void this.animation.exit(); // → onExitEnd → finalizeClose()
    } else {
      this.finalizeClose();
    }
  }

  private finalizeClose() {
    this.isClosing = false;
    this.open = false; // re-enters openChanged → beginClose() → guarded above
    this.modalLogic.actions.close();
    this.releaseSideEffects();
    this.restoreFocus();
    this.andModalClose.emit();
    this.closeInProgress = false;
  }

  private releaseSideEffects() {
    if (this.scrollLocked) {
      unlockBodyScroll();
      this.scrollLocked = false;
    }
    this.releaseInert?.();
    this.releaseInert = null;
  }

  /* ── Accessible name ────────────────────────────────────────────── */

  /**
   * Prefer an explicit `label`; otherwise adopt a slotted heading as the
   * dialog's `aria-labelledby` target so authors get a correct accessible
   * name from the markup they'd write anyway.
   */
  private syncAccessibleName() {
    if (this.label) {
      this.labelledById = undefined;
      return;
    }
    const heading = this.el.querySelector<HTMLElement>('h1, h2, h3, h4, h5, h6');
    if (!heading) {
      this.labelledById = undefined;
      return;
    }
    if (!heading.id) {
      heading.id = `and-modal-title-${Math.random().toString(36).slice(2, 9)}`;
    }
    this.labelledById = heading.id;
  }

  /* ── Focus Trap ─────────────────────────────────────────────────── */

  private getTrapRoot(): HTMLElement | ShadowRoot {
    return this.el.shadowRoot ?? this.el;
  }

  private trapFocus() {
    if (!this.open) {
      return;
    }
    if (!focusFirst(this.getTrapRoot())) {
      // Nothing focusable inside — focus the dialog itself so the trap
      // still has an anchor and screen readers land in the right place.
      this.el.shadowRoot?.querySelector<HTMLElement>('.and-modal-content')?.focus();
    }
  }

  private restoreFocus() {
    if (this.previouslyFocused instanceof HTMLElement && this.previouslyFocused.isConnected) {
      this.previouslyFocused.focus();
    }
    this.previouslyFocused = null;
  }

  /* ── Keyboard ───────────────────────────────────────────────────── */

  @Listen('keydown', { target: 'window' })
  handleKeyDown(ev: KeyboardEvent) {
    if (!this.open && !this.isClosing) {
      return;
    }

    if (this.closeOnEscape) {
      this.modalLogic.handleKeyDown(ev);
    }
    handleTabInFocusTrap(ev, this.getTrapRoot());
  }

  /* ── Render ─────────────────────────────────────────────────────── */

  render() {
    if (!this.open && !this.isClosing) {
      return <Host />;
    }

    const overlayProps = this.modalLogic.getOverlayProps();
    const contentProps = this.modalLogic.getContentProps();
    const closeButtonProps = this.modalLogic.getCloseButtonProps();
    const state = this.isClosing ? 'closed' : 'open';

    return (
      <Host animated={this.animated}>
        {/* Backdrop */}
        <div
          part="overlay"
          class={cn(overlayVariants())}
          {...overlayProps}
          onClick={() => this.closeOnOverlayClick && this.modalLogic.handleOverlayClick()}
          data-state={state}
        />

        {/* Modal Container */}
        <div part="container" class="fixed inset-0 z-50 flex items-center justify-center pointer-events-none p-4">
          <div
            part="content"
            class={cn(contentVariants())}
            data-state={state}
            {...contentProps}
            aria-label={this.labelledById ? undefined : this.label || 'Dialog'}
            aria-labelledby={this.labelledById}
          >
            <div class="flex flex-col gap-4">
              <slot onSlotchange={() => this.syncAccessibleName()} />
              {!this.hideClose && (
                <button
                  part="close-button"
                  class={cn(closeButtonVariants())}
                  onClick={() => this.modalLogic.actions.close()}
                  {...closeButtonProps}
                >
                  <and-icon name="close" class="h-4 w-4" />
                  <span class="sr-only">Close</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </Host>
    );
  }
}

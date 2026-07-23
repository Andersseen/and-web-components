import { Component, Prop, h, Host, Event, EventEmitter, Watch, Listen, State, Element } from '@stencil/core';
import { cn } from '../../utils/cn';
import { createDrawer, type DrawerPlacement, type DrawerReturn } from '@andersseen/headless-components';
import { applyGlobalAnimationFlag } from '../../utils/animation-config';
import { focusFirst, handleTabInFocusTrap } from '../../utils/focus-trap';
import { lockBodyScroll, unlockBodyScroll, setBackgroundInert } from '../../utils/overlay-page';
import { overlayVariants, contentVariants, closeBtnVariants } from './and-drawer-variants';

/**
 * Off-canvas panel that slides in from an edge of the screen, with a
 * focus trap, Escape-to-close, backdrop click, and focus restoration to
 * whatever was focused before it opened — all handled for you via the
 * shared headless drawer logic.
 *
 * @example
 * ```html
 * <and-drawer placement="right" label="Settings">
 *   <span slot="header">Settings</span>
 *   Drawer content
 * </and-drawer>
 * ```
 */
@Component({
  tag: 'and-drawer',
  styleUrls: ['and-drawer.css', '../../global/component-base.css', '../../global/animations.css'],
  shadow: true,
})
export class AndDrawer {
  @Element() el!: HTMLElement;

  /**
   * Whether the drawer is open.
   */
  @Prop({ reflect: true, mutable: true }) open: boolean = false;

  /**
   * The direction the drawer slides in from.
   */
  @Prop({ reflect: true }) placement: DrawerPlacement = 'left';

  /**
   * Whether to show the default close button in the header.
   */
  @Prop() showClose: boolean = true;

  /**
   * Accessible label for the drawer.
   */
  @Prop() label: string = '';

  /** Emitted when the drawer is closed (backdrop click, close button, or Escape). */
  @Event({ bubbles: true, composed: true }) andDrawerClose!: EventEmitter<void>;

  /** Emitted when the drawer is opened. */
  @Event({ bubbles: true, composed: true }) andDrawerOpen!: EventEmitter<void>;

  @State() private isOpen: boolean = false;

  /**
   * When true, suppresses the slide transition so placement
   * changes while closed don't cause a visible cross-slide.
   */
  @State() private skipTransition: boolean = false;

  private drawer!: DrawerReturn;

  /** Guard against stale rAF callbacks from rapid open/close toggling. */
  private openSeq: number = 0;

  private previouslyFocused: Element | null = null;

  private releaseInert: (() => void) | null = null;

  private scrollLocked = false;

  /* ── Lifecycle ──────────────────────────────────────────────────── */

  componentWillLoad() {
    applyGlobalAnimationFlag(this.el);
    this.drawer = createDrawer({
      defaultOpen: this.open,
      placement: this.placement,
      label: this.label,
      onOpenChange: isOpen => {
        this.isOpen = isOpen;
        this.open = isOpen;
        if (isOpen) {
          this.applyPageSideEffects();
          this.andDrawerOpen.emit();
        } else {
          this.releasePageSideEffects();
          this.andDrawerClose.emit();
        }
      },
    });
    this.isOpen = this.open;
  }

  /* ── Watchers ───────────────────────────────────────────────────── */

  @Watch('open')
  async openChanged(newValue: boolean) {
    if (newValue === this.isOpen) {
      return;
    }

    if (newValue) {
      // Phase 1 — position the panel at the correct off-screen spot
      // with NO transition so it doesn't slide from the old placement.
      const seq = ++this.openSeq;
      this.skipTransition = true;

      // Wait two frames so the browser paints the closed position first.
      await new Promise<void>(r => requestAnimationFrame(() => r()));
      await new Promise<void>(r => requestAnimationFrame(() => r()));

      // Bail if user already toggled again while we waited.
      if (seq !== this.openSeq) {
        return;
      }

      // Phase 2 — re-enable the transition and open.
      this.skipTransition = false;
      this.previouslyFocused = document.activeElement;
      this.drawer.actions.open();

      // Focus the first focusable element once the panel is visible.
      requestAnimationFrame(() => focusFirst(this.getTrapRoot()));
    } else {
      // Close: always animate.
      this.openSeq++;
      this.skipTransition = false;
      this.drawer.actions.close();
      this.restoreFocus();
    }
  }

  @Watch('placement')
  placementChanged(newValue: DrawerPlacement) {
    this.drawer.actions.setPlacement(newValue);

    // When placement changes while closed, kill the transition
    // so the panel jumps to its new off-screen position instantly.
    if (!this.isOpen) {
      this.skipTransition = true;
    }
  }

  /* ── Focus Trap ─────────────────────────────────────────────────── */

  private getTrapRoot(): HTMLElement | ShadowRoot {
    return this.el.shadowRoot ?? this.el;
  }

  /* ── Page side effects ──────────────────────────────────────────── */

  private applyPageSideEffects() {
    if (!this.scrollLocked) {
      lockBodyScroll();
      this.scrollLocked = true;
    }
    this.releaseInert?.();
    this.releaseInert = setBackgroundInert(this.el);
  }

  private releasePageSideEffects() {
    if (this.scrollLocked) {
      unlockBodyScroll();
      this.scrollLocked = false;
    }
    this.releaseInert?.();
    this.releaseInert = null;
  }

  private restoreFocus() {
    if (this.previouslyFocused instanceof HTMLElement) {
      this.previouslyFocused.focus();
      this.previouslyFocused = null;
    }
  }

  /* ── Keyboard ───────────────────────────────────────────────────── */

  @Listen('keydown', { target: 'window' })
  handleKeyDown(ev: KeyboardEvent) {
    this.drawer.handleKeyDown(ev);

    if (!this.isOpen) {
      return;
    }

    handleTabInFocusTrap(ev, this.getTrapRoot());
  }

  /* ── Lifecycle Cleanup ──────────────────────────────────────────── */

  disconnectedCallback() {
    // Close drawer on unmount to prevent memory leaks and restore body scroll
    if (this.open) {
      this.drawer.actions.close();
      this.restoreFocus();
    }
    this.releasePageSideEffects();
  }

  /* ── Render ─────────────────────────────────────────────────────── */

  render() {
    const overlayProps = this.drawer.getOverlayProps();
    const contentProps = this.drawer.getContentProps();
    const closeButtonProps = this.drawer.getCloseButtonProps();
    return (
      <Host>
        {/* Overlay */}
        <div
          class={cn(overlayVariants({ open: this.isOpen }))}
          style={this.skipTransition ? { transition: 'none' } : undefined}
          {...overlayProps}
          onClick={() => this.drawer.handleOverlayClick()}
        />

        {/* Content panel */}
        <div
          class={cn(contentVariants({ placement: this.placement, open: this.isOpen, animate: !this.skipTransition }))}
          style={this.skipTransition ? { transition: 'none' } : undefined}
          {...contentProps}
        >
          {/* Header */}
          <div class="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
            <div class="flex flex-col gap-1 min-w-0">
              <slot name="header" />
            </div>
            {this.showClose && (
              <button class={cn(closeBtnVariants())} onClick={() => this.drawer.actions.close()} {...closeButtonProps}>
                <slot name="close-icon">
                  <and-icon name="close" size="16" />
                </slot>
                <span class="sr-only">Close</span>
              </button>
            )}
          </div>

          {/* Body */}
          <div class="flex-1 px-5 py-4 overflow-y-auto">
            <slot />
          </div>

          {/* Footer */}
          <div class="px-5 py-4 border-t border-border shrink-0">
            <slot name="footer" />
          </div>
        </div>
      </Host>
    );
  }
}

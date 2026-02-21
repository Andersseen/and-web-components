import { Component, Prop, h, Host, Event, EventEmitter, Watch, Listen, State, Element } from '@stencil/core';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';
import { createDrawer, type DrawerPlacement, type DrawerReturn } from '@andersseen/headless-components';
import { applyGlobalAnimationFlag } from '../../utils/animation-config';

/* ────────────────────────────────────────────────────────────────────
 * Variants
 * ──────────────────────────────────────────────────────────────────── */

const overlayVariants = cva(
  'and-drawer-overlay fixed inset-0 z-[9999] bg-foreground/60',
  {
    variants: {
      open: {
        true: 'opacity-100 pointer-events-auto',
        false: 'opacity-0 pointer-events-none',
      },
    },
    defaultVariants: { open: false },
  },
);

const contentVariants = cva(
  'and-drawer-content fixed z-[10000] flex flex-col bg-background shadow-xl outline-none overflow-y-auto overflow-x-hidden',
  {
    variants: {
      placement: {
        left: 'top-0 left-0 bottom-0 w-[min(85vw,20rem)] border-r border-border',
        right: 'top-0 right-0 bottom-0 w-[min(85vw,20rem)] border-l border-border',
        top: 'top-0 left-0 right-0 max-h-[50vh] border-b border-border',
        bottom: 'bottom-0 left-0 right-0 max-h-[50vh] border-t border-border',
      },
      open: {
        true: 'translate-x-0 translate-y-0',
        false: '',
      },
      animate: {
        true: '',
        false: '',
      },
    },
    compoundVariants: [
      { placement: 'left', open: false, class: '-translate-x-full' },
      { placement: 'right', open: false, class: 'translate-x-full' },
      { placement: 'top', open: false, class: '-translate-y-full' },
      { placement: 'bottom', open: false, class: 'translate-y-full' },
    ],
    defaultVariants: {
      placement: 'left',
      open: false,
      animate: true,
    },
  },
);

const closeBtnVariants = cva(
  [
    'inline-flex items-center justify-center w-8 h-8 shrink-0',
    'border-none bg-transparent rounded-md cursor-pointer',
    'text-muted-foreground transition-colors duration-150',
    'hover:bg-accent hover:text-foreground',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
  ].join(' '),
);

export type DrawerVariantProps = VariantProps<typeof contentVariants>;

/* ────────────────────────────────────────────────────────────────────
 * Component
 * ──────────────────────────────────────────────────────────────────── */

@Component({
  tag: 'and-drawer',
  styleUrls: ['and-drawer.css', '../../global/global.css'],
  shadow: true,
})
export class AndDrawer {
  @Element() el: HTMLElement;

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

  /** Emitted when the drawer is closed (backdrop click, close button, or Escape). */
  @Event({ bubbles: true, composed: true }) andDrawerClose: EventEmitter<void>;

  /** Emitted when the drawer is opened. */
  @Event({ bubbles: true, composed: true }) andDrawerOpen: EventEmitter<void>;

  @State() private isOpen: boolean = false;

  /**
   * When true, suppresses the slide transition so placement
   * changes while closed don't cause a visible cross-slide.
   */
  @State() private skipTransition: boolean = false;

  private drawer: DrawerReturn;

  /** Guard against stale rAF callbacks from rapid open/close toggling. */
  private openSeq: number = 0;

  /* ── Lifecycle ──────────────────────────────────────────────────── */

  componentWillLoad() {
    applyGlobalAnimationFlag(this.el);
    this.drawer = createDrawer({
      defaultOpen: this.open,
      placement: this.placement,
      onOpenChange: (isOpen) => {
        this.isOpen = isOpen;
        this.open = isOpen;
        if (isOpen) {
          document.body.style.overflow = 'hidden';
          this.andDrawerOpen.emit();
        } else {
          document.body.style.overflow = '';
          this.andDrawerClose.emit();
        }
      },
    });
    this.isOpen = this.open;
  }

  /* ── Watchers ───────────────────────────────────────────────────── */

  @Watch('open')
  async openChanged(newValue: boolean) {
    if (newValue === this.isOpen) return;

    if (newValue) {
      // Phase 1 — position the panel at the correct off-screen spot
      // with NO transition so it doesn't slide from the old placement.
      const seq = ++this.openSeq;
      this.skipTransition = true;

      // Wait two frames so the browser paints the closed position first.
      await new Promise<void>(r => requestAnimationFrame(() => r()));
      await new Promise<void>(r => requestAnimationFrame(() => r()));

      // Bail if user already toggled again while we waited.
      if (seq !== this.openSeq) return;

      // Phase 2 — re-enable the transition and open.
      this.skipTransition = false;
      this.drawer.actions.open();
    } else {
      // Close: always animate.
      this.openSeq++;
      this.skipTransition = false;
      this.drawer.actions.close();
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

  /* ── Keyboard ───────────────────────────────────────────────────── */

  @Listen('keydown', { target: 'window' })
  handleKeyDown(ev: KeyboardEvent) {
    this.drawer.handleKeyDown(ev);
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
          {...overlayProps}
          onClick={() => this.drawer.handleOverlayClick()}
        />

        {/* Content panel */}
        <div
          class={cn(contentVariants({ placement: this.placement, open: this.isOpen, animate: !this.skipTransition }))}
          {...contentProps}
        >
          {/* Header */}
          <div class="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
            <div class="flex flex-col gap-1 min-w-0">
              <slot name="header" />
            </div>
            {this.showClose && (
              <button
                class={cn(closeBtnVariants())}
                onClick={() => this.drawer.actions.close()}
                {...closeButtonProps}
              >
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

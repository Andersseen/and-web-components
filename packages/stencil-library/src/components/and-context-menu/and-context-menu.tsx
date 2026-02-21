import { Component, Host, h, Prop, State, Element, Event, EventEmitter, Listen } from '@stencil/core';
import { cn } from '../../utils/cn';

/* ────────────────────────────────────────────────────────────────────
 * Base Styles
 * ──────────────────────────────────────────────────────────────────── */

const contextMenuPanelClass = [
  'absolute z-50 min-w-[8rem] overflow-hidden',
  'rounded-md border border-border',
  'bg-popover text-popover-foreground',
  'shadow-md',
  'transition-opacity duration-normal',
].join(' ');

/* ────────────────────────────────────────────────────────────────────
 * Component
 * ──────────────────────────────────────────────────────────────────── */

@Component({
  tag: 'and-context-menu',
  styleUrls: ['and-context-menu.css', '../../global/global.css'],
  shadow: true,
})
export class AndContextMenu {
  @Element() el: HTMLElement;

  /** Whether the context menu is currently open (controlled). */
  @Prop({ mutable: true, reflect: true }) open: boolean = false;

  /** Additional CSS classes to merge with internal styles. */
  @Prop({ attribute: 'class' }) customClass: string;

  /** Emitted when the open state changes. */
  @Event({ bubbles: true, composed: true }) andContextMenuOpenChange: EventEmitter<boolean>;

  @State() private posX: number = 0;
  @State() private posY: number = 0;

  /* ── Lifecycle ──────────────────────────────────────────────────── */

  componentDidLoad() {
    // Listen to the trigger area for right-click
    const triggerSlot = this.el.shadowRoot?.querySelector<HTMLSlotElement>('slot[name="trigger"]');
    if (triggerSlot) {
      triggerSlot.addEventListener('slotchange', () => {
        this.attachTriggerListeners();
      });
    }
    this.attachTriggerListeners();
  }

  disconnectedCallback() {
    this.detachTriggerListeners();
  }

  /* ── Trigger handling ───────────────────────────────────────────── */

  private triggerEls: Element[] = [];

  private attachTriggerListeners() {
    this.detachTriggerListeners();

    const slot = this.el.shadowRoot?.querySelector<HTMLSlotElement>('slot[name="trigger"]');
    if (slot) {
      this.triggerEls = slot.assignedElements();
    }
    // Fallback: also listen on the host's light-DOM children
    if (!this.triggerEls.length) {
      this.triggerEls = Array.from(this.el.children).filter(
        el => !el.slot || el.slot === 'trigger',
      );
    }

    this.triggerEls.forEach(el => {
      el.addEventListener('contextmenu', this.handleContextMenu as EventListener);
    });
  }

  private detachTriggerListeners() {
    this.triggerEls.forEach(el => {
      el.removeEventListener('contextmenu', this.handleContextMenu as EventListener);
    });
    this.triggerEls = [];
  }

  /* ── Handlers ───────────────────────────────────────────────────── */

  private handleContextMenu = (e: MouseEvent) => {
    e.preventDefault();

    const rect = this.el.getBoundingClientRect();
    this.posX = e.clientX - rect.left;
    this.posY = e.clientY - rect.top;

    this.setOpen(true);
  };

  @Listen('click', { target: 'window' })
  handleWindowClick() {
    if (this.open) {
      this.setOpen(false);
    }
  }

  @Listen('keydown', { target: 'window' })
  handleKeyDown(e: KeyboardEvent) {
    if (this.open && e.key === 'Escape') {
      e.preventDefault();
      this.setOpen(false);
    }
  }

  private setOpen(value: boolean) {
    this.open = value;
    this.andContextMenuOpenChange.emit(value);
  }

  /* ── Render ─────────────────────────────────────────────────────── */

  render() {
    const panelClasses = cn(
      contextMenuPanelClass,
      this.open ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none',
      this.customClass,
    );

    return (
      <Host>
        {/* Trigger area */}
        <div class="contents">
          <slot name="trigger" />
        </div>

        {/* Floating context-menu panel */}
        <div
          role="menu"
          aria-label="Context menu"
          data-state={this.open ? 'open' : 'closed'}
          class={panelClasses}
          style={{
            top: `${this.posY}px`,
            left: `${this.posX}px`,
          }}
          onClick={(e: MouseEvent) => e.stopPropagation()}
        >
          <slot />
        </div>
      </Host>
    );
  }
}

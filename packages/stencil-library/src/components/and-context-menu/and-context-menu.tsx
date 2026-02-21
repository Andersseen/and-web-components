import { Component, Host, h, Prop, State, Element, Event, EventEmitter, Listen } from '@stencil/core';
import { cn } from '../../utils/cn';
import { createContextMenu, type ContextMenuReturn } from '@andersseen/headless-components';

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
  @State() private contextMenuLogic: ContextMenuReturn;

  /* ── Lifecycle ──────────────────────────────────────────────────── */

  componentWillLoad() {
    this.contextMenuLogic = createContextMenu({
      closeOnSelect: true,
      onOpenChange: (isOpen: boolean) => {
        this.open = isOpen;
        this.andContextMenuOpenChange.emit(isOpen);
      },
      onPosition: (pos) => {
        this.posX = pos.x;
        this.posY = pos.y;
      },
    });
  }

  componentDidLoad() {
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
    const rect = this.el.getBoundingClientRect();
    this.contextMenuLogic?.handleContextMenu(e, rect);
  };

  @Listen('click', { target: 'window' })
  handleWindowClick() {
    if (this.open) {
      this.contextMenuLogic?.actions.close();
    }
  }

  @Listen('keydown', { target: 'window' })
  handleKeyDown(e: KeyboardEvent) {
    this.contextMenuLogic?.handleKeyDown(e);
  }

  /* ── Render ─────────────────────────────────────────────────────── */

  render() {
    const triggerProps = this.contextMenuLogic?.getTriggerProps() || {};
    const panelProps = this.contextMenuLogic?.getPanelProps('Context menu') || {};

    const panelClasses = cn(
      contextMenuPanelClass,
      this.open ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none',
      this.customClass,
    );

    return (
      <Host>
        {/* Trigger area */}
        <div class="contents" {...triggerProps}>
          <slot name="trigger" />
        </div>

        {/* Floating context-menu panel */}
        <div
          {...panelProps}
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

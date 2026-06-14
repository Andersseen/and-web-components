import { Component, Host, h, Prop, State, Element, Event, EventEmitter, Listen, Watch } from '@stencil/core';
import { cn } from '../../utils/cn';
import { createContextMenu, type ContextMenuReturn } from '@andersseen/headless-components';

export type ContextMenuItem = {
  text: string;
  value: string;
  disabled?: boolean;
};

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
  styleUrls: ['and-context-menu.css', '../../global/component-base.css'],
  shadow: true,
})
export class AndContextMenu {
  @Element() el: HTMLElement;

  /** Whether the context menu is currently open (controlled). */
  @Prop({ mutable: true, reflect: true }) open: boolean = false;

  /** Optional items to render in the context menu. When provided, keyboard navigation is enabled. */
  @Prop() items: ContextMenuItem[] = [];

  /** Accessible label for the context menu panel. */
  @Prop() menuLabel: string = 'Context menu';

  /** Additional CSS classes to merge with internal styles. */
  @Prop({ attribute: 'class' }) customClass: string;

  /** Emitted when the open state changes. */
  @Event({ bubbles: true, composed: true }) andContextMenuOpenChange: EventEmitter<boolean>;

  /** Emitted when an item is selected. */
  @Event({ bubbles: true, composed: true }) andContextMenuSelect: EventEmitter<string>;

  @State() private posX: number = 0;
  @State() private posY: number = 0;
  @State() private contextMenuLogic: ContextMenuReturn;
  @State() private focusedIndex: number = -1;

  private itemRefs = new Map<number, HTMLDivElement>();

  /* ── Lifecycle ──────────────────────────────────────────────────── */

  componentWillLoad() {
    this.contextMenuLogic = createContextMenu({
      closeOnSelect: true,
      onOpenChange: (isOpen: boolean) => {
        this.open = isOpen;
        if (!isOpen) {
          this.focusedIndex = -1;
        } else {
          this.focusFirstItem();
        }
        this.andContextMenuOpenChange.emit(isOpen);
      },
      onPosition: pos => {
        this.posX = pos.x;
        this.posY = pos.y;
      },
      onSelect: ({ itemId }) => {
        if (itemId) {
          this.andContextMenuSelect.emit(itemId);
        }
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
      this.triggerEls = Array.from(this.el.children).filter(el => !el.slot || el.slot === 'trigger');
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

  /* ── Watchers ───────────────────────────────────────────────────── */

  @Watch('open')
  openChanged(newValue: boolean) {
    if (newValue) {
      this.contextMenuLogic?.actions.open();
    } else {
      this.contextMenuLogic?.actions.close();
    }
  }

  /* ── Handlers ───────────────────────────────────────────────────── */

  private handleContextMenu = (e: MouseEvent) => {
    e.preventDefault();
    const rect = this.el.getBoundingClientRect();
    this.contextMenuLogic?.actions.open({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
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

  /* ── Keyboard navigation helpers ────────────────────────────────── */

  private getEnabledIndices(): number[] {
    return this.items.reduce<number[]>((acc, item, i) => {
      if (!item.disabled) {
        acc.push(i);
      }
      return acc;
    }, []);
  }

  private focusItem(index: number) {
    const enabled = this.getEnabledIndices();
    if (!enabled.length) {
      this.focusedIndex = -1;
      return;
    }

    const pos = enabled.indexOf(index);
    const nextIndex = pos >= 0 ? index : enabled[0];
    this.focusedIndex = nextIndex;
    this.itemRefs.get(nextIndex)?.focus();
  }

  private focusNext() {
    const enabled = this.getEnabledIndices();
    if (!enabled.length) {
      return;
    }
    const pos = enabled.indexOf(this.focusedIndex);
    const next = pos < enabled.length - 1 ? enabled[pos + 1] : enabled[0];
    this.focusItem(next);
  }

  private focusPrev() {
    const enabled = this.getEnabledIndices();
    if (!enabled.length) {
      return;
    }
    const pos = enabled.indexOf(this.focusedIndex);
    const prev = pos > 0 ? enabled[pos - 1] : enabled[enabled.length - 1];
    this.focusItem(prev);
  }

  private focusFirstItem() {
    const enabled = this.getEnabledIndices();
    if (enabled.length) {
      requestAnimationFrame(() => this.focusItem(enabled[0]));
    }
  }

  private focusLastItem() {
    const enabled = this.getEnabledIndices();
    if (enabled.length) {
      this.focusItem(enabled[enabled.length - 1]);
    }
  }

  private handleSelect = (value: string) => {
    this.contextMenuLogic?.actions.selectItem(value);
  };

  private handleMenuKeyDown = (e: KeyboardEvent) => {
    if (!this.items.length) {
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        this.focusNext();
        break;
      case 'ArrowUp':
        e.preventDefault();
        this.focusPrev();
        break;
      case 'Home':
        e.preventDefault();
        this.focusFirstItem();
        break;
      case 'End':
        e.preventDefault();
        this.focusLastItem();
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (this.focusedIndex >= 0) {
          this.handleSelect(this.items[this.focusedIndex].value);
        }
        break;
      case 'Escape':
        e.preventDefault();
        this.contextMenuLogic?.actions.close();
        break;
      case 'Tab':
        this.contextMenuLogic?.actions.close();
        break;
      default:
        break;
    }
  };

  /* ── Render ─────────────────────────────────────────────────────── */

  render() {
    const triggerProps = this.contextMenuLogic?.getTriggerProps() || {};
    const panelProps = this.contextMenuLogic?.getPanelProps(this.menuLabel) || {};

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
          onKeyDown={this.items.length ? this.handleMenuKeyDown : undefined}
        >
          {this.items.length
            ? this.items.map((item, index) => {
                const isFocused = index === this.focusedIndex;
                return (
                  <div
                    ref={(el: HTMLDivElement) => {
                      if (el) {
                        this.itemRefs.set(index, el);
                      }
                    }}
                    role="menuitem"
                    tabindex={item.disabled ? -1 : isFocused ? 0 : -1}
                    class={cn(
                      'relative flex w-full cursor-pointer select-none items-center rounded-sm px-3 py-1.5 text-sm outline-none transition-colors',
                      'text-popover-foreground hover:bg-accent hover:text-accent-foreground',
                      item.disabled && 'pointer-events-none opacity-50',
                    )}
                    aria-disabled={item.disabled ? 'true' : undefined}
                    onClick={() => !item.disabled && this.handleSelect(item.value)}
                    onMouseEnter={() => this.focusItem(index)}
                  >
                    {item.text}
                  </div>
                );
              })
            : null}
          {!this.items.length ? <slot /> : null}
        </div>
      </Host>
    );
  }
}

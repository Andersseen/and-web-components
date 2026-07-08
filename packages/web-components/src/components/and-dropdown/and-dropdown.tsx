import { Component, Host, h, Prop, State, Element, Event, EventEmitter, Listen, Watch } from '@stencil/core';
import { cn } from '../../utils/cn';
import { createDropdown, type DropdownReturn } from '@andersseen/headless-components';
import { applyGlobalAnimationFlag } from '../../utils/animation-config';
import {
  dropdownTriggerVariants,
  menuClass,
  menuPlacementClass,
  menuItemClass,
  type DropdownVariantProps,
} from './and-dropdown-variants';

/* ────────────────────────────────────────────────────────────────────
 * Types
 * ──────────────────────────────────────────────────────────────────── */

export type DropdownItem = {
  text: string;
  value: string;
  disabled?: boolean;
};

export type DropdownPlacement = 'top' | 'bottom' | 'left' | 'right';

/* ────────────────────────────────────────────────────────────────────
 * Component
 * ──────────────────────────────────────────────────────────────────── */

/**
 * Menu button that opens a list of `items` on click. The trigger gets
 * `aria-haspopup`/`aria-expanded` automatically, and the menu supports
 * arrow keys, Home/End, Enter/Space, and Escape. If you slot a custom
 * `trigger` instead of using the default button, you're responsible for
 * adding those ARIA attributes yourself — they can't be forwarded onto
 * arbitrary slotted content.
 *
 * @example
 * ```html
 * <and-dropdown label="Options" items='[{"text":"Edit","value":"edit"},{"text":"Delete","value":"delete"}]'>
 * </and-dropdown>
 * ```
 */
@Component({
  tag: 'and-dropdown',
  styleUrls: ['and-dropdown.css', '../../global/component-base.css', '../../global/animations.css'],
  shadow: true,
})
export class AndDropdown {
  @Element() el!: HTMLElement;

  /** Items to render in the dropdown menu. */
  @Prop() items: DropdownItem[] = [];

  /** Visual variant of the trigger button. */
  @Prop({ reflect: true }) variant: DropdownVariantProps['variant'] = 'default';

  /** Accessible label for the dropdown trigger. */
  @Prop({ reflect: true }) label: string = 'Options';

  /** Preferred placement of the dropdown menu. */
  @Prop({ reflect: true }) placement: DropdownPlacement = 'bottom';

  /** Whether to close the menu after an item is selected. */
  @Prop() closeOnSelect: boolean = true;

  /** Emitted when an item is selected. */
  @Event({ bubbles: true, composed: true }) andDropdownSelect!: EventEmitter<string>;

  /** Emitted when the dropdown open state changes. */
  @Event({ bubbles: true, composed: true }) andDropdownOpenChange!: EventEmitter<boolean>;

  @State() private dropdownLogic!: DropdownReturn;
  @State() private isOpen: boolean = false;
  @State() private focusedIndex: number = -1;

  private itemRefs = new Map<number, HTMLDivElement>();

  /* ── Lifecycle ──────────────────────────────────────────────────── */

  componentWillLoad() {
    applyGlobalAnimationFlag(this.el);
    this.dropdownLogic = createDropdown({
      placement: this.placement,
      closeOnSelect: this.closeOnSelect,
      onOpenChange: (isOpen: boolean) => {
        this.isOpen = isOpen;
        if (!isOpen) {
          this.focusedIndex = -1;
        } else {
          this.focusFirstItem();
        }
        this.andDropdownOpenChange.emit(isOpen);
      },
      onSelect: ({ itemId }) => {
        if (itemId) {
          this.andDropdownSelect.emit(itemId);
        }
      },
    });
  }

  /* ── Watchers ───────────────────────────────────────────────────── */

  @Watch('placement')
  placementChanged(newValue: DropdownPlacement) {
    this.dropdownLogic = createDropdown({
      placement: newValue,
      closeOnSelect: this.closeOnSelect,
      defaultOpen: this.dropdownLogic?.state.isOpen,
      onOpenChange: (isOpen: boolean) => {
        this.isOpen = isOpen;
        this.andDropdownOpenChange.emit(isOpen);
      },
      onSelect: ({ itemId }) => {
        if (itemId) {
          this.andDropdownSelect.emit(itemId);
        }
      },
    });
  }

  /* ── Handlers ───────────────────────────────────────────────────── */

  @Listen('click', { target: 'window' })
  handleWindowClick(ev: MouseEvent) {
    if (!this.isOpen) {
      return;
    }
    const path = ev.composedPath();
    if (!path.includes(this.el)) {
      this.dropdownLogic.actions.close();
    }
  }

  /* ── Lifecycle Cleanup ──────────────────────────────────────────── */

  disconnectedCallback() {
    // Close dropdown on unmount to prevent memory leaks
    if (this.isOpen) {
      this.dropdownLogic.actions.close();
    }
  }

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
      // Defer focus until after render.
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
    this.dropdownLogic.actions.selectItem(value);
  };

  private handleTriggerKeyDown = (e: KeyboardEvent) => {
    this.dropdownLogic.handleTriggerKeyDown(e);
  };

  private handleContentKeyDown = (e: KeyboardEvent) => {
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
        this.dropdownLogic.actions.close();
        break;
      case 'Tab':
        this.dropdownLogic.actions.close();
        break;
      default:
        break;
    }
  };

  /* ── Render ─────────────────────────────────────────────────────── */

  render() {
    const triggerProps = this.dropdownLogic?.getTriggerProps() || {};
    const contentProps = this.dropdownLogic?.getContentProps() || {};

    return (
      <Host>
        <div class="relative inline-block text-left w-full">
          {/* Trigger */}
          <div
            class="cursor-pointer"
            onClick={() => this.dropdownLogic?.actions.toggle()}
            onKeyDown={this.handleTriggerKeyDown}
          >
            <slot name="trigger">
              <button
                {...triggerProps}
                type="button"
                class={cn(dropdownTriggerVariants({ variant: this.variant }), 'w-full justify-between')}
              >
                {this.label}
                <span class="ml-auto flex shrink-0 items-center justify-center">
                  <and-icon name={this.isOpen ? 'chevron-up' : 'chevron-down'} size={16} class="h-4 w-4" />
                </span>
              </button>
            </slot>
          </div>

          {/* Menu */}
          <div
            {...contentProps}
            class={cn(
              menuClass,
              menuPlacementClass[this.placement],
              'and-dropdown-menu',
              this.isOpen ? 'visible opacity-100' : 'invisible opacity-0',
            )}
            data-state={this.isOpen ? 'open' : 'closed'}
            data-side={this.placement}
            onKeyDown={this.handleContentKeyDown}
          >
            {this.items.map((item, index) => {
              const itemProps = this.dropdownLogic?.getItemProps(item.value) || {};
              const isFocused = index === this.focusedIndex;
              return (
                <div
                  {...itemProps}
                  ref={(el: HTMLDivElement) => {
                    if (el) {
                      this.itemRefs.set(index, el);
                    }
                  }}
                  class={cn(menuItemClass, item.disabled && 'pointer-events-none opacity-50')}
                  tabindex={item.disabled ? -1 : isFocused ? 0 : -1}
                  onClick={() => !item.disabled && this.handleSelect(item.value)}
                  onMouseEnter={() => this.focusItem(index)}
                >
                  {item.text}
                </div>
              );
            })}
          </div>
        </div>
      </Host>
    );
  }
}

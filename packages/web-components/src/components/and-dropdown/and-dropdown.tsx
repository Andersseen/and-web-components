import { Component, Host, h, Prop, State, Element, Event, EventEmitter, Listen, Watch } from '@stencil/core';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';
import { createDropdown, type DropdownReturn } from '@andersseen/headless-components';
import { applyGlobalAnimationFlag } from '../../utils/animation-config';

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
 * Variants
 * ──────────────────────────────────────────────────────────────────── */

const dropdownTriggerVariants = cva(
  [
    'inline-flex w-full items-center justify-between gap-x-2',
    'rounded-md px-3 py-3 sm:py-2 text-sm font-medium shadow-sm',
    'ring-1 ring-inset transition-colors',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
  ].join(' '),
  {
    variants: {
      variant: {
        default: 'bg-background text-foreground ring-border hover:bg-accent',
        primary: 'bg-primary text-primary-foreground ring-primary hover:bg-primary/80',
        secondary: 'bg-secondary text-secondary-foreground ring-secondary hover:bg-secondary/80',
        ghost: 'bg-transparent text-foreground ring-transparent hover:bg-accent',
        outline: 'border border-border bg-background text-foreground hover:bg-accent',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

const menuClass = [
  'absolute z-50 min-w-[8rem]',
  'overflow-hidden rounded-md border border-border',
  'bg-popover p-1 shadow-md transition-opacity',
].join(' ');

const menuPlacementClass: Record<DropdownPlacement, string> = {
  bottom: 'left-0 top-full mt-2 origin-top-left',
  top: 'left-0 bottom-full mb-2 origin-bottom-left',
  left: 'right-full top-0 mr-2 origin-right',
  right: 'left-full top-0 ml-2 origin-left',
};

const menuItemClass = [
  'relative flex w-full cursor-pointer select-none items-center rounded-sm text-sm',
  'outline-none transition-colors px-3 py-3 sm:py-1.5',
  'text-popover-foreground hover:bg-accent hover:text-accent-foreground',
].join(' ');

export type DropdownVariantProps = VariantProps<typeof dropdownTriggerVariants>;

/* ────────────────────────────────────────────────────────────────────
 * Component
 * ──────────────────────────────────────────────────────────────────── */

@Component({
  tag: 'and-dropdown',
  styleUrls: ['and-dropdown.css', '../../global/global.css'],
  shadow: true,
})
export class AndDropdown {
  @Element() el: HTMLElement;

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
  @Event({ bubbles: true, composed: true }) andDropdownSelect: EventEmitter<string>;

  /** Emitted when the dropdown open state changes. */
  @Event({ bubbles: true, composed: true }) andDropdownOpenChange: EventEmitter<boolean>;

  @State() private dropdownLogic: DropdownReturn;
  @State() private isOpen: boolean = false;

  /* ── Lifecycle ──────────────────────────────────────────────────── */

  componentWillLoad() {
    applyGlobalAnimationFlag(this.el);
    this.dropdownLogic = createDropdown({
      placement: this.placement,
      closeOnSelect: this.closeOnSelect,
      onOpenChange: (isOpen: boolean) => {
        this.isOpen = isOpen;
        this.andDropdownOpenChange.emit(isOpen);
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
    });
  }

  /* ── Handlers ───────────────────────────────────────────────────── */

  @Listen('click', { target: 'window' })
  handleWindowClick(ev: MouseEvent) {
    if (!this.isOpen) return;
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

  private handleSelect = (value: string) => {
    this.andDropdownSelect.emit(value);
    this.dropdownLogic.actions.selectItem(value);
  };

  private handleTriggerKeyDown = (e: KeyboardEvent) => {
    this.dropdownLogic.handleTriggerKeyDown(e);
  };

  private handleContentKeyDown = (e: KeyboardEvent) => {
    const itemIds = this.items.map(item => item.value);
    this.dropdownLogic.handleContentKeyDown(e, itemIds);
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
            {this.items.map(item => {
              const itemProps = this.dropdownLogic?.getItemProps(item.value) || {};
              return (
                <div
                  {...itemProps}
                  class={cn(menuItemClass, item.disabled && 'pointer-events-none opacity-50')}
                  onClick={() => !item.disabled && this.handleSelect(item.value)}
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

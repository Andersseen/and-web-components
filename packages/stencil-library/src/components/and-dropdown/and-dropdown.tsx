import { Component, Host, h, Prop, State, Element, Event, EventEmitter, Listen, Watch } from '@stencil/core';
import { cva } from 'class-variance-authority';
import { cn } from '../../utils/utils';
import { createDropdown, DropdownReturn } from '@andersseen/headless-core';

const dropdownTriggerVariants = cva(
  'inline-flex w-full items-center justify-between gap-x-t-gap-sm rounded-md px-t-gap py-t-gap-sm text-sm font-medium shadow-sm ring-1 ring-inset transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
  {
    variants: {
      variant: {
        default: 'bg-background text-foreground ring-slate-300 hover:bg-slate-50',
        primary: 'bg-primary text-foreground ring-primary hover:bg-primary/80',
        secondary: 'bg-secondary text-secondary-foreground ring-secondary hover:bg-secondary/80',
        ghost: 'bg-transparent text-foreground ring-transparent hover:bg-slate-100',
        outline: 'border border-slate-300 bg-foreground hover:bg-slate-50',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export type DropdownItem = {
  text: string;
  value: string;
  disabled?: boolean;
};

@Component({
  tag: 'and-dropdown',
  styleUrls: ['and-dropdown.css', '../../global/global.css'],
  shadow: true,
})
export class MyDropdown {
  @Element() el: HTMLElement;

  @Prop() items: DropdownItem[] = [];
  @Prop() variant: any = 'default';
  @Prop() label: string = 'Options';
  @Prop() placement: 'top' | 'bottom' | 'left' | 'right' = 'bottom';
  @Prop() closeOnSelect: boolean = true;

  @Event() dropdownSelect: EventEmitter<string>;

  @State() private dropdownLogic: DropdownReturn;
  @State() private isOpen: boolean = false; // Track state for re-rendering

  componentWillLoad() {
    this.dropdownLogic = createDropdown({
      placement: this.placement,
      closeOnSelect: this.closeOnSelect,
      onOpenChange: isOpen => {
        this.isOpen = isOpen; // Update state to trigger re-render
        this.el.dispatchEvent(
          new CustomEvent('dropdownOpenChange', {
            detail: isOpen,
            bubbles: true,
            composed: true,
          }),
        );
      },
    });
  }

  @Watch('placement')
  placementChanged(newValue: 'top' | 'bottom' | 'left' | 'right') {
    // Recreate dropdown with new placement
    this.dropdownLogic = createDropdown({
      placement: newValue,
      closeOnSelect: this.closeOnSelect,
      defaultOpen: this.dropdownLogic?.state.isOpen,
      onOpenChange: isOpen => {
        this.isOpen = isOpen;
      },
    });
  }

  @Listen('click', { target: 'window' })
  handleWindowClick(ev: MouseEvent) {
    if (!this.isOpen) return;
    const path = ev.composedPath();
    if (!path.includes(this.el)) {
      this.dropdownLogic.actions.close();
    }
  }

  handleSelect(value: string) {
    this.dropdownSelect.emit(value);
    this.dropdownLogic.actions.selectItem(value);
  }

  handleTriggerKeyDown = (e: KeyboardEvent) => {
    this.dropdownLogic.handleTriggerKeyDown(e);
  };

  handleMenuKeyDown = (e: KeyboardEvent) => {
    const itemIds = this.items.map(item => item.value);
    this.dropdownLogic.handleMenuKeyDown(e, itemIds);
  };

  render() {
    const triggerProps = this.dropdownLogic?.getTriggerProps() || {};
    const menuProps = this.dropdownLogic?.getMenuProps() || {};

    return (
      <Host>
        <div class="relative inline-block text-left w-full">
          {/* TRIGGER */}
          <div class="cursor-pointer" onClick={() => this.dropdownLogic?.actions.toggle()} onKeyDown={this.handleTriggerKeyDown}>
            <slot name="trigger">
              <button {...triggerProps} type="button" class={cn(dropdownTriggerVariants({ variant: this.variant }), 'w-full justify-between')}>
                {this.label}
                <span class="ml-auto flex shrink-0 items-center justify-center">
                  <and-icon name={this.isOpen ? 'chevron-up' : 'chevron-down'} size={16} class="h-4 w-4" />
                </span>
              </button>
            </slot>
          </div>

          {/* MENU */}
          <div
            {...menuProps}
            class={cn(
              'absolute left-0 z-50 mt-2 min-w-[8rem] origin-top-right overflow-hidden rounded-md border bg-background p-1 shadow-md',
              'transition-opacity',
              this.isOpen ? 'opacity-100 visible' : 'opacity-0 invisible',
            )}
            onKeyDown={this.handleMenuKeyDown}
          >
            {this.items.map(item => {
              const itemProps = this.dropdownLogic?.getItemProps(item.value) || {};

              return (
                <div
                  {...itemProps}
                  class={cn(
                    'relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors',
                    'hover:bg-background/10 hover:text-foreground',
                    item.disabled && 'pointer-events-none opacity-50',
                  )}
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

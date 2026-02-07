import { Component, Host, h, Prop, State, Element, Listen, Event, EventEmitter } from '@stencil/core';
import { cva } from 'class-variance-authority';
import { cn } from '../../utils/utils';

const dropdownTriggerVariants = cva(
  'inline-flex w-full justify-center gap-x-1.5 rounded-md px-3 py-2 text-sm font-medium shadow-sm ring-1 ring-inset transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
  {
    variants: {
      variant: {
        default: 'bg-background text-foreground ring-border hover:bg-accent hover:text-accent-foreground',
        primary: 'bg-primary text-primary-foreground ring-primary hover:bg-primary/90',
        secondary: 'bg-secondary text-secondary-foreground ring-secondary hover:bg-secondary/80',
        ghost: 'bg-transparent text-foreground ring-transparent hover:bg-accent hover:text-accent-foreground',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export type DropdownVariant = 'default' | 'primary' | 'secondary' | 'ghost' | 'outline';

const dropdownContentVariants = cva(
  'absolute right-0 z-50 mt-2 min-w-[8rem] origin-top-right overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md transition-all duration-200 ease-out',
  {
    variants: {
      state: {
        open: 'animate-in fade-in-0 zoom-in-95 visible',
        closed: 'animate-out fade-out-0 zoom-out-95 invisible',
      },
    },
    defaultVariants: {
      state: 'closed',
    },
  },
);

export type DropdownItem = {
  text: string;
  value: string;
};

@Component({
  tag: 'my-dropdown',
  styleUrls: ['my-dropdown.css', '../../global/global.css'],
  shadow: true,
})
export class MyDropdown {
  @Element() el: HTMLElement;

  @Prop() items: DropdownItem[] = [];

  /**
   * The visual variant of the dropdown trigger.
   */
  @Prop() variant: DropdownVariant = 'default';

  @State() isOpen = false;

  @Event() dropdownSelect: EventEmitter<string>;

  @Listen('click', { target: 'window' })
  handleWindowClick(ev: MouseEvent) {
    if (!this.isOpen) return;
    const path = ev.composedPath();
    if (!path.includes(this.el)) {
      this.isOpen = false;
    }
  }

  toggle() {
    this.isOpen = !this.isOpen;
  }

  handleSelect(value: string) {
    this.dropdownSelect.emit(value);
    this.isOpen = false;
  }

  render() {
    return (
      <Host>
        <div class="relative inline-block text-left">
          <div onClick={() => this.toggle()} class="inline-flex w-full justify-center">
            <slot name="trigger">
              <button type="button" class={cn(dropdownTriggerVariants({ variant: this.variant }))}>
                Options
                <my-icon name="chevron-down" class="-mr-1 h-5 w-5 text-muted-foreground" />
              </button>
            </slot>
          </div>

          <div class={cn(dropdownContentVariants({ state: this.isOpen ? 'open' : 'closed' }))} role="menu" aria-orientation="vertical" tabindex="-1">
            <div role="none">
              {this.items.map(item => (
                <button
                  class="relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                  role="menuitem"
                  tabindex="-1"
                  onClick={() => this.handleSelect(item.value)}
                >
                  {item.text}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Host>
    );
  }
}

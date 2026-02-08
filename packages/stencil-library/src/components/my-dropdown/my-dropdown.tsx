import { Component, Host, h, Prop, State, Element, Event, EventEmitter, Listen } from '@stencil/core';
import { cva } from 'class-variance-authority';
import { cn } from '../../utils/utils';

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
  tag: 'my-dropdown',
  styleUrls: ['my-dropdown.css', '../../global/global.css'],
  shadow: true,
})
export class MyDropdown {
  @Element() el: HTMLElement;

  @Prop() items: DropdownItem[] = [];
  @Prop() variant: any = 'default';
  @Prop() label: string = 'Options';

  @Event() dropdownSelect: EventEmitter<string>;

  @State() isOpen = false;

  @Listen('click', { target: 'window' })
  handleWindowClick(ev: MouseEvent) {
    if (!this.isOpen) return;
    const path = ev.composedPath();
    if (!path.includes(this.el)) {
      this.close();
    }
  }

  toggle() {
    this.isOpen = !this.isOpen;
  }

  close() {
    this.isOpen = false;
  }

  handleSelect(value: string) {
    this.dropdownSelect.emit(value);
    this.close();
  }

  render() {
    return (
      <Host>
        <div class="relative inline-block text-left w-full">
          {/* TRIGGER */}
          <div class="cursor-pointer" onClick={() => this.toggle()}>
            <slot name="trigger">
              <button
                type="button"
                class={cn(dropdownTriggerVariants({ variant: this.variant }), 'w-full justify-between')}
                aria-expanded={this.isOpen.toString()}
                aria-haspopup="true"
              >
                {this.label}
                <span class="ml-auto flex shrink-0 items-center justify-center">
                  <my-icon name={this.isOpen ? 'chevron-up' : 'chevron-down'} class="h-4 w-4" />
                </span>
              </button>
            </slot>
          </div>

          {/* MENU */}
          <div
            class={cn(
              'absolute left-0 z-50 mt-2 min-w-[8rem] origin-top-right overflow-hidden rounded-md border bg-background p-1 shadow-md',
              'transition-opacity',
              this.isOpen ? 'opacity-100 visible' : 'opacity-0 invisible',
            )}
            role="menu"
          >
            {this.items.map(item => (
              <div
                class={cn(
                  'relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors',
                  'hover:bg-background/10 hover:text-foreground',
                  item.disabled && 'pointer-events-none opacity-50',
                )}
                onClick={() => !item.disabled && this.handleSelect(item.value)}
                role="menuitem"
              >
                {item.text}
              </div>
            ))}
          </div>
        </div>
      </Host>
    );
  }
}

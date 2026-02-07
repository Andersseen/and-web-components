import { Component, Host, h, Prop, State, Element, Event, EventEmitter, Listen } from '@stencil/core';
import { cva } from 'class-variance-authority';
import { cn } from '../../utils/utils';

const dropdownTriggerVariants = cva(
  'inline-flex w-full items-center justify-between gap-x-1.5 rounded-md px-3 py-2 text-sm font-medium shadow-sm ring-1 ring-inset transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
  {
    variants: {
      variant: {
        default: 'bg-white text-slate-900 ring-slate-300 hover:bg-slate-50',
        primary: 'bg-blue-600 text-white ring-blue-600 hover:bg-blue-700',
        secondary: 'bg-slate-100 text-slate-900 ring-slate-200 hover:bg-slate-200',
        ghost: 'bg-transparent text-slate-900 ring-transparent hover:bg-slate-100',
        outline: 'border border-slate-300 bg-white hover:bg-slate-50',
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
                <my-icon name="chevron-down" class={cn('ml-2 h-4 w-4 transition-transform duration-200', this.isOpen && 'rotate-180')} />
              </button>
            </slot>
          </div>

          {/* MENU */}
          <div
            class={cn(
              'absolute left-0 z-50 mt-2 min-w-[8rem] origin-top-right overflow-hidden rounded-md border bg-white p-1 shadow-md',
              'transition-opacity duration-200',
              this.isOpen ? 'opacity-100 visible' : 'opacity-0 invisible',
            )}
            role="menu"
          >
            {this.items.map(item => (
              <div
                class={cn(
                  'relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors',
                  'hover:bg-slate-100 hover:text-slate-900',
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

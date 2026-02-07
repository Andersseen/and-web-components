import { Component, Host, h, Prop, State, Element, Event, EventEmitter } from '@stencil/core';
import * as menu from '@zag-js/menu';
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
  @Prop() variant: DropdownVariant = 'default';
  @Event() dropdownSelect: EventEmitter<string>;

  @State() state: any;
  private service: any;

  componentWillLoad() {
    this.service = (menu.machine as any).start({
      id: 'menu',
      getRootNode: () => this.el.shadowRoot,
      onSelect: details => {
        this.dropdownSelect.emit(details.value);
      },
    });

    this.service.subscribe(state => {
      this.state = state;
    });
  }

  disconnectedCallback() {
    this.service.stop();
  }

  render() {
    const api = (menu.connect as any)(this.service, (v: any) => v);

    return (
      <Host>
        <div class="relative inline-block text-left">
          <button {...api.getTriggerProps()} type="button" class={cn(dropdownTriggerVariants({ variant: this.variant }))}>
            <slot name="trigger">
              Options
              <my-icon name="chevron-down" class="-mr-1 h-5 w-5 text-muted-foreground" />
            </slot>
          </button>

          <div
            {...api.getPositionerProps()}
            class="z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md transition-all duration-200 ease-out data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95"
          >
            <div {...api.getContentProps()}>
              {this.items.map(item => (
                <div
                  {...api.getItemProps({ value: item.value })}
                  class="relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                >
                  {item.text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Host>
    );
  }
}

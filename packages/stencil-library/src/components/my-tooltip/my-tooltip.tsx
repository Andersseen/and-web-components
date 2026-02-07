import { Component, Host, h, Prop, State, Element } from '@stencil/core';
import { cva } from 'class-variance-authority';
import { cn } from '../../utils/utils';

const tooltipVariants = cva(
  'absolute z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 whitespace-nowrap',
  {
    variants: {
      placement: {
        top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
        bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
        left: 'right-full top-1/2 -translate-y-1/2 mr-2',
        right: 'left-full top-1/2 -translate-y-1/2 ml-2',
      },
      visible: {
        true: 'opacity-100 visible',
        false: 'opacity-0 invisible pointer-events-none',
      },
      variant: {
        default: 'bg-popover text-popover-foreground', // Explicit semantic default
      },
    },
    defaultVariants: {
      placement: 'top',
      visible: false,
      variant: 'default',
    },
  },
);

@Component({
  tag: 'my-tooltip',
  styleUrls: ['my-tooltip.css', '../../global/global.css'],
  shadow: true,
})
export class MyTooltip {
  @Element() el: HTMLElement;

  @Prop() content: string;
  @Prop() placement: 'top' | 'right' | 'bottom' | 'left' = 'top';
  @Prop() openDelay: number = 0;
  @Prop() closeDelay: number = 0;

  @State() isVisible = false;
  private timeout: any;

  show() {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.isVisible = true;
    }, this.openDelay);
  }

  hide() {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.isVisible = false;
    }, this.closeDelay);
  }

  render() {
    return (
      <Host onMouseEnter={() => this.show()} onMouseLeave={() => this.hide()} onFocusin={() => this.show()} onFocusout={() => this.hide()}>
        <div class="relative inline-block">
          {/* Trigger */}
          <div class="inline-block relative">
            <slot></slot>
          </div>

          {/* Tooltip Content */}
          <div class={cn(tooltipVariants({ placement: this.placement, visible: this.isVisible }))} data-state={this.isVisible ? 'open' : 'closed'} data-side={this.placement}>
            {this.content || <slot name="content"></slot>}
          </div>
        </div>
      </Host>
    );
  }
}

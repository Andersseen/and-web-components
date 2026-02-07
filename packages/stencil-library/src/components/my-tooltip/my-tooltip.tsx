import { Component, Host, h, Prop, State, Element } from '@stencil/core';
import { cn } from '../../utils/utils';

@Component({
  tag: 'my-tooltip',
  styleUrl: 'my-tooltip.css',
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

  getPlacementClass() {
    switch (this.placement) {
      case 'top':
        return 'bottom-full left-1/2 -translate-x-1/2 mb-2';
      case 'bottom':
        return 'top-full left-1/2 -translate-x-1/2 mt-2';
      case 'left':
        return 'right-full top-1/2 -translate-y-1/2 mr-2';
      case 'right':
        return 'left-full top-1/2 -translate-y-1/2 ml-2';
      default:
        return 'bottom-full left-1/2 -translate-x-1/2 mb-2';
    }
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
          <div
            class={cn(
              'absolute z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md transition-opacity duration-200 whitespace-nowrap',
              this.isVisible ? 'opacity-100 visible' : 'opacity-0 invisible',
              this.getPlacementClass(),
            )}
          >
            {this.content || <slot name="content"></slot>}
          </div>
        </div>
      </Host>
    );
  }
}

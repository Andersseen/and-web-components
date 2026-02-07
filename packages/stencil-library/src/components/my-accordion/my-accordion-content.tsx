import { Component, h, Host, Element, Prop } from '@stencil/core';
import { cn } from '../../utils/utils';

@Component({
  tag: 'my-accordion-content',
  styleUrl: '../../global/global.css',
  shadow: true,
})
export class MyAccordionContent {
  @Element() el: HTMLElement;

  @Prop() open: boolean = false;

  render() {
    return (
      <Host
        class={cn('overflow-hidden text-sm transition-all', this.open ? 'animate-accordion-down opacity-100' : 'animate-accordion-up opacity-0 h-0 hidden')}
        data-state={this.open ? 'open' : 'closed'}
        hidden={!this.open}
      >
        <div class="pb-4 pt-0">
          <slot></slot>
        </div>
      </Host>
    );
  }
}

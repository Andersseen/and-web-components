import { Component, h, Host, Element, Prop } from '@stencil/core';
import { cn } from '../../utils/utils';

@Component({
  tag: 'my-accordion-content',
  styleUrl: '../../global/global.css',
  shadow: true,
})
export class MyAccordionContent {
  @Element() el: HTMLElement;

  /**
   * Whether the Accordion Item is open.
   */
  @Prop({ reflect: true }) open: boolean = false;

  render() {
    const isOpen = this.open;

    return (
      <Host
        class={cn('overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down', isOpen ? '' : 'hidden')}
        data-state={isOpen ? 'open' : 'closed'}
      >
        <div class="pb-4 pt-0">
          <slot></slot>
        </div>
      </Host>
    );
  }
}

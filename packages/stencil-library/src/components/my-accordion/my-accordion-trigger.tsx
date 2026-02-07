import { Component, h, Host, Element } from '@stencil/core';
import * as accordion from '@zag-js/accordion';
import { cn } from '../../utils/utils';

@Component({
  tag: 'my-accordion-trigger',
  styleUrl: '../../global/global.css',
  shadow: true,
})
export class MyAccordionTrigger {
  @Element() el: HTMLElement;

  render() {
    const parent = this.el.closest('my-accordion') as any;
    const item = this.el.closest('my-accordion-item') as any;

    if (!parent || !parent.service || !item) return null;

    const api = (accordion.connect as any)(parent.service, (v: any) => v);
    // item.value exposes the value prop from the item component
    const triggerProps = api.getItemTriggerProps({ value: item.value });

    return (
      <Host class={cn('flex')}>
        <button class={cn('flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180')} {...triggerProps}>
          <slot></slot>
          <my-icon name="chevron-down" class="h-4 w-4 shrink-0 transition-transform duration-200" />
        </button>
      </Host>
    );
  }
}

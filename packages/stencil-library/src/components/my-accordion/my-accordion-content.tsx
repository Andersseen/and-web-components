import { Component, h, Host, Element } from '@stencil/core';
import * as accordion from '@zag-js/accordion';
import { normalizeProps } from '@zag-js/core';
import { cn } from '../../utils/utils';

@Component({
  tag: 'my-accordion-content',
  styleUrl: '../../global/global.css',
  shadow: true,
})
export class MyAccordionContent {
  @Element() el: HTMLElement;

  render() {
    const parent = this.el.closest('my-accordion') as any;
    const item = this.el.closest('my-accordion-item') as any;

    if (!parent || !parent.service || !item) return null;

    const api = accordion.connect(parent.service, normalizeProps);
    const contentProps = api.getItemContentProps({ value: item.value });

    return (
      <Host class={cn('overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down')} {...contentProps}>
        <div class="pb-4 pt-0">
          <slot></slot>
        </div>
      </Host>
    );
  }
}

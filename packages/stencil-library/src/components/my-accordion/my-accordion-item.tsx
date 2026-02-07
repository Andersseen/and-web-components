import { Component, Prop, h, Host, Element } from '@stencil/core';
import * as accordion from '@zag-js/accordion';
import { normalizeProps } from '@zag-js/core';
import { cn } from '../../utils/utils';

@Component({
  tag: 'my-accordion-item',
  styleUrl: '../../global/global.css',
  shadow: true,
})
export class MyAccordionItem {
  @Element() el: HTMLElement;

  @Prop() value: string;
  @Prop() disabled: boolean = false;

  componentWillLoad() {
    if (!this.value) {
      this.value = `accordion-item-${Math.random().toString(36).substr(2, 9)}`;
    }
  }

  render() {
    const parent = this.el.closest('my-accordion') as any;
    // We check for parent.service now instead of parent.state
    if (!parent || !parent.service) return null;

    // Connect using service (2 args)
    const api = accordion.connect(parent.service, normalizeProps);
    const itemProps = api.getItemProps({ value: this.value, disabled: this.disabled });

    return (
      <Host {...itemProps} class={cn('block border-b')}>
        <slot></slot>
      </Host>
    );
  }
}

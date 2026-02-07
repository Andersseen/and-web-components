import { Component, h, Host, Prop, Element } from '@stencil/core';
import { cn } from '../../utils/utils';

@Component({
  tag: 'my-tabs-content',
  styleUrl: 'my-tabs.css',
  shadow: true,
})
export class MyTabsContent {
  @Element() el: HTMLElement;
  @Prop() value: string;
  @Prop() selected: boolean = false;

  render() {
    return (
      <Host
        role="tabpanel"
        class={cn('mt-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring', this.selected ? 'block animate-in fade-in-50 zoom-in-95' : 'hidden')}
      >
        <slot></slot>
      </Host>
    );
  }
}

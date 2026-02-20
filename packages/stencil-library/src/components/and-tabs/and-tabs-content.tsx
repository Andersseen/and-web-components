import { Component, h, Host, Prop, Element } from '@stencil/core';
import { cn } from '../../utils/utils';

@Component({
  tag: 'and-tabs-content',
  styleUrl: 'and-tabs.css',
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
        hidden={!this.selected}
        tabIndex={0}
        class={cn('mt-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring', this.selected ? 'block animate-in fade-in-50 zoom-in-95' : 'hidden')}
      >
        <slot></slot>
      </Host>
    );
  }
}

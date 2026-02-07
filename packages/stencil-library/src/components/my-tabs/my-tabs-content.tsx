import { Component, h, Host, Prop, Element } from '@stencil/core';
import * as tabs from '@zag-js/tabs';
import { cn } from '../../utils/utils';

@Component({
  tag: 'my-tabs-content',
  shadow: true,
})
export class MyTabsContent {
  @Element() el: HTMLElement;
  @Prop() value: string;

  render() {
    const parent = this.el.closest('my-tabs') as any;
    if (!parent) return null;

    const api = (tabs.connect as any)(parent.state, parent.service.send, (v: any) => v);
    const contentProps = api.getContentProps({ value: this.value });
    const isHidden = api.value !== this.value;

    return (
      <Host
        {...contentProps}
        class={cn(
          'mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          isHidden ? 'hidden' : 'block animate-in fade-in-50 zoom-in-95',
        )}
      >
        <slot></slot>
      </Host>
    );
  }
}

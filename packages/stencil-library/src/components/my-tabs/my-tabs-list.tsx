import { Component, h, Host, Element } from '@stencil/core';
import { cn } from '../../utils/utils';

@Component({
  tag: 'my-tabs-list',
  styleUrls: ['my-tabs.css', '../../global/global.css'],
  shadow: true,
})
export class MyTabsList {
  @Element() el: HTMLElement;

  render() {
    return (
      <Host class={cn('inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground')}>
        <slot></slot>
      </Host>
    );
  }
}

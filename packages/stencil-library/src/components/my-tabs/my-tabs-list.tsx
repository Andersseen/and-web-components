import { Component, h, Host } from '@stencil/core';
import { cn } from '../../utils/utils';

@Component({
  tag: 'my-tabs-list',
  styleUrls: ['my-tabs.css', '../../global/global.css'],
  shadow: true,
})
export class MyTabsList {
  render() {
    return (
      <Host class={cn('flex flex-row w-full h-10 items-center rounded-md bg-muted p-1 text-muted-foreground')}>
        <slot></slot>
      </Host>
    );
  }
}

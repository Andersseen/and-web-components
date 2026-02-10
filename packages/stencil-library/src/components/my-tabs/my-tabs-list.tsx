import { Component, h, Host, Prop } from '@stencil/core';
import { cn } from '../../utils/utils';

@Component({
  tag: 'my-tabs-list',
  styleUrls: ['my-tabs.css', '../../global/global.css'],
  shadow: true,
})
export class MyTabsList {
  @Prop() orientation: 'horizontal' | 'vertical' = 'horizontal';

  render() {
    return (
      <Host role="tablist" aria-orientation={this.orientation} class={cn('flex flex-row w-full h-10 items-center rounded-md bg-muted p-1 text-muted-foreground')}>
        <slot></slot>
      </Host>
    );
  }
}

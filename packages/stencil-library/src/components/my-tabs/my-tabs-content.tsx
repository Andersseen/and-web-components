import { Component, Prop, h, Host } from '@stencil/core';
import { cn } from '../../utils/utils';

@Component({
  tag: 'my-tabs-content',
  styleUrl: '../../global/global.css',
  shadow: true,
})
export class MyTabsContent {
  @Prop() value: string;

  /**
   * Managed by parent `my-tabs`
   */
  @Prop({ reflect: true }) active: boolean = false;

  render() {
    return (
      <Host
        class={cn(
          'mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          this.active ? 'block animate-in fade-in-50 zoom-in-95' : 'hidden',
        )}
        role="tabpanel"
        data-state={this.active ? 'active' : 'inactive'}
      >
        <slot></slot>
      </Host>
    );
  }
}

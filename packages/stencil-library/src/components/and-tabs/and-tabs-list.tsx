import { Component, h, Host, Prop } from '@stencil/core';
import { cn } from '../../utils/cn';

const tabsListClass = [
  'flex flex-row w-full h-10 items-center rounded-md',
  'bg-muted p-1 text-muted-foreground',
].join(' ');

@Component({
  tag: 'and-tabs-list',
  styleUrls: ['and-tabs.css', '../../global/global.css'],
  shadow: true,
})
export class AndTabsList {
  /** Orientation of the tab list. */
  @Prop({ reflect: true }) orientation: 'horizontal' | 'vertical' = 'horizontal';

  render() {
    return (
      <Host
        role="tablist"
        aria-orientation={this.orientation}
        class={cn(tabsListClass)}
      >
        <slot />
      </Host>
    );
  }
}

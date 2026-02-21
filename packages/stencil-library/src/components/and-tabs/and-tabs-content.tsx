import { Component, h, Host, Prop, Element } from '@stencil/core';
import { cn } from '../../utils/cn';

const contentBaseClass = [
  'mt-2',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
].join(' ');

@Component({
  tag: 'and-tabs-content',
  styleUrl: 'and-tabs.css',
  shadow: true,
})
export class AndTabsContent {
  @Element() el: HTMLElement;

  /** The value that identifies which tab this content belongs to. */
  @Prop({ reflect: true }) value: string;

  /** Whether this content panel is currently selected (set by parent). */
  @Prop() selected: boolean = false;

  render() {
    return (
      <Host
        role="tabpanel"
        hidden={!this.selected}
        tabIndex={0}
        aria-labelledby={this.value ? `tab-${this.value}` : undefined}
        class={cn(
          contentBaseClass,
          this.selected ? 'block animate-in fade-in-50 zoom-in-95' : 'hidden',
        )}
      >
        <slot />
      </Host>
    );
  }
}

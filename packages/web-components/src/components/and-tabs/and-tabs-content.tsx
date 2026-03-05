import { Component, h, Host, Prop, Element } from '@stencil/core';
import { cn } from '../../utils/cn';
import { applyGlobalAnimationFlag } from '../../utils/animation-config';

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

  connectedCallback() {
    applyGlobalAnimationFlag(this.el);
  }

  render() {
    return (
      <Host
        role="tabpanel"
        hidden={!this.selected}
        tabIndex={0}
        aria-labelledby={this.value ? `tab-${this.value}` : undefined}
        class={cn(
          contentBaseClass,
          'and-tab-content',
          this.selected ? 'block' : 'hidden',
        )}
        data-state={this.selected ? 'active' : 'inactive'}
      >
        <slot />
      </Host>
    );
  }
}

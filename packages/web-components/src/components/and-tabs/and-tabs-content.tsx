import { Component, h, Host, Prop, Element } from '@stencil/core';
import { cn } from '../../utils/cn';
import { applyGlobalAnimationFlag } from '../../utils/animation-config';
import type { TabsReturn } from '@andersseen/headless-components';
import { tabsContentVariants } from './and-tabs-content-variants';

/**
 * Panel shown when its matching `and-tabs-trigger` (same `value`) is
 * selected. Must be a child of `and-tabs`, which injects the shared
 * headless logic — that's what generates the `id`/`aria-labelledby` pair
 * that ties this panel back to its trigger, so a screen reader announces
 * the panel using the trigger's label.
 *
 * @example
 * ```html
 * <and-tabs-content value="item-1">Content 1</and-tabs-content>
 * ```
 */
@Component({
  tag: 'and-tabs-content',
  styleUrl: 'and-tabs.css',
  shadow: true,
})
export class AndTabsContent {
  @Element() el!: HTMLElement;

  /** The value that identifies which tab this content belongs to. */
  @Prop({ reflect: true }) value!: string;

  /** Whether this content panel is currently selected (set by parent). */
  @Prop() selected: boolean = false;

  /** Reference to the parent tabs headless logic (set by parent). */
  @Prop() tabsLogic?: TabsReturn;

  connectedCallback() {
    applyGlobalAnimationFlag(this.el);
  }

  render() {
    const contentProps = this.tabsLogic?.getContentProps(this.value) || {
      'role': 'tabpanel',
      'aria-labelledby': undefined,
      'tabindex': 0,
      'hidden': !this.selected,
      'data-state': this.selected ? 'active' : 'inactive',
    };

    return (
      <Host {...contentProps} class={cn(tabsContentVariants(), 'and-tab-content', this.selected ? 'block' : 'hidden')}>
        <slot />
      </Host>
    );
  }
}

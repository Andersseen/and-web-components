import { Component, h, Host, Prop } from '@stencil/core';
import { cn } from '../../utils/cn';
import { tabsListVariants } from './and-tabs-list-variants';

/**
 * `role="tablist"` wrapper for `and-tabs-trigger` children. Purely a
 * layout/labeling wrapper — keyboard navigation lives in the triggers,
 * driven by the headless logic from the `and-tabs` ancestor.
 *
 * @example
 * ```html
 * <and-tabs-list>
 *   <and-tabs-trigger value="tab-1">Tab 1</and-tabs-trigger>
 * </and-tabs-list>
 * ```
 */
@Component({
  tag: 'and-tabs-list',
  styleUrls: ['and-tabs.css', '../../global/component-base.css'],
  shadow: true,
})
export class AndTabsList {
  /** Orientation of the tab list. */
  @Prop({ reflect: true }) orientation: 'horizontal' | 'vertical' = 'horizontal';

  render() {
    return (
      <Host role="tablist" aria-orientation={this.orientation} class={cn(tabsListVariants())}>
        <slot />
      </Host>
    );
  }
}

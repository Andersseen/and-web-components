import { Component, Host, h, Prop } from '@stencil/core';
import { cn } from '../../utils/cn';

/* ────────────────────────────────────────────────────────────────────
 * Component
 * ──────────────────────────────────────────────────────────────────── */

/**
 * Main body region of an `and-card`, padded on all sides except the top
 * (so it sits flush under `and-card-header`).
 *
 * @example
 * ```html
 * <and-card-content>Body content</and-card-content>
 * ```
 */
@Component({
  tag: 'and-card-content',
  styleUrls: ['and-card-content.css', '../../global/component-base.css'],
  shadow: true,
})
export class AndCardContent {
  /** Additional CSS classes from the consumer. */
  @Prop({ attribute: 'class' }) customClass: string = '';

  render() {
    return (
      <Host class={cn('p-4 pt-0 sm:p-6 sm:pt-0', this.customClass)}>
        <slot />
      </Host>
    );
  }
}

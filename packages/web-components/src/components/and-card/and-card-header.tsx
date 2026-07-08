import { Component, Host, h, Prop } from '@stencil/core';
import { cn } from '../../utils/cn';

/* ────────────────────────────────────────────────────────────────────
 * Component
 * ──────────────────────────────────────────────────────────────────── */

/**
 * Header region of an `and-card` — typically wraps `and-card-title` and
 * `and-card-description`.
 *
 * @example
 * ```html
 * <and-card-header>
 *   <and-card-title>Title</and-card-title>
 * </and-card-header>
 * ```
 */
@Component({
  tag: 'and-card-header',
  styleUrls: ['and-card-header.css', '../../global/component-base.css'],
  shadow: true,
})
export class AndCardHeader {
  /** Additional CSS classes from the consumer. */
  @Prop({ attribute: 'class' }) customClass: string = '';

  render() {
    return (
      <Host class={cn('flex flex-col gap-y-1.5 p-4 sm:p-6', this.customClass)}>
        <slot />
      </Host>
    );
  }
}

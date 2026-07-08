import { Component, Prop, h, Host } from '@stencil/core';
import { cn } from '../../utils/cn';
import { badgeVariants, type BadgeVariantProps } from './and-badge-variants';

/**
 * Small label for status, category, or count. Purely presentational — it
 * has no default ARIA role, since forcing `role="status"` on every badge
 * would mislabel static labels (e.g. "Beta") as live regions and cause
 * screen readers to announce them as if they update. If a specific badge
 * *does* represent a live status (e.g. an unread count), add
 * `role="status"` on the instance yourself.
 *
 * @example
 * ```html
 * <and-badge variant="destructive">3 errors</and-badge>
 * ```
 */
@Component({
  tag: 'and-badge',
  styleUrls: ['and-badge.css', '../../global/component-base.css'],
  shadow: true,
})
export class AndBadge {
  /** Visual variant of the badge. */
  @Prop({ reflect: true }) variant: BadgeVariantProps['variant'] = 'default';

  /** Additional CSS classes from the consumer. */
  @Prop({ attribute: 'class' }) customClass: string = '';

  render() {
    return (
      <Host class={cn(badgeVariants({ variant: this.variant }), this.customClass)}>
        <slot />
      </Host>
    );
  }
}

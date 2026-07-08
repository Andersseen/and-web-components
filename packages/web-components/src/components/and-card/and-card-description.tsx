import { Component, Host, h, Prop } from '@stencil/core';
import { cn } from '../../utils/cn';

/* ────────────────────────────────────────────────────────────────────
 * Component
 * ──────────────────────────────────────────────────────────────────── */

/**
 * Secondary, muted text for an `and-card` — typically a one-line summary
 * placed under `and-card-title` inside `and-card-header`.
 *
 * @example
 * ```html
 * <and-card-description>Supporting text</and-card-description>
 * ```
 */
@Component({
  tag: 'and-card-description',
  styleUrls: ['and-card-description.css', '../../global/component-base.css'],
  shadow: true,
})
export class AndCardDescription {
  /** Additional CSS classes from the consumer. */
  @Prop({ attribute: 'class' }) customClass: string = '';

  render() {
    return (
      <Host class={cn('text-sm text-muted-foreground', this.customClass)}>
        <slot />
      </Host>
    );
  }
}

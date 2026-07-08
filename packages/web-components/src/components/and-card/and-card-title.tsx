import { Component, Host, h, Prop } from '@stencil/core';
import { cn } from '../../utils/cn';

/* ────────────────────────────────────────────────────────────────────
 * Component
 * ──────────────────────────────────────────────────────────────────── */

/**
 * Title text for an `and-card`. Exposed to assistive tech as a real
 * heading (`role="heading"` + `aria-level`) rather than a styled `<div>`,
 * so it shows up in a screen reader's heading navigation. Set `level` to
 * match where the card sits in your document's heading hierarchy —
 * it defaults to `3` (page title → section → card title), but skipping or
 * duplicating levels confuses that navigation, so adjust it per page.
 *
 * @example
 * ```html
 * <and-card-title level="2">Title</and-card-title>
 * ```
 */
@Component({
  tag: 'and-card-title',
  styleUrls: ['and-card-title.css', '../../global/component-base.css'],
  shadow: true,
})
export class AndCardTitle {
  /** Heading level exposed to assistive tech via `aria-level`. */
  @Prop({ reflect: true }) level: 1 | 2 | 3 | 4 | 5 | 6 = 3;

  /** Additional CSS classes from the consumer. */
  @Prop({ attribute: 'class' }) customClass: string = '';

  render() {
    return (
      <Host
        class={cn('text-2xl font-semibold leading-none tracking-tight', this.customClass)}
        role="heading"
        aria-level={this.level}
      >
        <slot />
      </Host>
    );
  }
}

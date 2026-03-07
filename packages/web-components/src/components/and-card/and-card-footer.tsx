import { Component, Host, h, Prop } from '@stencil/core';
import { cn } from '../../utils/cn';

/* ────────────────────────────────────────────────────────────────────
 * Component
 * ──────────────────────────────────────────────────────────────────── */

@Component({
  tag: 'and-card-footer',
  styleUrls: ['and-card-footer.css', '../../global/global.css'],
  shadow: true,
})
export class AndCardFooter {
  /** Additional CSS classes from the consumer. */
  @Prop({ attribute: 'class' }) customClass: string;

  render() {
    return (
      <Host class={cn('flex items-center p-4 pt-0 sm:p-6 sm:pt-0', this.customClass)}>
        <slot />
      </Host>
    );
  }
}

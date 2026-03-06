import { Component, Host, h, Prop } from '@stencil/core';
import { cn } from '../../utils/cn';

/* ────────────────────────────────────────────────────────────────────
 * Component
 * ──────────────────────────────────────────────────────────────────── */

@Component({
  tag: 'and-card-title',
  styleUrls: ['and-card-title.css', '../../global/global.css'],
  shadow: true,
})
export class AndCardTitle {
  /** Additional CSS classes from the consumer. */
  @Prop({ attribute: 'class' }) customClass: string;

  render() {
    return (
      <Host
        class={cn(
          'text-2xl font-semibold leading-none tracking-tight',
          this.customClass,
        )}
      >
        <slot />
      </Host>
    );
  }
}

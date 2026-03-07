import { Component, Host, h, Prop } from '@stencil/core';
import { cn } from '../../utils/cn';

/* ────────────────────────────────────────────────────────────────────
 * Component
 * ──────────────────────────────────────────────────────────────────── */

@Component({
  tag: 'and-card-description',
  styleUrls: ['and-card-description.css', '../../global/global.css'],
  shadow: true,
})
export class AndCardDescription {
  /** Additional CSS classes from the consumer. */
  @Prop({ attribute: 'class' }) customClass: string;

  render() {
    return (
      <Host
        class={cn(
          'text-sm text-muted-foreground',
          this.customClass,
        )}
      >
        <slot />
      </Host>
    );
  }
}

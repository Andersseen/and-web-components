import { Component, Host, h, Prop } from '@stencil/core';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';

/* ────────────────────────────────────────────────────────────────────
 * Variants
 * ──────────────────────────────────────────────────────────────────── */

const cardVariants = cva(
  'rounded-lg border bg-card text-card-foreground shadow-md transition-shadow duration-normal p-4 sm:p-6',
  {
    variants: {
      variant: {
        default: 'border-border',
        destructive: 'border-destructive/50 text-destructive dark:border-destructive',
        elevated: 'shadow-lg border-border',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export type CardVariantProps = VariantProps<typeof cardVariants>;

/* ────────────────────────────────────────────────────────────────────
 * Component
 * ──────────────────────────────────────────────────────────────────── */

@Component({
  tag: 'and-card',
  styleUrls: ['and-card.css', '../../global/global.css'],
  shadow: true,
})
export class AndCard {
  /** Visual variant of the card. */
  @Prop({ reflect: true }) variant: CardVariantProps['variant'] = 'default';

  /** Additional CSS classes from the consumer. */
  @Prop({ attribute: 'class' }) customClass: string;

  render() {
    return (
      <Host class={cn(cardVariants({ variant: this.variant }), this.customClass)}>
        <slot />
      </Host>
    );
  }
}

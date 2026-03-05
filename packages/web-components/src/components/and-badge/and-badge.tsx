import { Component, Prop, h, Host } from '@stencil/core';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';

/* ────────────────────────────────────────────────────────────────────
 * Variants
 * ──────────────────────────────────────────────────────────────────── */

const badgeVariants = cva(
  [
    'inline-flex items-center rounded-lg border px-2.5 py-0.5 text-xs font-semibold',
    'transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  ].join(' '),
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
        secondary: 'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive: 'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
        outline: 'text-foreground border-border',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export type BadgeVariantProps = VariantProps<typeof badgeVariants>;

/* ────────────────────────────────────────────────────────────────────
 * Component
 * ──────────────────────────────────────────────────────────────────── */

@Component({
  tag: 'and-badge',
  styleUrls: ['and-badge.css', '../../global/global.css'],
  shadow: true,
})
export class AndBadge {
  /** Visual variant of the badge. */
  @Prop({ reflect: true }) variant: BadgeVariantProps['variant'] = 'default';

  /** Additional CSS classes from the consumer. */
  @Prop({ attribute: 'class' }) customClass: string;

  render() {
    return (
      <Host
        role="status"
        class={cn(badgeVariants({ variant: this.variant }), this.customClass)}
      >
        <slot />
      </Host>
    );
  }
}

import { Component, h, Host, Prop, Element } from '@stencil/core';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';

/* ────────────────────────────────────────────────────────────────────
 * Variants
 * ──────────────────────────────────────────────────────────────────── */

const breadcrumbVariants = cva(
  'flex items-center text-muted-foreground font-sans',
  {
    variants: {
      size: {
        sm: 'text-xs gap-1',
        md: 'text-sm gap-1.5',
        lg: 'text-base gap-2',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
);

export type BreadcrumbVariantProps = VariantProps<typeof breadcrumbVariants>;

/* ────────────────────────────────────────────────────────────────────
 * Component
 * ──────────────────────────────────────────────────────────────────── */

@Component({
  tag: 'and-breadcrumb',
  styleUrls: ['and-breadcrumb.css', '../../global/global.css'],
  shadow: true,
})
export class AndBreadcrumb {
  @Element() el: HTMLElement;

  /** Size variant for the breadcrumb trail. */
  @Prop({ reflect: true }) size: BreadcrumbVariantProps['size'] = 'md';

  /** Additional CSS classes to merge with internal styles. */
  @Prop({ attribute: 'class' }) customClass: string;

  /* ── Render ─────────────────────────────────────────────────────── */

  render() {
    const classes = cn(breadcrumbVariants({ size: this.size }), this.customClass);

    return (
      <Host>
        <nav aria-label="breadcrumb">
          <ol class={classes}>
            <slot />
          </ol>
        </nav>
      </Host>
    );
  }
}

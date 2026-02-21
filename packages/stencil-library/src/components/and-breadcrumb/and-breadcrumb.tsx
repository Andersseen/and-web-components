import { Component, h, Host, Prop, Element, State } from '@stencil/core';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';
import { createBreadcrumb, type BreadcrumbReturn } from '@andersseen/headless-components';

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

  /** Accessible label for the breadcrumb navigation. */
  @Prop({ attribute: 'aria-label' }) navLabel: string = 'Breadcrumb';

  /** Additional CSS classes to merge with internal styles. */
  @Prop({ attribute: 'class' }) customClass: string;

  @State() private breadcrumbLogic: BreadcrumbReturn;

  /* ── Lifecycle ──────────────────────────────────────────────────── */

  componentWillLoad() {
    this.breadcrumbLogic = createBreadcrumb({
      ariaLabel: this.navLabel,
    });
  }

  /* ── Render ─────────────────────────────────────────────────────── */

  render() {
    const navProps = this.breadcrumbLogic?.getNavProps() || {};
    const listProps = this.breadcrumbLogic?.getListProps() || {};
    const classes = cn(breadcrumbVariants({ size: this.size }), this.customClass);

    return (
      <Host>
        <nav {...navProps}>
          <ol {...listProps} class={classes}>
            <slot />
          </ol>
        </nav>
      </Host>
    );
  }
}

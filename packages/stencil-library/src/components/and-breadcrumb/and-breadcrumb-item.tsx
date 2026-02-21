import { Component, h, Host, Prop, Element } from '@stencil/core';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';

/* ────────────────────────────────────────────────────────────────────
 * Variants
 * ──────────────────────────────────────────────────────────────────── */

const breadcrumbItemVariants = cva(
  'inline-flex items-center font-sans transition-colors',
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

const separatorSizeMap: Record<string, string> = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
};

export type BreadcrumbItemVariantProps = VariantProps<typeof breadcrumbItemVariants>;

/* ────────────────────────────────────────────────────────────────────
 * Component
 * ──────────────────────────────────────────────────────────────────── */

@Component({
  tag: 'and-breadcrumb-item',
  styleUrls: ['and-breadcrumb.css', '../../global/global.css'],
  shadow: true,
})
export class AndBreadcrumbItem {
  @Element() el: HTMLElement;

  /** Optional URL. When set, the item renders as a link. */
  @Prop() href: string;

  /** Marks this item as the current page (adds aria-current). */
  @Prop({ reflect: true }) current: boolean = false;

  /** Size variant — should match the parent breadcrumb size. */
  @Prop({ reflect: true }) size: BreadcrumbItemVariantProps['size'] = 'md';

  /** Hide the leading separator (typically for the first item). */
  @Prop({ reflect: true }) hideSeparator: boolean = false;

  /** Additional CSS classes to merge with internal styles. */
  @Prop({ attribute: 'class' }) customClass: string;

  /* ── Render ─────────────────────────────────────────────────────── */

  render() {
    const linkClasses = cn(
      breadcrumbItemVariants({ size: this.size }),
      this.current
        ? 'text-foreground font-medium pointer-events-none'
        : 'text-muted-foreground hover:text-foreground',
      this.customClass,
    );

    const separatorClasses = cn(
      'text-muted-foreground/60 select-none flex items-center',
      separatorSizeMap[this.size || 'md'],
    );

    const Tag = this.href && !this.current ? 'a' : 'span';

    return (
      <Host>
        <li class="inline-flex items-center">
          {/* Separator */}
          {!this.hideSeparator && (
            <span class={separatorClasses} aria-hidden="true">
              <slot name="separator">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="shrink-0"
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </slot>
            </span>
          )}

          {/* Content */}
          <Tag
            class={linkClasses}
            {...(this.href && !this.current ? { href: this.href } : {})}
            {...(this.current ? { 'aria-current': 'page' } : {})}
          >
            <slot />
          </Tag>
        </li>
      </Host>
    );
  }
}

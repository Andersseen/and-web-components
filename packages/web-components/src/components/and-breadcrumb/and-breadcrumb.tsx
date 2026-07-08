import { Component, h, Host, Prop, Element, State } from '@stencil/core';
import { cn } from '../../utils/cn';
import { createBreadcrumb, type BreadcrumbReturn } from '@andersseen/headless-components';
import { breadcrumbVariants, type BreadcrumbVariantProps } from './and-breadcrumb-variants';

/**
 * Navigation trail showing the user's location in a hierarchy. Renders a
 * `<nav aria-label>` wrapping an `<ol>` — group `and-breadcrumb-item`
 * children inside it, marking the last one `current`.
 *
 * @example
 * ```html
 * <and-breadcrumb>
 *   <and-breadcrumb-item href="/">Home</and-breadcrumb-item>
 *   <and-breadcrumb-item href="/docs">Docs</and-breadcrumb-item>
 *   <and-breadcrumb-item current="true">Current page</and-breadcrumb-item>
 * </and-breadcrumb>
 * ```
 */
@Component({
  tag: 'and-breadcrumb',
  styleUrls: ['and-breadcrumb.css', '../../global/component-base.css'],
  shadow: true,
})
export class AndBreadcrumb {
  @Element() el!: HTMLElement;

  /** Size variant for the breadcrumb trail. */
  @Prop({ reflect: true }) size: BreadcrumbVariantProps['size'] = 'md';

  /** Accessible label for the breadcrumb navigation. */
  @Prop({ attribute: 'aria-label' }) navLabel: string = 'Breadcrumb';

  /** Additional CSS classes to merge with internal styles. */
  @Prop({ attribute: 'class' }) customClass: string = '';

  @State() private breadcrumbLogic!: BreadcrumbReturn;

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

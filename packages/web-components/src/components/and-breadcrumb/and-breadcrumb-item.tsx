import { Component, h, Host, Prop, Element, State, Event, EventEmitter } from '@stencil/core';
import { cn } from '../../utils/cn';
import { createBreadcrumb, type BreadcrumbReturn, type BreadcrumbItemConfig } from '@andersseen/headless-components';
import {
  breadcrumbItemVariants,
  separatorSizeMap,
  type BreadcrumbItemVariantProps,
} from './and-breadcrumb-item-variants';

/**
 * One entry in an `and-breadcrumb` trail. Renders as a link when `href` is
 * set, or a non-interactive `<span>` for the current page. The current
 * item automatically gets `aria-current="page"` — don't set both `current`
 * and `href` expecting a clickable "you are here" link, since `current`
 * disables pointer interaction on purpose.
 *
 * @example
 * ```html
 * <and-breadcrumb-item href="/docs">Docs</and-breadcrumb-item>
 * <and-breadcrumb-item current="true">Current page</and-breadcrumb-item>
 * ```
 */
@Component({
  tag: 'and-breadcrumb-item',
  styleUrls: ['and-breadcrumb.css', '../../global/component-base.css'],
  shadow: true,
})
export class AndBreadcrumbItem {
  @Element() el!: HTMLElement;

  /** Optional URL. When set, the item renders as a link. */
  @Prop() href!: string;

  /** Marks this item as the current page (adds aria-current). */
  @Prop({ reflect: true }) current: boolean = false;

  /** Size variant — should match the parent breadcrumb size. */
  @Prop({ reflect: true }) size: BreadcrumbItemVariantProps['size'] = 'md';

  /** Hide the leading separator (typically for the first item). */
  @Prop({ reflect: true }) hideSeparator: boolean = false;

  /** Additional CSS classes to merge with internal styles. */
  @Prop({ attribute: 'class' }) customClass: string = '';

  /** Emitted when a breadcrumb link is activated. */
  @Event({ bubbles: true, composed: true }) andBreadcrumbNavigate!: EventEmitter<string>;

  @State() private itemLogic!: BreadcrumbReturn;

  /* ── Lifecycle ──────────────────────────────────────────────────── */

  componentWillLoad() {
    this.itemLogic = createBreadcrumb({
      onNavigate: (item: BreadcrumbItemConfig) => {
        this.andBreadcrumbNavigate.emit(item.href);
      },
    });
  }

  /* ── Render ─────────────────────────────────────────────────────── */

  render() {
    const itemConfig: BreadcrumbItemConfig = {
      id: this.href || 'current',
      label: '',
      href: this.href,
      current: this.current,
    };

    const itemProps = this.itemLogic?.getItemProps(itemConfig) || {};
    const linkProps = this.itemLogic?.getLinkProps(itemConfig) || {};

    const linkClasses = cn(
      breadcrumbItemVariants({ size: this.size }),
      this.current ? 'text-foreground font-medium pointer-events-none' : 'text-muted-foreground hover:text-foreground',
      this.customClass,
    );

    const separatorClasses = cn(
      'text-muted-foreground/60 select-none flex items-center',
      separatorSizeMap[this.size || 'md'],
    );

    const Tag = this.href && !this.current ? 'a' : 'span';

    return (
      <Host>
        <li class="inline-flex items-center" {...itemProps}>
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
            {...linkProps}
            onKeyDown={(e: KeyboardEvent) => this.itemLogic?.handleKeyDown(e, itemConfig)}
          >
            <slot />
          </Tag>
        </li>
      </Host>
    );
  }
}

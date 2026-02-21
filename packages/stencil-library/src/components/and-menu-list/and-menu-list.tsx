import { Component, h, Host, Prop, Element, State } from '@stencil/core';
import { cn } from '../../utils/cn';
import { createMenuList, type MenuListReturn } from '@andersseen/headless-components';

/* ────────────────────────────────────────────────────────────────────
 * Base Styles
 * ──────────────────────────────────────────────────────────────────── */

const menuListBaseClass = [
  'flex flex-col gap-0.5 p-1',
  'rounded-md',
  'text-foreground font-sans',
].join(' ');

/* ────────────────────────────────────────────────────────────────────
 * Component
 * ──────────────────────────────────────────────────────────────────── */

@Component({
  tag: 'and-menu-list',
  styleUrls: ['and-menu-list.css', '../../global/global.css'],
  shadow: true,
})
export class AndMenuList {
  @Element() el: HTMLElement;

  /** Accessible label for the menu. */
  @Prop() ariaMenuLabel: string = 'Menu';

  /** Additional CSS classes to merge with internal styles. */
  @Prop({ attribute: 'class' }) customClass: string;

  @State() private menuLogic: MenuListReturn;

  /* ── Lifecycle ──────────────────────────────────────────────────── */

  componentWillLoad() {
    this.menuLogic = createMenuList({
      ariaLabel: this.ariaMenuLabel,
    });
  }

  /* ── Render ─────────────────────────────────────────────────────── */

  render() {
    const menuProps = this.menuLogic?.getMenuProps() || {};
    const classes = cn(menuListBaseClass, this.customClass);

    return (
      <Host>
        <ul
          {...menuProps}
          class={classes}
          onKeyDown={(e: KeyboardEvent) => this.menuLogic?.handleMenuKeyDown(e)}
        >
          <slot />
        </ul>
      </Host>
    );
  }
}

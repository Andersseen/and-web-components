import { Component, h, Host, Prop, Element, State, Watch } from '@stencil/core';
import { cn } from '../../utils/cn';
import { createMenuList, type MenuListReturn } from '@andersseen/headless-components';

/* ────────────────────────────────────────────────────────────────────
 * Base Styles
 * ──────────────────────────────────────────────────────────────────── */

const menuListBaseClass = ['flex flex-col gap-0.5 p-1', 'rounded-md', 'text-foreground font-sans'].join(' ');

/* ────────────────────────────────────────────────────────────────────
 * Component
 * ──────────────────────────────────────────────────────────────────── */

@Component({
  tag: 'and-menu-list',
  styleUrls: ['and-menu-list.css', '../../global/component-base.css'],
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

  @Watch('ariaMenuLabel')
  ariaMenuLabelChanged(newValue: string) {
    this.menuLogic?.actions.setItems(this.menuLogic.state.items);
    // Note: headless menu-list doesn't expose a setAriaLabel action;
    // re-creating is the simplest way to update the label.
    this.menuLogic = createMenuList({
      ariaLabel: newValue,
      items: this.menuLogic.state.items,
    });
  }

  /* ── Render ─────────────────────────────────────────────────────── */

  render() {
    const menuProps = this.menuLogic?.getMenuProps() || {};
    const classes = cn(menuListBaseClass, this.customClass);

    return (
      <Host>
        <ul {...menuProps} class={classes} onKeyDown={(e: KeyboardEvent) => this.menuLogic?.handleMenuKeyDown(e)}>
          <slot />
        </ul>
      </Host>
    );
  }
}

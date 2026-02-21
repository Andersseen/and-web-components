import { Component, h, Host, Prop, Element } from '@stencil/core';
import { cn } from '../../utils/cn';

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

  /* ── Render ─────────────────────────────────────────────────────── */

  render() {
    const classes = cn(menuListBaseClass, this.customClass);

    return (
      <Host>
        <ul role="menu" aria-label={this.ariaMenuLabel} class={classes}>
          <slot />
        </ul>
      </Host>
    );
  }
}

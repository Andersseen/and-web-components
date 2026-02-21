import { Component, h, Host, Prop, Element, Event, EventEmitter } from '@stencil/core';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';

/* ────────────────────────────────────────────────────────────────────
 * Variants
 * ──────────────────────────────────────────────────────────────────── */

const menuItemVariants = cva(
  [
    'relative flex w-full cursor-pointer select-none items-center',
    'rounded-md px-2 py-1.5 text-sm font-sans outline-none',
    'transition-colors duration-normal',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
  ].join(' '),
  {
    variants: {
      intent: {
        default: [
          'text-foreground',
          'hover:bg-accent hover:text-accent-foreground',
          'focus:bg-accent focus:text-accent-foreground',
        ].join(' '),
        destructive: [
          'text-destructive',
          'hover:bg-destructive/10 hover:text-destructive',
          'focus:bg-destructive/10 focus:text-destructive',
        ].join(' '),
      },
      disabled: {
        true: 'opacity-50 pointer-events-none cursor-default',
        false: '',
      },
    },
    defaultVariants: {
      intent: 'default',
      disabled: false,
    },
  },
);

export type MenuItemVariantProps = VariantProps<typeof menuItemVariants>;

/* ────────────────────────────────────────────────────────────────────
 * Component
 * ──────────────────────────────────────────────────────────────────── */

@Component({
  tag: 'and-menu-item',
  styleUrls: ['and-menu-list.css', '../../global/global.css'],
  shadow: true,
})
export class AndMenuItem {
  @Element() el: HTMLElement;

  /** Intent variant (default or destructive). */
  @Prop({ reflect: true }) intent: MenuItemVariantProps['intent'] = 'default';

  /** Disables the menu item when true. */
  @Prop({ reflect: true }) disabled: boolean = false;

  /** Optional value identifier for the item. */
  @Prop() value: string;

  /** Additional CSS classes to merge with internal styles. */
  @Prop({ attribute: 'class' }) customClass: string;

  /** Emitted when the item is selected (clicked or Enter/Space pressed). */
  @Event({ bubbles: true, composed: true }) andMenuItemSelect: EventEmitter<string>;

  /* ── Handlers ───────────────────────────────────────────────────── */

  private handleClick = () => {
    if (!this.disabled) {
      this.andMenuItemSelect.emit(this.value);
    }
  };

  private handleKeyDown = (e: KeyboardEvent) => {
    if (this.disabled) return;

    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this.andMenuItemSelect.emit(this.value);
    }
  };

  /* ── Render ─────────────────────────────────────────────────────── */

  render() {
    const classes = cn(
      menuItemVariants({ intent: this.intent, disabled: this.disabled }),
      this.customClass,
    );

    return (
      <Host>
        <li
          role="menuitem"
          tabindex={this.disabled ? -1 : 0}
          aria-disabled={this.disabled ? 'true' : null}
          class={classes}
          onClick={this.handleClick}
          onKeyDown={this.handleKeyDown}
        >
          <slot name="start" />
          <slot />
          <slot name="end" />
        </li>
      </Host>
    );
  }
}

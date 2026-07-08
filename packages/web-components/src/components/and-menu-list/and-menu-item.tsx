import { Component, h, Host, Prop, Element, Event, EventEmitter, State } from '@stencil/core';
import { cn } from '../../utils/cn';
import { createMenuList, type MenuListReturn } from '@andersseen/headless-components';
import { menuItemVariants, type MenuItemVariantProps } from './and-menu-item-variants';

/**
 * Standalone menu item (`role="menuitem"`), self-contained rather than
 * coordinated by a parent `and-menu-list` — use it when you want to slot
 * individual items directly (e.g. inside `and-dropdown`'s `trigger` slot
 * content) instead of driving `and-menu-list` from an `items` array.
 * Responds to click and Enter/Space.
 *
 * @example
 * ```html
 * <and-menu-item value="delete" intent="destructive">Delete</and-menu-item>
 * ```
 */
@Component({
  tag: 'and-menu-item',
  styleUrls: ['and-menu-list.css', '../../global/component-base.css'],
  shadow: true,
})
export class AndMenuItem {
  @Element() el!: HTMLElement;

  /** Intent variant (default or destructive). */
  @Prop({ reflect: true }) intent: MenuItemVariantProps['intent'] = 'default';

  /** Disables the menu item when true. */
  @Prop({ reflect: true }) disabled: boolean = false;

  /** Optional value identifier for the item. */
  @Prop() value!: string;

  /** Additional CSS classes to merge with internal styles. */
  @Prop({ attribute: 'class' }) customClass: string = '';

  /** Emitted when the item is selected (clicked or Enter/Space pressed). */
  @Event({ bubbles: true, composed: true }) andMenuItemSelect!: EventEmitter<string>;

  @State() private menuItemLogic!: MenuListReturn;

  /* ── Lifecycle ──────────────────────────────────────────────────── */

  componentWillLoad() {
    this.menuItemLogic = createMenuList({
      items: [{ id: this.value, intent: this.intent as 'default' | 'destructive', disabled: this.disabled }],
      onSelect: (id: string) => {
        this.andMenuItemSelect.emit(id);
      },
    });
  }

  /* ── Handlers ───────────────────────────────────────────────────── */

  private handleClick = () => {
    if (!this.disabled) {
      this.menuItemLogic?.actions.selectItem(this.value);
    }
  };

  private handleKeyDown = (e: KeyboardEvent) => {
    if (this.disabled) {
      return;
    }
    const itemConfig = { id: this.value, intent: this.intent as 'default' | 'destructive', disabled: this.disabled };
    this.menuItemLogic?.handleItemKeyDown(e, itemConfig);
  };

  /* ── Render ─────────────────────────────────────────────────────── */

  render() {
    const itemConfig = { id: this.value, intent: this.intent as 'default' | 'destructive', disabled: this.disabled };
    const itemProps = this.menuItemLogic?.getItemProps(itemConfig, 0) || {};

    const classes = cn(menuItemVariants({ intent: this.intent, disabled: this.disabled }), this.customClass);

    return (
      <Host>
        <li {...itemProps} class={classes} onClick={this.handleClick} onKeyDown={this.handleKeyDown}>
          <slot name="start" />
          <slot />
          <slot name="end" />
        </li>
      </Host>
    );
  }
}

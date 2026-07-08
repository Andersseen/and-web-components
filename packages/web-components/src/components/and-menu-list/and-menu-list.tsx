import { Component, h, Host, Prop, Element, State, Watch, Event, EventEmitter } from '@stencil/core';
import { cn } from '../../utils/cn';
import {
  createMenuList,
  type MenuItemConfig,
  type MenuItemProps,
  type MenuListReturn,
} from '@andersseen/headless-components';
import { menuListVariants, menuListItemVariants } from './and-menu-list-variants';

/**
 * Data-driven menu (`role="menu"`) that renders `items` as keyboard-navigable
 * `role="menuitem"` entries — arrow keys, Home/End, and typeahead are
 * handled for you. Omit `items` to slot arbitrary content instead (e.g.
 * `and-menu-item` elements), in which case this component only renders
 * the `<ul>` wrapper and doesn't manage focus for you.
 *
 * @example
 * ```html
 * <and-menu-list items='[{"id":"a","label":"Item A"},{"id":"b","label":"Item B"}]'>
 * </and-menu-list>
 * ```
 */
@Component({
  tag: 'and-menu-list',
  styleUrls: ['and-menu-list.css', '../../global/component-base.css'],
  shadow: true,
})
export class AndMenuList {
  @Element() el!: HTMLElement;

  /** Accessible label for the menu. */
  @Prop() ariaMenuLabel: string = 'Menu';

  /** Optional items to render. When provided, keyboard navigation is coordinated by this component. */
  @Prop() items: MenuItemConfig[] = [];

  /** Additional CSS classes to merge with internal styles. */
  @Prop({ attribute: 'class' }) customClass: string = '';

  /** Emitted when an item is selected. */
  @Event({ bubbles: true, composed: true }) andMenuItemSelect!: EventEmitter<string>;

  @State() private menuLogic!: MenuListReturn;
  @State() private renderTick = 0;

  private unsubscribe?: () => void;
  private itemRefs = new Map<number, HTMLLIElement>();

  /* ── Lifecycle ──────────────────────────────────────────────────── */

  componentWillLoad() {
    this.menuLogic = createMenuList({
      ariaLabel: this.ariaMenuLabel,
      items: this.items,
      onSelect: (id: string) => this.andMenuItemSelect.emit(id),
    });
    this.unsubscribe = this.menuLogic.subscribe(() => {
      // Force re-render so tabindex/active states update.
      this.renderTick++;
    });
  }

  disconnectedCallback() {
    this.unsubscribe?.();
  }

  @Watch('ariaMenuLabel')
  ariaMenuLabelChanged(newValue: string) {
    this.menuLogic = createMenuList({
      ariaLabel: newValue,
      items: this.menuLogic.state.items,
      onSelect: (id: string) => this.andMenuItemSelect.emit(id),
    });
  }

  @Watch('items')
  itemsChanged(newValue: MenuItemConfig[]) {
    this.menuLogic?.actions.setItems(newValue);
  }

  /* ── Render ─────────────────────────────────────────────────────── */

  render() {
    const menuProps = this.menuLogic?.getMenuProps() || {};
    const classes = cn(menuListVariants(), this.customClass);

    return (
      <Host>
        <ul {...menuProps} class={classes} onKeyDown={(e: KeyboardEvent) => this.menuLogic?.handleMenuKeyDown(e)}>
          {this.items.length
            ? this.items.map((item, index) => {
                const itemProps: MenuItemProps = this.menuLogic?.getItemProps(item, index) ?? ({} as MenuItemProps);
                return (
                  <li
                    {...itemProps}
                    ref={(el: HTMLLIElement) => {
                      if (el) {
                        this.itemRefs.set(index, el);
                        if (itemProps.tabindex === 0) {
                          el.focus();
                        }
                      }
                    }}
                    class={cn(menuListItemVariants(), item.disabled && 'opacity-50 pointer-events-none')}
                    onClick={() => !item.disabled && this.menuLogic?.actions.selectItem(item.id!)}
                  >
                    {item.label}
                  </li>
                );
              })
            : null}
          {!this.items.length ? <slot /> : null}
        </ul>
      </Host>
    );
  }
}

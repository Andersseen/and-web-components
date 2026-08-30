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
 * `items` is a plain JS array, so it must be set as a property, not an HTML
 * attribute (the generated docs table reflects this: `Attribute: --`).
 *
 * @example
 * ```html
 * <and-menu-list id="menu"></and-menu-list>
 * <script>
 *   document.getElementById('menu').items = [
 *     { id: 'a', label: 'Item A' },
 *     { id: 'b', label: 'Item B' },
 *   ];
 * </script>
 * ```
 */
@Component({
  tag: 'and-menu-list',
  styleUrls: ['and-menu-list.css', '../../global/component-base.css'],
  shadow: true,
})
export class AndMenuList {
  @Element() el!: HTMLElement;

  /**
   * Accessible label for the menu, rendered as the `<ul>`'s real `aria-label`.
   * Named `menu-label`, not `aria-menu-label`: `aria-*` is reserved for the
   * standard ARIA vocabulary, and a made-up `aria-*` attribute is an
   * `aria-valid-attr` violation — this component shipped with exactly that
   * bug until it was caught live by axe (see and-context-menu's `menuLabel`,
   * which already used the correct naming).
   */
  @Prop() menuLabel: string = 'Menu';

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
      ariaLabel: this.menuLabel,
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

  @Watch('menuLabel')
  menuLabelChanged(newValue: string) {
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
        <ul
          {...menuProps}
          class={classes}
          onKeyDown={(e: KeyboardEvent) => {
            this.menuLogic?.handleMenuKeyDown(e);
            // Roving tabindex requires that the newly-active item also
            // receive real DOM focus, not just the tabindex/data-state
            // update — the `ref` callback below only fires when a list
            // node is first created, not on every state-driven re-render
            // of an already-mounted node (verified live: without this,
            // ArrowDown moved the visual/ARIA "active" item but left
            // keyboard focus stuck on the original one).
            const focusedIndex = this.menuLogic?.state.focusedIndex;
            if (focusedIndex !== undefined && focusedIndex >= 0) {
              this.itemRefs.get(focusedIndex)?.focus();
            }
          }}
        >
          {this.items.length
            ? this.items.map((item, index) => {
                const itemProps: MenuItemProps = this.menuLogic?.getItemProps(item, index) ?? ({} as MenuItemProps);
                return (
                  <li
                    {...itemProps}
                    ref={(el: HTMLLIElement) => {
                      if (el) {
                        // Only record the reference — must NOT call
                        // `.focus()` here. This ref callback fires on
                        // initial mount, when the first enabled item
                        // already renders tabindex="0" (so the menu has a
                        // real Tab stop); focusing it here would silently
                        // steal page focus the instant the menu appears,
                        // which and-menu-list never promised (unlike a
                        // dropdown/context-menu that explicitly opens).
                        this.itemRefs.set(index, el);
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

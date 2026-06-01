/**
 * Headless Menu List Component
 *
 * Provides state management and accessibility for menu/menuitem lists.
 * Handles keyboard navigation (arrow keys, Home, End), focus tracking,
 * intent variants, and disabled store.state.
 *
 * Now reactive: subscribe to state changes from any framework.
 */

import { createStore } from '../utils/store';
import type { AriaAttributes, DataAttributes, EventCallback } from '../types/common';
import { Keys } from '../types/common';

/**
 * Configuration for a single menu item
 */
export interface MenuItemConfig {
  /** Unique identifier / value for the item. Required for interactive items. */
  id?: string;

  /** Visible label. Useful for consumers that render from the headless config. */
  label?: string;

  /** Optional keyboard shortcut text. */
  shortcut?: string;

  /** Optional icon identifier. */
  icon?: string;

  /** Whether this row is a separator instead of a selectable item. */
  separator?: boolean;

  /** Visual intent of the item. */
  intent?: 'default' | 'destructive';

  /** Whether the item is disabled. */
  disabled?: boolean;
}

export type MenuInteractiveItem = MenuItemConfig & {
  id: string;
  separator?: false;
};

/**
 * Configuration options for creating a menu list
 */
export interface MenuListConfig {
  /**
   * Accessible label for the menu.
   * @default 'Menu'
   */
  ariaLabel?: string;

  /**
   * Registered menu items (order matters for keyboard navigation).
   */
  items?: MenuItemConfig[];

  /**
   * Callback when an item is selected.
   */
  onSelect?: EventCallback<string>;

  /**
   * Enable roving tabindex for keyboard navigation.
   * @default true
   */
  rovingFocus?: boolean;
}

/**
 * Menu list state
 */
export interface MenuListState {
  items: MenuItemConfig[];
  ariaLabel: string;
  /** Index of the currently focused item (-1 = none). */
  focusedIndex: number;
}

/**
 * Props for the <ul> menu element
 */
export interface MenuListProps extends AriaAttributes {
  'role': 'menu';
  'aria-label': string;
}

export interface MenuSeparatorProps extends DataAttributes {
  role: 'separator';
}

/**
 * Props for an individual <li> menu item
 */
export interface MenuItemProps extends AriaAttributes, DataAttributes {
  'role': 'menuitem';
  'tabindex': number;
  'aria-disabled'?: boolean;
  'data-state'?: 'active' | 'inactive';
  'data-disabled'?: boolean;
}

/**
 * Return type of createMenuList
 */
export interface MenuListReturn {
  /** Current store.state. */
  state: Readonly<MenuListState>;

  /**
   * Subscribe to state changes. Returns unsubscribe function.
   */
  subscribe: (callback: (state: Readonly<MenuListState>) => void) => () => void;

  /** Actions. */
  actions: {
    setItems: (items: MenuItemConfig[]) => void;
    focusItem: (index: number) => void;
    selectItem: (itemId: string) => void;
  };

  /** Queries for normalized item models. */
  queries: {
    getInteractiveItems: () => MenuInteractiveItem[];
    getInteractiveItemIds: () => string[];
    getItemIndex: (templateIndex: number) => number;
  };

  /** Get props for different elements. */
  getMenuProps: () => MenuListProps;
  getItemProps: (item: MenuItemConfig, index: number) => MenuItemProps;
  getSeparatorProps: () => MenuSeparatorProps;

  /** Keyboard handler to attach to the menu or individual items. */
  handleMenuKeyDown: (event: KeyboardEvent) => void;
  handleItemKeyDown: (event: KeyboardEvent, item: MenuItemConfig) => void;
}

/**
 * Create a headless menu list component
 *
 * @example
 * ```ts
 * const menu = createMenuList({
 *   ariaLabel: 'File actions',
 *   items: [
 *     { id: 'edit', intent: 'default' },
 *     { id: 'delete', intent: 'destructive' },
 *     { id: 'locked', disabled: true },
 *   ],
 *   onSelect: (id) => console.log('Selected:', id),
 * });
 *
 * const menuProps = menu.getMenuProps();
 * const itemProps = menu.getItemProps(item, index);
 * ```
 */
export function createMenuList(config: MenuListConfig = {}): MenuListReturn {
  const rovingFocus = config.rovingFocus ?? true;

  const store = createStore<MenuListState>({
    items: config.items ?? [],
    ariaLabel: config.ariaLabel ?? 'Menu',
    focusedIndex: -1,
  });

  /* ── Helpers ─────────────────────────────────────────────────────── */

  const isMenuItem = (item: MenuItemConfig): item is MenuInteractiveItem =>
    !item.separator && typeof item.id === 'string' && item.id.length > 0;

  const getInteractiveItems = (): MenuInteractiveItem[] =>
    store.state.items.filter(isMenuItem).filter(item => !item.disabled);

  const getInteractiveItemIds = (): string[] => getInteractiveItems().map(item => item.id);

  const getItemIndex = (templateIndex: number): number => {
    const item = store.state.items[templateIndex];
    if (!item || !isMenuItem(item)) {
      return -1;
    }

    return store.state.items.slice(0, templateIndex + 1).filter(isMenuItem).length - 1;
  };

  const getEnabledIndices = (): number[] =>
    store.state.items.reduce<number[]>((acc, item, i) => {
      if (isMenuItem(item) && !item.disabled) {
        acc.push(i);
      }
      return acc;
    }, []);

  const focusNext = (): void => {
    const enabled = getEnabledIndices();
    if (!enabled.length) {
      return;
    }

    const currentPos = enabled.indexOf(store.state.focusedIndex);
    const next = currentPos < enabled.length - 1 ? enabled[currentPos + 1] : enabled[0];
    store.setState({ focusedIndex: next });
  };

  const focusPrev = (): void => {
    const enabled = getEnabledIndices();
    if (!enabled.length) {
      return;
    }

    const currentPos = enabled.indexOf(store.state.focusedIndex);
    const prev = currentPos > 0 ? enabled[currentPos - 1] : enabled[enabled.length - 1];
    store.setState({ focusedIndex: prev });
  };

  const focusFirst = (): void => {
    const enabled = getEnabledIndices();
    if (enabled.length) {
      store.setState({ focusedIndex: enabled[0] });
    }
  };

  const focusLast = (): void => {
    const enabled = getEnabledIndices();
    if (enabled.length) {
      store.setState({ focusedIndex: enabled[enabled.length - 1] });
    }
  };

  /* ── Actions ─────────────────────────────────────────────────────── */

  const setItems = (items: MenuItemConfig[]): void => {
    store.setState({ items, focusedIndex: -1 });
  };

  const focusItem = (index: number): void => {
    const item = store.state.items[index];
    if (item && isMenuItem(item) && !item.disabled) {
      store.setState({ focusedIndex: index });
    }
  };

  const selectItem = (itemId: string): void => {
    const item = store.state.items.find(i => i.id === itemId);
    if (item && isMenuItem(item) && !item.disabled) {
      config.onSelect?.(itemId);
    }
  };

  /* ── Props getters ───────────────────────────────────────────────── */

  const getMenuProps = (): MenuListProps => ({
    'role': 'menu',
    'aria-label': store.state.ariaLabel,
  });

  const getItemProps = (item: MenuItemConfig, index: number): MenuItemProps => {
    const isFocused = rovingFocus && store.state.focusedIndex === index;
    return {
      'role': 'menuitem',
      'tabindex': isFocused || (!rovingFocus && isMenuItem(item) && !item.disabled) ? 0 : -1,
      ...(item.disabled ? { 'aria-disabled': true } : {}),
      'data-state': isFocused ? 'active' : 'inactive',
      ...(item.disabled ? { 'data-disabled': true } : {}),
    };
  };

  const getSeparatorProps = (): MenuSeparatorProps => ({
    role: 'separator',
  });

  /* ── Keyboard ────────────────────────────────────────────────────── */

  const handleMenuKeyDown = (event: KeyboardEvent): void => {
    switch (event.key) {
      case Keys.ArrowDown:
        event.preventDefault();
        focusNext();
        break;
      case Keys.ArrowUp:
        event.preventDefault();
        focusPrev();
        break;
      case Keys.Home:
        event.preventDefault();
        focusFirst();
        break;
      case Keys.End:
        event.preventDefault();
        focusLast();
        break;
      default:
        break;
    }
  };

  const handleItemKeyDown = (event: KeyboardEvent, item: MenuItemConfig): void => {
    if (!isMenuItem(item) || item.disabled) {
      return;
    }

    switch (event.key) {
      case Keys.Enter:
      case Keys.Space:
        event.preventDefault();
        selectItem(item.id);
        break;
      default:
        // Delegate arrow / Home / End to the menu-level handler
        handleMenuKeyDown(event);
        break;
    }
  };

  /* ── Return ──────────────────────────────────────────────────────── */

  return {
    get state() {
      return store.state;
    },
    subscribe: callback => {
      return store.subscribe(state => callback(state));
    },
    actions: {
      setItems,
      focusItem,
      selectItem,
    },
    queries: {
      getInteractiveItems,
      getInteractiveItemIds,
      getItemIndex,
    },
    getMenuProps,
    getItemProps,
    getSeparatorProps,
    handleMenuKeyDown,
    handleItemKeyDown,
  };
}

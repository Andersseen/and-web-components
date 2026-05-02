import type { EventCallback } from '../types/common';

/**
 * Payload emitted when a menu-backed disclosure selects an item.
 */
export interface MenuSelectEvent {
  itemId?: string;
}

/**
 * Shared selection behavior for dropdown-like menus.
 */
export interface MenuSelectionConfig {
  /**
   * Callback when an item is selected.
   */
  onSelect?: EventCallback<MenuSelectEvent>;

  /**
   * Close the menu after an item is selected.
   * @default true
   */
  closeOnSelect?: boolean;
}

export interface MenuSelectionReturn {
  selectItem: (itemId?: string) => void;
}

/**
 * Create shared menu selection behavior for disclosure primitives.
 */
export function createMenuSelection(config: MenuSelectionConfig, close: () => void): MenuSelectionReturn {
  const closeOnSelect = config.closeOnSelect ?? true;

  const selectItem = (itemId?: string): void => {
    config.onSelect?.({ itemId });

    if (closeOnSelect) {
      close();
    }
  };

  return {
    selectItem,
  };
}

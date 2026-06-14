/**
 * Headless Dropdown Component
 *
 * Provides state management and accessibility for dropdown/menu components.
 * Handles open/close states, keyboard navigation, and focus management.
 *
 * Now reactive: subscribe to state changes from any framework.
 */

import { createStore } from '../utils/store';
import type { AriaAttributes, DataAttributes, EventCallback } from '../types/common';
import { Keys } from '../types/common';
import { createMenuSelection, type MenuSelectEvent, type MenuSelectionConfig } from '../menu';

/**
 * Configuration options for creating a dropdown
 */
export interface DropdownConfig extends MenuSelectionConfig {
  /**
   * Initially open state
   * @default false
   */
  defaultOpen?: boolean;

  /**
   * Callback when open state changes
   */
  onOpenChange?: EventCallback<boolean>;

  /**
   * Close dropdown when an item is selected
   * @default true
   */
  closeOnSelect?: boolean;

  /**
   * Callback when a menu item is selected.
   */
  onSelect?: EventCallback<MenuSelectEvent>;

  /**
   * Placement of the dropdown relative to trigger
   * @default 'bottom'
   */
  placement?: 'top' | 'bottom' | 'left' | 'right';

  /**
   * Whether the dropdown is disabled
   * @default false
   */
  disabled?: boolean;
}

/**
 * Dropdown state
 */
export interface DropdownState {
  isOpen: boolean;
  placement: 'top' | 'bottom' | 'left' | 'right';
  disabled: boolean;
}

/**
 * Props for dropdown trigger element
 */
export interface DropdownTriggerProps extends AriaAttributes, DataAttributes {
  'aria-haspopup': 'menu';
  'aria-expanded': boolean;
  'aria-disabled': boolean;
  'data-state': 'open' | 'closed';
}

/**
 * Props for dropdown menu container
 */
export interface DropdownMenuProps extends AriaAttributes, DataAttributes {
  'role': 'menu';
  'data-state': 'open' | 'closed';
  'hidden': boolean;
}

/**
 * Props for dropdown menu item
 */
export interface DropdownItemProps extends AriaAttributes {
  role: 'menuitem';
  tabindex: number;
}

/**
 * Return type of createDropdown
 */
export interface DropdownReturn {
  /**
   * Current state
   */
  state: Readonly<DropdownState>;

  /**
   * Subscribe to state changes. Returns unsubscribe function.
   */
  subscribe: (callback: (state: Readonly<DropdownState>) => void) => () => void;

  /**
   * Actions
   */
  actions: {
    open: () => void;
    close: () => void;
    toggle: () => void;
    selectItem: (itemId?: string) => void;
    setDisabled: (disabled: boolean) => void;
  };

  /**
   * Queries
   */
  queries: {
    isOpen: () => boolean;
  };

  /**
   * Get props for different elements
   */
  getTriggerProps: () => DropdownTriggerProps;
  getContentProps: () => DropdownMenuProps;
  getItemProps: (itemId?: string) => DropdownItemProps;

  /**
   * Event handlers
   */
  handleTriggerKeyDown: (event: KeyboardEvent) => void;
  handleContentKeyDown: (event: KeyboardEvent, allItemIds: string[]) => void;
}

/**
 * Create a headless dropdown component
 *
 * @example
 * ```ts
 * const dropdown = createDropdown({
 *   placement: 'bottom',
 *   closeOnSelect: true,
 *   onOpenChange: (isOpen) => console.log('Open:', isOpen)
 * });
 *
 * // Toggle dropdown
 * dropdown.actions.toggle();
 *
 * // Get props
 * const triggerProps = dropdown.getTriggerProps();
 * const contentProps = dropdown.getContentProps();
 * const itemProps = dropdown.getItemProps('item-1');
 * ```
 */
export function createDropdown(config: DropdownConfig = {}): DropdownReturn {
  // Internal state
  const store = createStore<DropdownState>({
    isOpen: config.defaultOpen ?? false,
    placement: config.placement ?? 'bottom',
    disabled: config.disabled ?? false,
  });

  const notifyChange = (): void => {
    config.onOpenChange?.(store.state.isOpen);
  };

  // Actions
  const open = (): void => {
    if (store.state.disabled || store.state.isOpen) {
      return;
    }

    store.setState({ isOpen: true });
    notifyChange();
  };

  const close = (): void => {
    if (store.state.disabled || !store.state.isOpen) {
      return;
    }

    store.setState({ isOpen: false });
    notifyChange();
  };

  const toggle = (): void => {
    if (store.state.disabled) {
      return;
    }

    if (store.state.isOpen) {
      close();
    } else {
      open();
    }
  };

  const selectItem = (itemId?: string): void => {
    if (store.state.disabled) {
      return;
    }
    menuSelection.selectItem(itemId);
  };

  const menuSelection = createMenuSelection(config, close);

  const setDisabled = (disabled: boolean): void => {
    store.setState({ disabled });
    if (disabled && store.state.isOpen) {
      close();
    }
  };

  // Queries
  const isOpen = (): boolean => store.state.isOpen;

  // Get element props
  const getTriggerProps = (): DropdownTriggerProps => ({
    'aria-haspopup': 'menu',
    'aria-expanded': store.state.isOpen,
    'aria-disabled': store.state.disabled,
    'data-state': store.state.isOpen ? 'open' : 'closed',
  });

  const getContentProps = (): DropdownMenuProps => ({
    'role': 'menu',
    'data-state': store.state.isOpen ? 'open' : 'closed',
    'hidden': !store.state.isOpen,
  });

  const getItemProps = (_itemId?: string): DropdownItemProps => ({
    role: 'menuitem',
    tabindex: store.state.isOpen ? 0 : -1,
  });

  // Keyboard navigation
  const handleTriggerKeyDown = (event: KeyboardEvent): void => {
    if (store.state.disabled) {
      return;
    }

    switch (event.key) {
      case Keys.Enter:
      case Keys.Space:
      case Keys.ArrowDown:
        event.preventDefault();
        open();
        // Focus should move to first menu item (handled by consuming component)
        break;

      case Keys.ArrowUp:
        event.preventDefault();
        open();
        // Focus should move to last menu item (handled by consuming component)
        break;

      default:
        break;
    }
  };

  const handleContentKeyDown = (event: KeyboardEvent, _allItemIds: string[]): void => {
    if (store.state.disabled) {
      return;
    }

    switch (event.key) {
      case Keys.Escape:
        event.preventDefault();
        close();
        // Focus should return to trigger (handled by consuming component)
        break;

      case Keys.Tab:
        close();
        break;

      default:
        break;
    }
  };

  return {
    get state() {
      return store.state;
    },
    subscribe: callback => {
      return store.subscribe(state => callback(state));
    },
    actions: {
      open,
      close,
      toggle,
      selectItem,
      setDisabled,
    },
    queries: {
      isOpen,
    },
    getTriggerProps,
    getContentProps,
    getItemProps,
    handleTriggerKeyDown,
    handleContentKeyDown,
  };
}

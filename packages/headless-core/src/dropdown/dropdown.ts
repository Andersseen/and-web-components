/**
 * Headless Dropdown Component
 *
 * Provides state management and accessibility for dropdown/menu components.
 * Handles open/close states, keyboard navigation, and focus management.
 */

import type {
  AriaAttributes,
  DataAttributes,
  EventCallback,
} from "../types/common";
import { Keys } from "../types/common";

/**
 * Configuration options for creating a dropdown
 */
export interface DropdownConfig {
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
   * Placement of the dropdown relative to trigger
   * @default 'bottom'
   */
  placement?: "top" | "bottom" | "left" | "right";

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
  placement: "top" | "bottom" | "left" | "right";
  disabled: boolean;
}

/**
 * Props for dropdown trigger element
 */
export interface DropdownTriggerProps extends AriaAttributes, DataAttributes {
  "aria-haspopup": "menu";
  "aria-expanded": boolean;
  "aria-disabled": boolean;
  "data-state": "open" | "closed";
}

/**
 * Props for dropdown menu container
 */
export interface DropdownMenuProps extends AriaAttributes, DataAttributes {
  role: "menu";
  "data-state": "open" | "closed";
  hidden: boolean;
}

/**
 * Props for dropdown menu item
 */
export interface DropdownItemProps extends AriaAttributes {
  role: "menuitem";
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
   * Get props for different elements
   */
  getTriggerProps: () => DropdownTriggerProps;
  getMenuProps: () => DropdownMenuProps;
  getItemProps: (itemId?: string) => DropdownItemProps;

  /**
   * Event handlers
   */
  handleTriggerKeyDown: (event: KeyboardEvent) => void;
  handleMenuKeyDown: (event: KeyboardEvent, allItemIds: string[]) => void;
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
 * const menuProps = dropdown.getMenuProps();
 * const itemProps = dropdown.getItemProps('item-1');
 * ```
 */
export function createDropdown(config: DropdownConfig = {}): DropdownReturn {
  const closeOnSelect = config.closeOnSelect ?? true;

  // Internal state
  let state: DropdownState = {
    isOpen: config.defaultOpen ?? false,
    placement: config.placement ?? "bottom",
    disabled: config.disabled ?? false,
  };

  const notifyChange = (): void => {
    config.onOpenChange?.(state.isOpen);
  };

  // Actions
  const open = (): void => {
    if (state.disabled || state.isOpen) return;

    state = { ...state, isOpen: true };
    notifyChange();
  };

  const close = (): void => {
    if (state.disabled || !state.isOpen) return;

    state = { ...state, isOpen: false };
    notifyChange();
  };

  const toggle = (): void => {
    if (state.disabled) return;

    state.isOpen ? close() : open();
  };

  const selectItem = (_itemId?: string): void => {
    if (state.disabled) return;

    // Custom logic can be added here for item selection
    // For now, just close if configured to do so
    if (closeOnSelect) {
      close();
    }
  };

  const setDisabled = (disabled: boolean): void => {
    state = { ...state, disabled };
    if (disabled && state.isOpen) {
      close();
    }
  };

  // Get element props
  const getTriggerProps = (): DropdownTriggerProps => ({
    "aria-haspopup": "menu",
    "aria-expanded": state.isOpen,
    "aria-disabled": state.disabled,
    "data-state": state.isOpen ? "open" : "closed",
  });

  const getMenuProps = (): DropdownMenuProps => ({
    role: "menu",
    "data-state": state.isOpen ? "open" : "closed",
    hidden: !state.isOpen,
  });

  const getItemProps = (_itemId?: string): DropdownItemProps => ({
    role: "menuitem",
    tabindex: state.isOpen ? 0 : -1,
  });

  // Keyboard navigation
  const handleTriggerKeyDown = (event: KeyboardEvent): void => {
    if (state.disabled) return;

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

  const handleMenuKeyDown = (
    event: KeyboardEvent,
    _allItemIds: string[],
  ): void => {
    if (state.disabled) return;

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
      return Object.freeze({ ...state });
    },
    actions: {
      open,
      close,
      toggle,
      selectItem,
      setDisabled,
    },
    getTriggerProps,
    getMenuProps,
    getItemProps,
    handleTriggerKeyDown,
    handleMenuKeyDown,
  };
}

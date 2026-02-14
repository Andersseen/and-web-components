/**
 * Headless Drawer (Sheet) Component
 *
 * Provides state management and accessibility for drawer/sheet components.
 * Handles open/close states, placement directions, escape key, backdrop click,
 * and body scroll lock signaling.
 */

import type {
  AriaAttributes,
  DataAttributes,
  EventCallback,
} from "../types/common";
import { Keys } from "../types/common";

/**
 * Drawer placement options
 */
export type DrawerPlacement = "top" | "bottom" | "left" | "right";

/**
 * Configuration options for creating a drawer
 */
export interface DrawerConfig {
  /**
   * Initially open state
   * @default false
   */
  defaultOpen?: boolean;

  /**
   * Placement of the drawer
   * @default 'left'
   */
  placement?: DrawerPlacement;

  /**
   * Callback when open state changes
   */
  onOpenChange?: EventCallback<boolean>;

  /**
   * Close when pressing Escape key
   * @default true
   */
  closeOnEscape?: boolean;

  /**
   * Close when clicking the overlay/backdrop
   * @default true
   */
  closeOnOverlayClick?: boolean;

  /**
   * Whether the drawer is disabled
   * @default false
   */
  disabled?: boolean;
}

/**
 * Drawer state
 */
export interface DrawerState {
  isOpen: boolean;
  placement: DrawerPlacement;
  disabled: boolean;
}

/**
 * Props for the overlay/backdrop element
 */
export interface DrawerOverlayProps extends DataAttributes {
  "data-state": "open" | "closed";
  "aria-hidden": boolean;
}

/**
 * Props for the drawer content element
 */
export interface DrawerContentProps extends AriaAttributes, DataAttributes {
  role: "dialog";
  "aria-modal": boolean;
  "aria-hidden": boolean;
  "data-state": "open" | "closed";
  "data-side": DrawerPlacement;
  tabindex: number;
}

/**
 * Props for the close button element
 */
export interface DrawerCloseButtonProps extends AriaAttributes {
  "aria-label": string;
  type: "button";
}

/**
 * Return type of createDrawer
 */
export interface DrawerReturn {
  /**
   * Current state
   */
  state: Readonly<DrawerState>;

  /**
   * Actions
   */
  actions: {
    open: () => void;
    close: () => void;
    toggle: () => void;
    setPlacement: (placement: DrawerPlacement) => void;
    setDisabled: (disabled: boolean) => void;
  };

  /**
   * Get props for different elements
   */
  getOverlayProps: () => DrawerOverlayProps;
  getContentProps: () => DrawerContentProps;
  getCloseButtonProps: () => DrawerCloseButtonProps;

  /**
   * Event handlers
   */
  handleKeyDown: (event: KeyboardEvent) => void;
  handleOverlayClick: () => void;
}

/**
 * Create a headless drawer component
 *
 * @example
 * ```ts
 * const drawer = createDrawer({
 *   placement: 'left',
 *   closeOnEscape: true,
 *   closeOnOverlayClick: true,
 *   onOpenChange: (isOpen) => console.log('Drawer:', isOpen)
 * });
 *
 * // Open
 * drawer.actions.open();
 *
 * // Get props
 * const overlayProps = drawer.getOverlayProps();
 * const contentProps = drawer.getContentProps();
 * const closeProps = drawer.getCloseButtonProps();
 *
 * // Attach keyboard handler
 * window.addEventListener('keydown', drawer.handleKeyDown);
 * ```
 */
export function createDrawer(config: DrawerConfig = {}): DrawerReturn {
  const closeOnEscape = config.closeOnEscape ?? true;
  const closeOnOverlayClick = config.closeOnOverlayClick ?? true;

  // Internal state
  let state: DrawerState = {
    isOpen: config.defaultOpen ?? false,
    placement: config.placement ?? "left",
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
    if (!state.isOpen) return;

    state = { ...state, isOpen: false };
    notifyChange();
  };

  const toggle = (): void => {
    if (state.disabled) return;

    state.isOpen ? close() : open();
  };

  const setPlacement = (placement: DrawerPlacement): void => {
    state = { ...state, placement };
  };

  const setDisabled = (disabled: boolean): void => {
    state = { ...state, disabled };
    if (disabled && state.isOpen) {
      close();
    }
  };

  // Get element props
  const getOverlayProps = (): DrawerOverlayProps => ({
    "data-state": state.isOpen ? "open" : "closed",
    "aria-hidden": !state.isOpen,
  });

  const getContentProps = (): DrawerContentProps => ({
    role: "dialog",
    "aria-modal": true,
    "aria-hidden": !state.isOpen,
    "data-state": state.isOpen ? "open" : "closed",
    "data-side": state.placement,
    tabindex: -1,
  });

  const getCloseButtonProps = (): DrawerCloseButtonProps => ({
    "aria-label": "Close",
    type: "button",
  });

  // Keyboard handler
  const handleKeyDown = (event: KeyboardEvent): void => {
    if (!state.isOpen) return;

    if (event.key === Keys.Escape && closeOnEscape) {
      event.preventDefault();
      close();
    }
  };

  // Overlay click handler
  const handleOverlayClick = (): void => {
    if (closeOnOverlayClick) {
      close();
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
      setPlacement,
      setDisabled,
    },
    getOverlayProps,
    getContentProps,
    getCloseButtonProps,
    handleKeyDown,
    handleOverlayClick,
  };
}

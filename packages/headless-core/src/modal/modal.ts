/**
 * Headless Modal (Dialog) Component
 *
 * Provides state management and accessibility for modal/dialog components.
 * Handles open/close states, escape key, backdrop click, focus trap hints,
 * and body scroll lock signaling.
 */

import type {
  AriaAttributes,
  DataAttributes,
  EventCallback,
} from "../types/common";
import { Keys } from "../types/common";

/**
 * Configuration options for creating a modal
 */
export interface ModalConfig {
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
   * Whether the modal is disabled (cannot be opened)
   * @default false
   */
  disabled?: boolean;
}

/**
 * Modal state
 */
export interface ModalState {
  isOpen: boolean;
  disabled: boolean;
}

/**
 * Props for the overlay/backdrop element
 */
export interface ModalOverlayProps extends DataAttributes {
  "data-state": "open" | "closed";
  "aria-hidden": boolean;
}

/**
 * Props for the dialog content element
 */
export interface ModalContentProps extends AriaAttributes, DataAttributes {
  role: "dialog";
  "aria-modal": boolean;
  "aria-hidden": boolean;
  "data-state": "open" | "closed";
  tabindex: number;
}

/**
 * Props for the close button element
 */
export interface ModalCloseButtonProps extends AriaAttributes {
  "aria-label": string;
  type: "button";
}

/**
 * Return type of createModal
 */
export interface ModalReturn {
  /**
   * Current state
   */
  state: Readonly<ModalState>;

  /**
   * Actions
   */
  actions: {
    open: () => void;
    close: () => void;
    toggle: () => void;
    setDisabled: (disabled: boolean) => void;
  };

  /**
   * Get props for different elements
   */
  getOverlayProps: () => ModalOverlayProps;
  getContentProps: () => ModalContentProps;
  getCloseButtonProps: () => ModalCloseButtonProps;

  /**
   * Event handlers
   */
  handleKeyDown: (event: KeyboardEvent) => void;
  handleOverlayClick: () => void;
}

/**
 * Create a headless modal component
 *
 * @example
 * ```ts
 * const modal = createModal({
 *   closeOnEscape: true,
 *   closeOnOverlayClick: true,
 *   onOpenChange: (isOpen) => console.log('Modal:', isOpen)
 * });
 *
 * // Open
 * modal.actions.open();
 *
 * // Get props
 * const overlayProps = modal.getOverlayProps();
 * const contentProps = modal.getContentProps();
 * const closeProps = modal.getCloseButtonProps();
 *
 * // Attach keyboard handler to window
 * window.addEventListener('keydown', modal.handleKeyDown);
 * ```
 */
export function createModal(config: ModalConfig = {}): ModalReturn {
  const closeOnEscape = config.closeOnEscape ?? true;
  const closeOnOverlayClick = config.closeOnOverlayClick ?? true;

  // Internal state
  let state: ModalState = {
    isOpen: config.defaultOpen ?? false,
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

  const setDisabled = (disabled: boolean): void => {
    state = { ...state, disabled };
    if (disabled && state.isOpen) {
      close();
    }
  };

  // Get element props
  const getOverlayProps = (): ModalOverlayProps => ({
    "data-state": state.isOpen ? "open" : "closed",
    "aria-hidden": !state.isOpen,
  });

  const getContentProps = (): ModalContentProps => ({
    role: "dialog",
    "aria-modal": true,
    "aria-hidden": !state.isOpen,
    "data-state": state.isOpen ? "open" : "closed",
    tabindex: -1,
  });

  const getCloseButtonProps = (): ModalCloseButtonProps => ({
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
      setDisabled,
    },
    getOverlayProps,
    getContentProps,
    getCloseButtonProps,
    handleKeyDown,
    handleOverlayClick,
  };
}

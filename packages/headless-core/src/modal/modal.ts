/**
 * Headless Modal (Dialog) Component
 *
 * Provides state management and accessibility for modal/dialog components.
 * Handles open/close states, escape key, backdrop click, focus trap hints,
 * and body scroll lock signaling.
 *
 * Now reactive: subscribe to state changes from any framework.
 */

import { createStore } from '../utils/store';
import type { AriaAttributes, DataAttributes, EventCallback } from '../types/common';
import { Keys } from '../types/common';

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

  /**
   * Accessible label for the modal
   */
  label?: string;
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
  'data-state': 'open' | 'closed';
  'aria-hidden': boolean;
}

/**
 * Props for the dialog content element
 */
export interface ModalContentProps extends AriaAttributes, DataAttributes {
  'role': 'dialog';
  'aria-modal': boolean;
  'aria-hidden': boolean;
  'aria-label': string;
  'data-state': 'open' | 'closed';
  'tabindex': number;
}

/**
 * Props for the close button element
 */
export interface ModalCloseButtonProps extends AriaAttributes {
  'aria-label': string;
  'type': 'button';
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
   * Subscribe to state changes. Returns unsubscribe function.
   */
  subscribe: (callback: (state: Readonly<ModalState>) => void) => () => void;

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
 * // Subscribe from React/Vue/Svelte/vanilla
 * modal.subscribe((state) => {
 *   if (state.isOpen) console.log('Modal opened');
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

  const store = createStore<ModalState>({
    isOpen: config.defaultOpen ?? false,
    disabled: config.disabled ?? false,
  });

  // Notify legacy callback and new subscribers
  const notifyChange = (): void => {
    config.onOpenChange?.(store.state.isOpen);
  };

  // Actions
  const open = (): void => {
    const { disabled, isOpen } = store.state;
    if (disabled || isOpen) {
      return;
    }
    store.setState({ isOpen: true });
    notifyChange();
  };

  const close = (): void => {
    if (!store.state.isOpen) {
      return;
    }
    store.setState({ isOpen: false });
    notifyChange();
  };

  const toggle = (): void => {
    if (store.state.disabled) {
      return;
    }
    store.state.isOpen ? close() : open();
  };

  const setDisabled = (disabled: boolean): void => {
    store.setState({ disabled });
    if (disabled && store.state.isOpen) {
      close();
    }
  };

  // Get element props
  const getOverlayProps = (): ModalOverlayProps => {
    const { isOpen } = store.state;
    return {
      'data-state': isOpen ? 'open' : 'closed',
      'aria-hidden': !isOpen,
    };
  };

  const getContentProps = (): ModalContentProps => {
    const { isOpen } = store.state;
    return {
      'role': 'dialog',
      'aria-modal': true,
      'aria-hidden': !isOpen,
      'aria-label': config.label ?? 'Dialog',
      'data-state': isOpen ? 'open' : 'closed',
      'tabindex': -1,
    };
  };

  const getCloseButtonProps = (): ModalCloseButtonProps => ({
    'aria-label': 'Close',
    'type': 'button',
  });

  // Keyboard handler
  const handleKeyDown = (event: KeyboardEvent): void => {
    if (!store.state.isOpen) {
      return;
    }

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
      return store.state;
    },
    subscribe: callback => {
      return store.subscribe(state => callback(state));
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

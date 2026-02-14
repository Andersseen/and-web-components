/**
 * Headless Toast Manager Component
 *
 * Provides state management and accessibility for toast/notification components.
 * Handles toast queue, auto-dismissal, and positioning — no rendering logic.
 */

import type {
  AriaAttributes,
  DataAttributes,
  EventCallback,
} from "../types/common";

/**
 * Toast types
 */
export type ToastType = "default" | "success" | "error" | "info" | "warning";

/**
 * Toast position options
 */
export type ToastPosition =
  | "top-right"
  | "top-left"
  | "bottom-right"
  | "bottom-left"
  | "top-center"
  | "bottom-center";

/**
 * Individual toast item
 */
export interface ToastItem {
  id: number;
  message: string;
  type: ToastType;
  duration: number;
}

/**
 * Configuration options for creating a toast manager
 */
export interface ToastManagerConfig {
  /**
   * Default duration for toasts in milliseconds
   * @default 3000
   */
  defaultDuration?: number;

  /**
   * Maximum number of toasts visible at once
   * @default 5
   */
  maxToasts?: number;

  /**
   * Position of the toast container
   * @default 'bottom-right'
   */
  position?: ToastPosition;

  /**
   * Callback when the toast list changes
   */
  onToastsChange?: EventCallback<ToastItem[]>;
}

/**
 * Toast manager state
 */
export interface ToastManagerState {
  toasts: ReadonlyArray<ToastItem>;
  position: ToastPosition;
}

/**
 * Props for the toast container element
 */
export interface ToastContainerProps extends DataAttributes {
  role: "region";
  "aria-label": string;
  "aria-live": "polite";
  "aria-atomic": boolean;
  "data-position": ToastPosition;
}

/**
 * Props for individual toast elements
 */
export interface ToastItemProps extends AriaAttributes, DataAttributes {
  role: "alert";
  "aria-live": "assertive";
  "aria-atomic": boolean;
  "data-type": ToastType;
}

/**
 * Props for toast dismiss button
 */
export interface ToastDismissProps extends AriaAttributes {
  "aria-label": string;
  type: "button";
}

/**
 * Return type of createToastManager
 */
export interface ToastManagerReturn {
  /**
   * Current state
   */
  state: Readonly<ToastManagerState>;

  /**
   * Actions
   */
  actions: {
    present: (message: string, type?: ToastType, duration?: number) => number;
    dismiss: (id: number) => void;
    dismissAll: () => void;
  };

  /**
   * Get props for different elements
   */
  getContainerProps: () => ToastContainerProps;
  getToastProps: (toast: ToastItem) => ToastItemProps;
  getDismissProps: () => ToastDismissProps;

  /**
   * Cleanup all pending timers
   */
  destroy: () => void;
}

/**
 * Create a headless toast manager
 *
 * @example
 * ```ts
 * const toasts = createToastManager({
 *   defaultDuration: 3000,
 *   position: 'bottom-right',
 *   onToastsChange: (list) => console.log('Toasts:', list)
 * });
 *
 * // Show a toast
 * const id = toasts.actions.present('Hello!', 'success');
 *
 * // Dismiss
 * toasts.actions.dismiss(id);
 *
 * // Get props
 * const containerProps = toasts.getContainerProps();
 * toasts.state.toasts.forEach(t => {
 *   const props = toasts.getToastProps(t);
 * });
 *
 * // Cleanup
 * toasts.destroy();
 * ```
 */
export function createToastManager(
  config: ToastManagerConfig = {},
): ToastManagerReturn {
  const defaultDuration = config.defaultDuration ?? 3000;
  const maxToasts = config.maxToasts ?? 5;

  // Internal state
  let state: ToastManagerState = {
    toasts: [],
    position: config.position ?? "bottom-right",
  };

  // Timer map for auto-dismiss
  const timers = new Map<number, ReturnType<typeof setTimeout>>();

  const notifyChange = (): void => {
    config.onToastsChange?.([...state.toasts]);
  };

  // Actions
  const dismiss = (id: number): void => {
    const timer = timers.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.delete(id);
    }

    state = {
      ...state,
      toasts: state.toasts.filter((t) => t.id !== id),
    };
    notifyChange();
  };

  const present = (
    message: string,
    type: ToastType = "default",
    duration?: number,
  ): number => {
    const id = Date.now() + Math.random();
    const actualDuration = duration ?? defaultDuration;

    const toast: ToastItem = { id, message, type, duration: actualDuration };

    // Add toast, respecting max limit
    let toasts = [...state.toasts, toast];
    if (toasts.length > maxToasts) {
      // Remove oldest toasts that exceed limit
      const removed = toasts.splice(0, toasts.length - maxToasts);
      removed.forEach((t) => {
        const timer = timers.get(t.id);
        if (timer) {
          clearTimeout(timer);
          timers.delete(t.id);
        }
      });
    }

    state = { ...state, toasts };
    notifyChange();

    // Auto-dismiss
    if (actualDuration > 0) {
      const timer = setTimeout(() => {
        dismiss(id);
      }, actualDuration);
      timers.set(id, timer);
    }

    return id;
  };

  const dismissAll = (): void => {
    timers.forEach((timer) => clearTimeout(timer));
    timers.clear();

    state = { ...state, toasts: [] };
    notifyChange();
  };

  // Get element props
  const getContainerProps = (): ToastContainerProps => ({
    role: "region",
    "aria-label": "Notifications",
    "aria-live": "polite",
    "aria-atomic": false,
    "data-position": state.position,
  });

  const getToastProps = (toast: ToastItem): ToastItemProps => ({
    role: "alert",
    "aria-live": "assertive",
    "aria-atomic": true,
    "data-type": toast.type,
  });

  const getDismissProps = (): ToastDismissProps => ({
    "aria-label": "Dismiss notification",
    type: "button",
  });

  // Cleanup
  const destroy = (): void => {
    timers.forEach((timer) => clearTimeout(timer));
    timers.clear();
  };

  return {
    get state() {
      return Object.freeze({
        toasts: [...state.toasts],
        position: state.position,
      });
    },
    actions: {
      present,
      dismiss,
      dismissAll,
    },
    getContainerProps,
    getToastProps,
    getDismissProps,
    destroy,
  };
}

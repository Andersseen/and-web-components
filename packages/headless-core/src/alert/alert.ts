/**
 * Headless Alert Component
 *
 * Provides state management and accessibility for alert/banner components.
 * Handles variant management, dismissible state, and ARIA alert semantics.
 */

import type {
  AriaAttributes,
  DataAttributes,
  EventCallback,
} from "../types/common";

/**
 * Alert variant options
 */
export type AlertVariant =
  | "default"
  | "destructive"
  | "success"
  | "warning"
  | "info";

/**
 * Configuration options for creating an alert
 */
export interface AlertConfig {
  /**
   * Visual variant of the alert
   * @default 'default'
   */
  variant?: AlertVariant;

  /**
   * Whether the alert can be dismissed
   * @default false
   */
  dismissible?: boolean;

  /**
   * Initially visible state
   * @default true
   */
  defaultVisible?: boolean;

  /**
   * Callback when dismissed
   */
  onDismiss?: EventCallback<void>;

  /**
   * Callback when visibility changes
   */
  onVisibilityChange?: EventCallback<boolean>;
}

/**
 * Alert state
 */
export interface AlertState {
  variant: AlertVariant;
  visible: boolean;
  dismissible: boolean;
}

/**
 * Props for the alert container element
 */
export interface AlertProps extends AriaAttributes, DataAttributes {
  role: "alert" | "status";
  "aria-live": "assertive" | "polite";
  "aria-atomic": boolean;
  "data-state": "open" | "closed";
  "data-variant": AlertVariant;
}

/**
 * Props for the dismiss button element
 */
export interface AlertDismissProps extends AriaAttributes {
  "aria-label": string;
  type: "button";
}

/**
 * Return type of createAlert
 */
export interface AlertReturn {
  /**
   * Current state
   */
  state: Readonly<AlertState>;

  /**
   * Actions
   */
  actions: {
    dismiss: () => void;
    show: () => void;
    setVariant: (variant: AlertVariant) => void;
    setDismissible: (dismissible: boolean) => void;
  };

  /**
   * Get props for different elements
   */
  getAlertProps: () => AlertProps;
  getDismissButtonProps: () => AlertDismissProps;
}

/**
 * Create a headless alert component
 *
 * @example
 * ```ts
 * const alert = createAlert({
 *   variant: 'destructive',
 *   dismissible: true,
 *   onDismiss: () => console.log('Alert dismissed')
 * });
 *
 * // Get props
 * const alertProps = alert.getAlertProps();
 * const dismissProps = alert.getDismissButtonProps();
 *
 * // Dismiss
 * alert.actions.dismiss();
 *
 * // Change variant
 * alert.actions.setVariant('success');
 * ```
 */
export function createAlert(config: AlertConfig = {}): AlertReturn {
  // Internal state
  let state: AlertState = {
    variant: config.variant ?? "default",
    visible: config.defaultVisible ?? true,
    dismissible: config.dismissible ?? false,
  };

  const notifyVisibility = (): void => {
    config.onVisibilityChange?.(state.visible);
  };

  // Actions
  const dismiss = (): void => {
    if (!state.dismissible || !state.visible) return;

    state = { ...state, visible: false };
    config.onDismiss?.();
    notifyVisibility();
  };

  const show = (): void => {
    if (state.visible) return;

    state = { ...state, visible: true };
    notifyVisibility();
  };

  const setVariant = (variant: AlertVariant): void => {
    state = { ...state, variant };
  };

  const setDismissible = (dismissible: boolean): void => {
    state = { ...state, dismissible };
  };

  // Get element props
  const getAlertProps = (): AlertProps => {
    // Destructive alerts use "alert" role with "assertive" for immediate attention
    // Other variants use "status" with "polite" for non-intrusive notifications
    const isUrgent =
      state.variant === "destructive" || state.variant === "warning";

    return {
      role: isUrgent ? "alert" : "status",
      "aria-live": isUrgent ? "assertive" : "polite",
      "aria-atomic": true,
      "data-state": state.visible ? "open" : "closed",
      "data-variant": state.variant,
    };
  };

  const getDismissButtonProps = (): AlertDismissProps => ({
    "aria-label": "Dismiss alert",
    type: "button",
  });

  return {
    get state() {
      return Object.freeze({ ...state });
    },
    actions: {
      dismiss,
      show,
      setVariant,
      setDismissible,
    },
    getAlertProps,
    getDismissButtonProps,
  };
}

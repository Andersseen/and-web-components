/**
 * Headless Button Component
 *
 * Provides state management and accessibility attributes for button components.
 * Handles disabled states, loading states, and proper ARIA attributes.
 */

import type {
  AriaAttributes,
  DataAttributes,
  EventCallback,
} from "../types/common";

/**
 * Configuration options for creating a button
 */
export interface ButtonConfig {
  /**
   * Whether the button is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Whether the button is in a loading state
   * @default false
   */
  loading?: boolean;

  /**
   * Button type attribute
   * @default 'button'
   */
  type?: "button" | "submit" | "reset";

  /**
   * Callback when button is clicked (only fires when not disabled/loading)
   */
  onClick?: EventCallback<MouseEvent>;

  /**
   * ARIA label for the button
   */
  ariaLabel?: string;
}

/**
 * Button state
 */
export interface ButtonState {
  disabled: boolean;
  loading: boolean;
  type: "button" | "submit" | "reset";
}

/**
 * Props to spread on the button element
 */
export interface ButtonElementProps extends AriaAttributes, DataAttributes {
  type: "button" | "submit" | "reset";
  disabled: boolean;
  tabindex: number;
  "aria-busy"?: boolean;
}

/**
 * Return type of createButton
 */
export interface ButtonReturn {
  /**
   * Current state of the button
   */
  state: Readonly<ButtonState>;

  /**
   * Update button state
   */
  actions: {
    setDisabled: (disabled: boolean) => void;
    setLoading: (loading: boolean) => void;
  };

  /**
   * Query methods
   */
  queries: {
    isDisabled: () => boolean;
    isLoading: () => boolean;
  };

  /**
   * Get props to spread on the button element
   */
  getButtonProps: () => ButtonElementProps;

  /**
   * Event handlers
   */
  handleClick: (event: MouseEvent) => void;
}

/**
 * Create a headless button component
 *
 * @example
 * ```ts
 * const button = createButton({
 *   onClick: (e) => console.log('clicked'),
 *   disabled: false
 * });
 *
 * // Get props for your button element
 * const props = button.getButtonProps();
 *
 * // Update state
 * button.actions.setLoading(true);
 * ```
 */
export function createButton(config: ButtonConfig = {}): ButtonReturn {
  // Internal state
  let state: ButtonState = {
    disabled: config.disabled ?? false,
    loading: config.loading ?? false,
    type: config.type ?? "button",
  };

  // Actions
  const setDisabled = (disabled: boolean): void => {
    state = { ...state, disabled };
  };

  const setLoading = (loading: boolean): void => {
    state = { ...state, loading };
  };

  // Event handlers
  const handleClick = (event: MouseEvent): void => {
    // Don't trigger click if disabled or loading
    if (state.disabled || state.loading) {
      event.preventDefault();
      return;
    }

    config.onClick?.(event);
  };

  // Queries
  const isDisabled = (): boolean => state.disabled || state.loading;
  const isLoading = (): boolean => state.loading;

  // Get element props
  const getButtonProps = (): ButtonElementProps => {
    const disabledStatus = isDisabled();

    return {
      type: state.type,
      disabled: disabledStatus,
      tabindex: disabledStatus ? -1 : 0,
      "aria-disabled": disabledStatus,
      "aria-busy": state.loading,
      "aria-label": config.ariaLabel,
      "data-state": disabledStatus ? "inactive" : "active",
      "data-disabled": disabledStatus,
    };
  };

  return {
    get state() {
      return Object.freeze({ ...state });
    },
    actions: {
      setDisabled,
      setLoading,
    },
    queries: {
      isDisabled,
      isLoading,
    },
    getButtonProps,
    handleClick,
  };
}

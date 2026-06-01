/**
 * Headless Button Component
 *
 * Provides state management and accessibility attributes for button components.
 * Handles disabled states, loading states, and proper ARIA attributes.
 *
 * Now reactive: multiple subscribers can listen to state changes
 * without framework-specific adapters.
 */

import { createStore } from '../utils/store';
import type { AriaAttributes, DataAttributes, EventCallback } from '../types/common';

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
  type?: 'button' | 'submit' | 'reset';

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
  type: 'button' | 'submit' | 'reset';
}

/**
 * Props to spread on the button element
 */
export interface ButtonElementProps extends AriaAttributes, DataAttributes {
  'type': 'button' | 'submit' | 'reset';
  'disabled': boolean;
  'tabindex': number;
  'aria-busy'?: boolean;
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
   * Subscribe to state changes. Returns unsubscribe function.
   * Works with React, Vue, Svelte, Angular, or vanilla JS.
   */
  subscribe: (callback: (state: Readonly<ButtonState>) => void) => () => void;

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
 * // React/Vue/Svelte/vanilla — all work the same
 * const unsubscribe = button.subscribe((state) => {
 *   console.log('Button state:', state);
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
  const store = createStore<ButtonState>({
    disabled: config.disabled ?? false,
    loading: config.loading ?? false,
    type: config.type ?? 'button',
  });

  // Actions
  const setDisabled = (disabled: boolean): void => {
    store.setState({ disabled });
  };

  const setLoading = (loading: boolean): void => {
    store.setState({ loading });
  };

  // Event handlers
  const handleClick = (event: MouseEvent): void => {
    const { disabled, loading } = store.state;
    if (disabled || loading) {
      event.preventDefault();
      return;
    }
    config.onClick?.(event);
  };

  // Queries
  const isDisabled = (): boolean => {
    const { disabled, loading } = store.state;
    return disabled || loading;
  };
  const isLoading = (): boolean => store.state.loading;

  // Get element props
  const getButtonProps = (): ButtonElementProps => {
    const disabledStatus = isDisabled();
    const { type, loading } = store.state;

    return {
      type,
      'disabled': disabledStatus,
      'tabindex': disabledStatus ? -1 : 0,
      'aria-disabled': disabledStatus,
      'aria-busy': loading,
      'aria-label': config.ariaLabel,
      'data-state': disabledStatus ? 'inactive' : 'active',
      'data-disabled': disabledStatus,
    };
  };

  return {
    get state() {
      return store.state;
    },
    subscribe: callback => {
      return store.subscribe(state => callback(state));
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

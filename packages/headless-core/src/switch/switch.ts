/**
 * Headless Switch Component
 *
 * Provides state management and accessibility attributes for a boolean
 * on/off toggle. Backed by a real native `<input type="checkbox" role="switch">`
 * at the component layer (see `and-switch.tsx`), so keyboard (Space),
 * label-click, and disabled handling all come from the browser for free —
 * this module only tracks checked/disabled/required state and shapes props.
 */

import { createStore } from '../utils/store';
import type { AriaAttributes, DataAttributes, EventCallback } from '../types/common';

/**
 * Configuration options for creating a switch
 */
export interface SwitchConfig {
  /**
   * Whether the switch starts checked
   * @default false
   */
  checked?: boolean;

  /**
   * Whether the switch is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Whether the switch is required
   * @default false
   */
  required?: boolean;

  /**
   * Callback when the checked state changes
   */
  onCheckedChange?: EventCallback<boolean>;
}

/**
 * Switch state
 */
export interface SwitchState {
  checked: boolean;
  disabled: boolean;
  required: boolean;
}

/**
 * Props to spread on the native checkbox element
 */
export interface SwitchInputProps extends AriaAttributes, DataAttributes {
  'type': 'checkbox';
  'role': 'switch';
  'checked': boolean;
  'disabled': boolean;
  'required': boolean;
  'aria-checked': 'true' | 'false';
}

/**
 * Return type of createSwitch
 */
export interface SwitchReturn {
  /**
   * Current state of the switch
   */
  state: Readonly<SwitchState>;

  /**
   * Subscribe to state changes. Returns unsubscribe function.
   */
  subscribe: (callback: (state: Readonly<SwitchState>) => void) => () => void;

  /**
   * Update switch state
   */
  actions: {
    setChecked: (checked: boolean) => void;
    toggle: () => void;
    setDisabled: (disabled: boolean) => void;
    setRequired: (required: boolean) => void;
  };

  /**
   * Get props to spread on the native checkbox element
   */
  getInputProps: () => SwitchInputProps;
}

/**
 * Create a headless switch component
 *
 * @example
 * ```ts
 * const switchLogic = createSwitch({
 *   checked: false,
 *   onCheckedChange: (checked) => console.log('checked:', checked),
 * });
 *
 * const unsubscribe = switchLogic.subscribe((state) => {
 *   console.log('Switch state:', state);
 * });
 *
 * const props = switchLogic.getInputProps();
 * switchLogic.actions.toggle();
 * ```
 */
export function createSwitch(config: SwitchConfig = {}): SwitchReturn {
  const store = createStore<SwitchState>({
    checked: config.checked ?? false,
    disabled: config.disabled ?? false,
    required: config.required ?? false,
  });

  // No `disabled` guard here: native checkboxes allow `.checked` to be set
  // programmatically regardless of `.disabled` — only user interaction is
  // blocked, and that's already enforced by the browser on the real
  // checkbox (see and-switch.tsx). Gating this would also break resetting a
  // disabled-and-checked switch back to its default.
  const setChecked = (checked: boolean): void => {
    if (store.state.checked === checked) {
      return;
    }
    store.setState({ checked });
    config.onCheckedChange?.(checked);
  };

  const toggle = (): void => {
    setChecked(!store.state.checked);
  };

  const setDisabled = (disabled: boolean): void => {
    store.setState({ disabled });
  };

  const setRequired = (required: boolean): void => {
    store.setState({ required });
  };

  const getInputProps = (): SwitchInputProps => ({
    'type': 'checkbox',
    'role': 'switch',
    'checked': store.state.checked,
    'disabled': store.state.disabled,
    'required': store.state.required,
    'aria-checked': store.state.checked ? 'true' : 'false',
    'data-state': store.state.checked ? 'selected' : 'unselected',
    'data-disabled': store.state.disabled,
  });

  return {
    get state() {
      return store.state;
    },
    subscribe: callback => store.subscribe(state => callback(state)),
    actions: {
      setChecked,
      toggle,
      setDisabled,
      setRequired,
    },
    getInputProps,
  };
}

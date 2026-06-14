/**
 * Headless Input Component
 *
 * Provides state management and accessibility for text input components.
 */

import { createStore } from '../utils/store';
import type { EventCallback } from '../types/common';

export interface InputConfig {
  /** Initial value */
  defaultValue?: string;
  /** Whether the input is disabled */
  disabled?: boolean;
  /** Whether the input is required */
  required?: boolean;
  /** Max length */
  maxLength?: number;
  /** Callback when value changes */
  onValueChange?: EventCallback<string>;
}

export interface InputState {
  value: string;
  disabled: boolean;
  required: boolean;
  touched: boolean;
  focused: boolean;
}

export interface InputElementProps {
  'type': 'text';
  'value': string;
  'disabled': boolean;
  'required': boolean;
  'maxlength'?: number;
  'aria-disabled': boolean;
  'aria-required': boolean;
  'aria-invalid': boolean;
  'data-state': 'active' | 'inactive';
}

export interface InputReturn {
  state: Readonly<InputState>;
  subscribe: (callback: (state: Readonly<InputState>) => void) => () => void;
  actions: {
    setValue: (value: string) => void;
    setDisabled: (disabled: boolean) => void;
    setRequired: (required: boolean) => void;
    focus: () => void;
    blur: () => void;
  };
  queries: {
    isEmpty: () => boolean;
    isValid: () => boolean;
  };
  getInputProps: () => InputElementProps;
}

export function createInput(config: InputConfig = {}): InputReturn {
  const store = createStore<InputState>({
    value: config.defaultValue ?? '',
    disabled: config.disabled ?? false,
    required: config.required ?? false,
    touched: false,
    focused: false,
  });

  const setValue = (value: string) => {
    if (store.state.disabled) {
      return;
    }
    store.setState({ value });
    config.onValueChange?.(value);
  };

  const setDisabled = (disabled: boolean) => {
    store.setState({ disabled });
  };

  const setRequired = (required: boolean) => {
    store.setState({ required });
  };

  const focus = () => {
    if (store.state.disabled) {
      return;
    }
    store.setState({ focused: true });
  };

  const blur = () => {
    store.setState({ focused: false, touched: true });
  };

  const isEmpty = () => store.state.value.length === 0;
  const isValid = () => {
    if (!store.state.required) {
      return true;
    }
    return !isEmpty();
  };

  const getInputProps = (): InputElementProps => {
    const { value, disabled, required, touched } = store.state;
    const invalid = required && touched && value.length === 0;
    return {
      'type': 'text',
      value,
      disabled,
      required,
      'maxlength': config.maxLength,
      'aria-disabled': disabled,
      'aria-required': required,
      'aria-invalid': invalid,
      'data-state': disabled ? 'inactive' : 'active',
    };
  };

  return {
    get state() {
      return store.state;
    },
    subscribe: callback => store.subscribe(state => callback(state)),
    actions: { setValue, setDisabled, setRequired, focus, blur },
    queries: { isEmpty, isValid },
    getInputProps,
  };
}

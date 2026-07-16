import { describe, it, expect, vi } from 'vitest';
import { createSwitch } from '../switch';

describe('createSwitch', () => {
  it('initializes with defaults', () => {
    const switchLogic = createSwitch();
    expect(switchLogic.state.checked).toBe(false);
    expect(switchLogic.state.disabled).toBe(false);
    expect(switchLogic.state.required).toBe(false);
  });

  it('initializes with configured checked/disabled/required', () => {
    const switchLogic = createSwitch({ checked: true, disabled: true, required: true });
    expect(switchLogic.state.checked).toBe(true);
    expect(switchLogic.state.disabled).toBe(true);
    expect(switchLogic.state.required).toBe(true);
  });

  it('toggles checked state', () => {
    const switchLogic = createSwitch();
    switchLogic.actions.toggle();
    expect(switchLogic.state.checked).toBe(true);
    switchLogic.actions.toggle();
    expect(switchLogic.state.checked).toBe(false);
  });

  it('sets checked state directly', () => {
    const switchLogic = createSwitch();
    switchLogic.actions.setChecked(true);
    expect(switchLogic.state.checked).toBe(true);
  });

  it('notifies onCheckedChange when checked changes', () => {
    const onCheckedChange = vi.fn();
    const switchLogic = createSwitch({ onCheckedChange });

    switchLogic.actions.toggle();
    expect(onCheckedChange).toHaveBeenCalledWith(true);

    switchLogic.actions.toggle();
    expect(onCheckedChange).toHaveBeenCalledWith(false);
  });

  it('does not notify onCheckedChange when setting the same value', () => {
    const onCheckedChange = vi.fn();
    const switchLogic = createSwitch({ checked: true, onCheckedChange });

    switchLogic.actions.setChecked(true);
    expect(onCheckedChange).not.toHaveBeenCalled();
  });

  it('still allows programmatic setChecked/toggle while disabled', () => {
    // Native checkboxes allow `.checked` to be set via script regardless of
    // `.disabled` — only user interaction is blocked, which the real
    // checkbox in and-switch.tsx already enforces natively. This also
    // matters for restoring a disabled-and-checked switch on form reset.
    const onCheckedChange = vi.fn();
    const switchLogic = createSwitch({ disabled: true, onCheckedChange });

    switchLogic.actions.setChecked(true);
    expect(switchLogic.state.checked).toBe(true);
    expect(onCheckedChange).toHaveBeenCalledWith(true);

    switchLogic.actions.toggle();
    expect(switchLogic.state.checked).toBe(false);
  });

  it('sets disabled and required independently of checked', () => {
    const switchLogic = createSwitch();
    switchLogic.actions.setDisabled(true);
    expect(switchLogic.state.disabled).toBe(true);
    switchLogic.actions.setRequired(true);
    expect(switchLogic.state.required).toBe(true);
  });

  it('subscribes to state changes', () => {
    const switchLogic = createSwitch();
    const listener = vi.fn();
    const unsubscribe = switchLogic.subscribe(listener);

    switchLogic.actions.toggle();
    expect(listener).toHaveBeenCalledTimes(1);

    unsubscribe();
    switchLogic.actions.toggle();
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('returns correct input props', () => {
    const switchLogic = createSwitch({ checked: true, required: true });
    const props = switchLogic.getInputProps();

    expect(props.type).toBe('checkbox');
    expect(props.role).toBe('switch');
    expect(props.checked).toBe(true);
    expect(props.required).toBe(true);
    expect(props.disabled).toBe(false);
    expect(props['aria-checked']).toBe('true');
    expect(props['data-state']).toBe('selected');
  });

  it('reflects unchecked/disabled state in input props', () => {
    const switchLogic = createSwitch({ disabled: true });
    const props = switchLogic.getInputProps();

    expect(props.checked).toBe(false);
    expect(props.disabled).toBe(true);
    expect(props['aria-checked']).toBe('false');
    expect(props['data-state']).toBe('unselected');
    expect(props['data-disabled']).toBe(true);
  });
});

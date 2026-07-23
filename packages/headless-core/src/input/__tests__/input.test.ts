import { describe, it, expect, vi } from 'vitest';
import { createInput } from '../input';

describe('createInput', () => {
  it('returns expected default state and methods', () => {
    const input = createInput();
    expect(input.state.value).toBe('');
    expect(input.state.disabled).toBe(false);
    expect(input.state.required).toBe(false);
    expect(input.state.touched).toBe(false);
    expect(input.state.focused).toBe(false);
    expect(input.actions).toBeDefined();
    expect(input.queries).toBeDefined();
    expect(input.getInputProps).toBeDefined();
  });

  it('can explicitly set initial config', () => {
    const input = createInput({
      defaultValue: 'hello',
      disabled: true,
      required: true,
      maxLength: 10,
    });
    expect(input.state.value).toBe('hello');
    expect(input.state.disabled).toBe(true);
    expect(input.state.required).toBe(true);
  });

  it('can set value', () => {
    const input = createInput();
    input.actions.setValue('world');
    expect(input.state.value).toBe('world');
  });

  it('does not set value when disabled', () => {
    const input = createInput({ disabled: true });
    input.actions.setValue('world');
    expect(input.state.value).toBe('');
  });

  it('calls onValueChange callback when value changes', () => {
    const onValueChange = vi.fn();
    const input = createInput({ onValueChange });
    input.actions.setValue('new');
    expect(onValueChange).toHaveBeenCalledWith('new');
  });

  it('does not call onValueChange when disabled', () => {
    const onValueChange = vi.fn();
    const input = createInput({ disabled: true, onValueChange });
    input.actions.setValue('new');
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('can change disabled state', () => {
    const input = createInput();
    input.actions.setDisabled(true);
    expect(input.state.disabled).toBe(true);
    input.actions.setDisabled(false);
    expect(input.state.disabled).toBe(false);
  });

  it('can change required state', () => {
    const input = createInput();
    input.actions.setRequired(true);
    expect(input.state.required).toBe(true);
    input.actions.setRequired(false);
    expect(input.state.required).toBe(false);
  });

  it('can focus and blur', () => {
    const input = createInput();
    input.actions.focus();
    expect(input.state.focused).toBe(true);
    expect(input.state.touched).toBe(false);

    input.actions.blur();
    expect(input.state.focused).toBe(false);
    expect(input.state.touched).toBe(true);
  });

  it('does not focus when disabled', () => {
    const input = createInput({ disabled: true });
    input.actions.focus();
    expect(input.state.focused).toBe(false);
  });

  it('provides correct empty query', () => {
    const input = createInput({ defaultValue: 'text' });
    expect(input.queries.isEmpty()).toBe(false);
    input.actions.setValue('');
    expect(input.queries.isEmpty()).toBe(true);
  });

  it('provides correct valid query', () => {
    const input = createInput({ required: true });
    expect(input.queries.isValid()).toBe(false); // empty and required

    input.actions.setValue('filled');
    expect(input.queries.isValid()).toBe(true);

    input.actions.setValue('');
    expect(input.queries.isValid()).toBe(false);
  });

  it('is always valid when not required', () => {
    const input = createInput();
    input.actions.blur();
    expect(input.queries.isValid()).toBe(true);
  });

  it('provides correct input props', () => {
    const input = createInput({
      defaultValue: 'hello',
      disabled: true,
      required: true,
      maxLength: 20,
    });
    const props = input.getInputProps();
    expect(props.type).toBe('text');
    expect(props.value).toBe('hello');
    expect(props.disabled).toBe(true);
    expect(props.required).toBe(true);
    expect(props.maxlength).toBe(20);
    expect(props['aria-disabled']).toBe('true');
    expect(props['aria-required']).toBe('true');
    expect(props['data-state']).toBe('inactive');
  });

  it('marks aria-invalid when required, touched and empty', () => {
    const input = createInput({ required: true });
    input.actions.blur();
    const props = input.getInputProps();
    expect(props['aria-invalid']).toBe('true');
  });

  it('does not mark aria-invalid when required but not touched', () => {
    const input = createInput({ required: true });
    const props = input.getInputProps();
    expect(props['aria-invalid']).toBe('false');
  });

  it('uses active data-state when not disabled', () => {
    const input = createInput();
    const props = input.getInputProps();
    expect(props['data-state']).toBe('active');
  });

  it('notifies subscribers on state changes', () => {
    const input = createInput();
    const callback = vi.fn();
    const unsubscribe = input.subscribe(callback);

    input.actions.setValue('x');
    expect(callback).toHaveBeenCalled();

    unsubscribe();
    input.actions.setValue('y');
    expect(callback).toHaveBeenCalledTimes(1);
  });
});

import { describe, it, expect, vi } from 'vitest';
import { createButton } from '../button';

describe('createButton', () => {
  it('returns expected default state and methods', () => {
    const button = createButton();
    expect(button.state.disabled).toBe(false);
    expect(button.state.loading).toBe(false);
    expect(button.state.type).toBe('button');
    expect(button.actions).toBeDefined();
  });

  it('can explicitly set initial config', () => {
    const button = createButton({
      disabled: true,
      loading: true,
      type: 'submit',
      ariaLabel: 'Submit'
    });
    expect(button.state.disabled).toBe(true);
    expect(button.state.loading).toBe(true);
    expect(button.state.type).toBe('submit');
  });

  it('can set disabled state', () => {
    const button = createButton();
    button.actions.setDisabled(true);
    expect(button.state.disabled).toBe(true);
  });

  it('can set loading state', () => {
    const button = createButton();
    button.actions.setLoading(true);
    expect(button.state.loading).toBe(true);
  });

  it('handles click and triggers onClick callback when enabled', () => {
    const onClick = vi.fn();
    const button = createButton({ onClick });
    const event = {} as unknown as MouseEvent;
    button.handleClick(event);
    expect(onClick).toHaveBeenCalledWith(event);
  });

  it('prevents default and does not trigger onClick when disabled', () => {
    const onClick = vi.fn();
    const button = createButton({ disabled: true, onClick });
    const preventDefault = vi.fn();
    const event = { preventDefault } as unknown as MouseEvent;

    button.handleClick(event);
    expect(preventDefault).toHaveBeenCalled();
    expect(onClick).not.toHaveBeenCalled();
  });

  it('prevents default and does not trigger onClick when loading', () => {
    const onClick = vi.fn();
    const button = createButton({ loading: true, onClick });
    const preventDefault = vi.fn();
    const event = { preventDefault } as unknown as MouseEvent;

    button.handleClick(event);
    expect(preventDefault).toHaveBeenCalled();
    expect(onClick).not.toHaveBeenCalled();
  });

  it('provides correct queries', () => {
    const button = createButton();
    expect(button.queries.isDisabled()).toBe(false);
    expect(button.queries.isLoading()).toBe(false);

    button.actions.setDisabled(true);
    expect(button.queries.isDisabled()).toBe(true);

    button.actions.setDisabled(false);
    button.actions.setLoading(true);
    expect(button.queries.isDisabled()).toBe(true);
    expect(button.queries.isLoading()).toBe(true);
  });

  it('provides correct button props when enabled', () => {
    const button = createButton({ ariaLabel: 'Click me' });
    const props = button.getButtonProps();

    expect(props.type).toBe('button');
    expect(props.disabled).toBe(false);
    expect(props.tabindex).toBe(0);
    expect(props['aria-disabled']).toBe(false);
    expect(props['aria-busy']).toBe(false);
    expect(props['aria-label']).toBe('Click me');
    expect(props['data-state']).toBe('active');
    expect(props['data-disabled']).toBe(false);
  });

  it('provides correct button props when disabled or loading', () => {
    const button = createButton({ disabled: true });
    let props = button.getButtonProps();

    expect(props.disabled).toBe(true);
    expect(props.tabindex).toBe(-1);
    expect(props['aria-disabled']).toBe(true);
    expect(props['data-state']).toBe('inactive');
    expect(props['data-disabled']).toBe(true);

    button.actions.setDisabled(false);
    button.actions.setLoading(true);
    props = button.getButtonProps();

    expect(props.disabled).toBe(true);
    expect(props['aria-busy']).toBe(true);
    expect(props['aria-disabled']).toBe(true);
  });
});

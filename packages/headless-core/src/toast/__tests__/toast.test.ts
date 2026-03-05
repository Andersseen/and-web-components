import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createToastManager } from '../toast';

describe('createToastManager', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('returns expected default state and methods', () => {
    const manager = createToastManager();
    expect(manager.state.toasts).toEqual([]);
    expect(manager.state.position).toBe('bottom-right');
    expect(manager.actions).toBeDefined();
  });

  it('can initialize with config', () => {
    const manager = createToastManager({ position: 'top-center' });
    expect(manager.state.position).toBe('top-center');
  });

  it('can present a toast', () => {
    const manager = createToastManager();
    const id = manager.actions.present('Hello world');

    expect(typeof id).toBe('number');
    expect(manager.state.toasts.length).toBe(1);
    expect(manager.state.toasts[0].message).toBe('Hello world');
    expect(manager.state.toasts[0].type).toBe('default');
  });

  it('can present a toast with specific type and duration', () => {
    const manager = createToastManager();
    manager.actions.present('Success!', 'success', 5000);

    expect(manager.state.toasts.length).toBe(1);
    expect(manager.state.toasts[0].message).toBe('Success!');
    expect(manager.state.toasts[0].type).toBe('success');
    expect(manager.state.toasts[0].duration).toBe(5000);
  });

  it('auto-dismisses a toast after duration', () => {
    const manager = createToastManager({ defaultDuration: 3000 });
    manager.actions.present('Auto dismiss');

    expect(manager.state.toasts.length).toBe(1);

    vi.advanceTimersByTime(3000);

    expect(manager.state.toasts.length).toBe(0);
  });

  it('can manually dismiss a toast', () => {
    const manager = createToastManager();
    const id = manager.actions.present('To be dismissed');

    expect(manager.state.toasts.length).toBe(1);

    manager.actions.dismiss(id);
    expect(manager.state.toasts.length).toBe(0);
  });

  it('can dismiss all toasts', () => {
    const manager = createToastManager();
    manager.actions.present('Toast 1');
    manager.actions.present('Toast 2');
    manager.actions.present('Toast 3');

    expect(manager.state.toasts.length).toBe(3);

    manager.actions.dismissAll();
    expect(manager.state.toasts.length).toBe(0);
  });

  it('respects maxToasts limit', () => {
    const manager = createToastManager({ maxToasts: 2 });
    manager.actions.present('Toast 1');
    manager.actions.present('Toast 2');
    manager.actions.present('Toast 3');

    expect(manager.state.toasts.length).toBe(2);
    expect(manager.state.toasts[0].message).toBe('Toast 2');
    expect(manager.state.toasts[1].message).toBe('Toast 3');
  });

  it('calls onToastsChange callback', () => {
    const onToastsChange = vi.fn();
    const manager = createToastManager({ onToastsChange });

    const id = manager.actions.present('Toast 1');
    expect(onToastsChange).toHaveBeenCalledTimes(1);
    expect(onToastsChange.mock.calls[0][0][0].message).toBe('Toast 1');

    manager.actions.dismiss(id);
    expect(onToastsChange).toHaveBeenCalledTimes(2);
    expect(onToastsChange.mock.calls[1][0]).toEqual([]);
  });

  it('does not auto-dismiss if duration is 0', () => {
    const manager = createToastManager();
    manager.actions.present('Persistent', 'info', 0);

    expect(manager.state.toasts.length).toBe(1);

    vi.advanceTimersByTime(10000);
    expect(manager.state.toasts.length).toBe(1);
  });

  it('provides correct container props', () => {
    const manager = createToastManager({ position: 'top-left' });
    const props = manager.getContainerProps();

    expect(props.role).toBe('region');
    expect(props['aria-label']).toBe('Notifications');
    expect(props['aria-live']).toBe('polite');
    expect(props['aria-atomic']).toBe(false);
    expect(props['data-position']).toBe('top-left');
  });

  it('provides correct toast props', () => {
    const manager = createToastManager();
    manager.actions.present('Message', 'error');
    const toast = manager.state.toasts[0];

    const props = manager.getToastProps(toast);
    expect(props.role).toBe('alert');
    expect(props['aria-live']).toBe('assertive');
    expect(props['aria-atomic']).toBe(true);
    expect(props['data-type']).toBe('error');
  });

  it('provides correct dismiss button props', () => {
    const manager = createToastManager();
    const props = manager.getDismissProps();

    expect(props['aria-label']).toBe('Dismiss notification');
    expect(props.type).toBe('button');
  });

  it('cleans up timers on destroy', () => {
    const manager = createToastManager({ defaultDuration: 3000 });
    manager.actions.present('Toast 1');

    expect(manager.state.toasts.length).toBe(1);
    manager.destroy();

    // Destroy clears timers but doesn't modify state. Let's advance time.
    vi.advanceTimersByTime(3000);

    // If timer was cleared, the toast should still be in state
    expect(manager.state.toasts.length).toBe(1);
  });
});

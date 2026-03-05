import { describe, it, expect, vi } from 'vitest';
import { createAlert } from '../alert';

describe('createAlert', () => {
  it('returns expected default state and methods', () => {
    const alert = createAlert();
    expect(alert.state.variant).toBe('default');
    expect(alert.state.visible).toBe(true);
    expect(alert.state.dismissible).toBe(false);
    expect(alert.actions).toBeDefined();
  });

  it('can explicitly set initial config', () => {
    const alert = createAlert({
      variant: 'destructive',
      dismissible: true,
      defaultVisible: false,
    });
    expect(alert.state.variant).toBe('destructive');
    expect(alert.state.visible).toBe(false);
    expect(alert.state.dismissible).toBe(true);
  });

  it('can be shown', () => {
    const alert = createAlert({ defaultVisible: false });
    alert.actions.show();
    expect(alert.state.visible).toBe(true);
  });

  it('can change variant', () => {
    const alert = createAlert();
    alert.actions.setVariant('success');
    expect(alert.state.variant).toBe('success');
  });

  it('can set dismissible state', () => {
    const alert = createAlert();
    alert.actions.setDismissible(true);
    expect(alert.state.dismissible).toBe(true);
  });

  it('dismisses when dismissible', () => {
    const alert = createAlert({ dismissible: true });
    alert.actions.dismiss();
    expect(alert.state.visible).toBe(false);
  });

  it('does not dismiss when not dismissible', () => {
    const alert = createAlert({ dismissible: false });
    alert.actions.dismiss();
    expect(alert.state.visible).toBe(true);
  });

  it('calls onDismiss and onVisibilityChange callbacks', () => {
    const onDismiss = vi.fn();
    const onVisibilityChange = vi.fn();
    const alert = createAlert({ dismissible: true, onDismiss, onVisibilityChange });

    alert.actions.dismiss();
    expect(onDismiss).toHaveBeenCalled();
    expect(onVisibilityChange).toHaveBeenCalledWith(false);

    alert.actions.show();
    expect(onVisibilityChange).toHaveBeenCalledWith(true);
  });

  it('provides correct alert props for default variant', () => {
    const alert = createAlert();
    const props = alert.getAlertProps();
    expect(props.role).toBe('status');
    expect(props['aria-live']).toBe('polite');
    expect(props['aria-atomic']).toBe(true);
    expect(props['data-state']).toBe('open');
    expect(props['data-variant']).toBe('default');
  });

  it('provides correct alert props for urgent variants', () => {
    const alert = createAlert({ variant: 'destructive' });
    const props = alert.getAlertProps();
    expect(props.role).toBe('alert');
    expect(props['aria-live']).toBe('assertive');

    alert.actions.setVariant('warning');
    const props2 = alert.getAlertProps();
    expect(props2.role).toBe('alert');
    expect(props2['aria-live']).toBe('assertive');
  });

  it('provides correct dismiss button props', () => {
    const alert = createAlert();
    const props = alert.getDismissButtonProps();
    expect(props['aria-label']).toBe('Dismiss alert');
    expect(props.type).toBe('button');
  });
});

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createTooltip } from '../tooltip';

describe('createTooltip', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('returns expected default state and methods', () => {
    const tooltip = createTooltip();
    expect(tooltip.state.isVisible).toBe(false);
    expect(tooltip.state.placement).toBe('top');
    expect(tooltip.state.disabled).toBe(false);
    expect(tooltip.actions).toBeDefined();
  });

  it('can explicitly set initial config', () => {
    const tooltip = createTooltip({ placement: 'bottom', disabled: true });
    expect(tooltip.state.placement).toBe('bottom');
    expect(tooltip.state.disabled).toBe(true);
  });

  it('can show and hide immediately with 0 delay', () => {
    const tooltip = createTooltip();
    tooltip.actions.show();

    // Default openDelay is 0, but it still uses setTimeout so we need to advance time
    vi.advanceTimersByTime(0);
    expect(tooltip.state.isVisible).toBe(true);

    tooltip.actions.hide();
    vi.advanceTimersByTime(0);
    expect(tooltip.state.isVisible).toBe(false);
  });

  it('respects openDelay', () => {
    const tooltip = createTooltip({ openDelay: 200 });
    tooltip.actions.show();

    vi.advanceTimersByTime(100);
    expect(tooltip.state.isVisible).toBe(false);

    vi.advanceTimersByTime(100);
    expect(tooltip.state.isVisible).toBe(true);
  });

  it('respects closeDelay', () => {
    const tooltip = createTooltip({ closeDelay: 300 });
    tooltip.actions.show();
    vi.advanceTimersByTime(0);
    expect(tooltip.state.isVisible).toBe(true);

    tooltip.actions.hide();
    vi.advanceTimersByTime(200);
    expect(tooltip.state.isVisible).toBe(true);

    vi.advanceTimersByTime(100);
    expect(tooltip.state.isVisible).toBe(false);
  });

  it('calls onVisibilityChange callback', () => {
    const onVisibilityChange = vi.fn();
    const tooltip = createTooltip({ onVisibilityChange });

    tooltip.actions.show();
    vi.advanceTimersByTime(0);
    expect(onVisibilityChange).toHaveBeenCalledWith(true);

    tooltip.actions.hide();
    vi.advanceTimersByTime(0);
    expect(onVisibilityChange).toHaveBeenCalledWith(false);
  });

  it('cancels pending hide if shown again quickly', () => {
    const tooltip = createTooltip({ closeDelay: 200 });
    tooltip.actions.show();
    vi.advanceTimersByTime(0);
    expect(tooltip.state.isVisible).toBe(true);

    tooltip.actions.hide();
    vi.advanceTimersByTime(100); // Wait halfway
    expect(tooltip.state.isVisible).toBe(true);

    tooltip.actions.show(); // Show again before hide finishes
    vi.advanceTimersByTime(200); // Past the original hide delay
    expect(tooltip.state.isVisible).toBe(true);
  });

  it('can set placement', () => {
    const tooltip = createTooltip();
    tooltip.actions.setPlacement('right');
    expect(tooltip.state.placement).toBe('right');
  });

  it('does nothing when disabled', () => {
    const tooltip = createTooltip({ disabled: true });
    tooltip.actions.show();
    vi.advanceTimersByTime(1000);
    expect(tooltip.state.isVisible).toBe(false);
  });

  it('can change disabled state and closes immediately if disabled while open', () => {
    const tooltip = createTooltip();
    tooltip.actions.show();
    vi.advanceTimersByTime(0);
    expect(tooltip.state.isVisible).toBe(true);

    tooltip.actions.setDisabled(true);
    expect(tooltip.state.disabled).toBe(true);
    // Disabling should close it immediately (no timeout)
    expect(tooltip.state.isVisible).toBe(false);
  });

  it('provides correct trigger props', () => {
    const tooltip = createTooltip();
    const props = tooltip.getTriggerProps();

    // when hidden
    expect(props['aria-describedby']).toBe('');

    tooltip.actions.show();
    vi.advanceTimersByTime(0);

    // when shown
    const shownProps = tooltip.getTriggerProps();
    expect(shownProps['aria-describedby']).toMatch(/^tooltip-/);
  });

  it('provides correct tooltip props', () => {
    const tooltip = createTooltip({ placement: 'left' });
    const props = tooltip.getTooltipProps();

    // when hidden
    expect(props.role).toBe('tooltip');
    expect(props['aria-hidden']).toBe(true);
    expect(props['data-state']).toBe('closed');
    expect(props['data-side']).toBe('left');
    expect(props.hidden).toBe(true);
    expect(props.id).toMatch(/^tooltip-/);

    tooltip.actions.show();
    vi.advanceTimersByTime(0);

    // when shown
    const shownProps = tooltip.getTooltipProps();
    expect(shownProps['aria-hidden']).toBe(false);
    expect(shownProps['data-state']).toBe('open');
    expect(shownProps.hidden).toBe(false);
  });

  it('exposes event handlers that show and hide', () => {
    const tooltip = createTooltip({ openDelay: 0, closeDelay: 0 });

    tooltip.handleMouseEnter();
    vi.advanceTimersByTime(0);
    expect(tooltip.state.isVisible).toBe(true);

    tooltip.handleMouseLeave();
    vi.advanceTimersByTime(0);
    expect(tooltip.state.isVisible).toBe(false);

    tooltip.handleFocusIn();
    vi.advanceTimersByTime(0);
    expect(tooltip.state.isVisible).toBe(true);

    tooltip.handleFocusOut();
    vi.advanceTimersByTime(0);
    expect(tooltip.state.isVisible).toBe(false);
  });

  it('cleans up timers on destroy', () => {
    const tooltip = createTooltip({ openDelay: 1000 });
    tooltip.actions.show();

    tooltip.destroy();

    vi.advanceTimersByTime(1000);
    expect(tooltip.state.isVisible).toBe(false); // Timer was cleared
  });
});

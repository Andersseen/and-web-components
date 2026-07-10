import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createTooltip } from './create-tooltip';

describe('createTooltip', () => {
  let element: HTMLElement;
  let instance: ReturnType<typeof createTooltip> | null = null;

  beforeEach(() => {
    vi.useFakeTimers();
    element = document.createElement('button');
    element.textContent = 'Hover me';
    document.body.appendChild(element);
  });

  afterEach(() => {
    vi.useRealTimers();
    instance?.destroy();
    instance = null;
    element.remove();
    document.querySelectorAll('.and-tooltip').forEach(el => el.remove());
  });

  it('should create tooltip element on mouseenter after delay', () => {
    instance = createTooltip(element, { content: 'Hello tooltip', showDelay: 300 });

    element.dispatchEvent(new MouseEvent('mouseenter'));
    expect(document.querySelector('.and-tooltip')).toBeNull();

    vi.advanceTimersByTime(300);
    const tooltip = document.querySelector('.and-tooltip');
    expect(tooltip).not.toBeNull();
    expect(tooltip?.textContent).toBe('Hello tooltip');
  });

  it('should remove tooltip on mouseleave after hide delay', () => {
    instance = createTooltip(element, { content: 'Hello tooltip', showDelay: 100, hideDelay: 100 });

    element.dispatchEvent(new MouseEvent('mouseenter'));
    vi.advanceTimersByTime(100);
    expect(document.querySelector('.and-tooltip')).not.toBeNull();

    element.dispatchEvent(new MouseEvent('mouseleave'));
    vi.advanceTimersByTime(100);
    expect(document.querySelector('.and-tooltip')).toBeNull();
  });

  it('should not show tooltip when disabled', () => {
    instance = createTooltip(element, { content: 'Hello tooltip', showDelay: 100, disabled: true });

    element.dispatchEvent(new MouseEvent('mouseenter'));
    vi.advanceTimersByTime(100);
    expect(document.querySelector('.and-tooltip')).toBeNull();
  });

  it('should set aria-describedby when tooltip is visible', () => {
    instance = createTooltip(element, { content: 'Hello tooltip', showDelay: 100 });

    element.dispatchEvent(new MouseEvent('mouseenter'));
    vi.advanceTimersByTime(100);

    const tooltip = document.querySelector('.and-tooltip');
    expect(tooltip).not.toBeNull();
    expect(element.getAttribute('aria-describedby')).toBe(tooltip?.id);
  });

  it('should dismiss the tooltip on Escape (WCAG 1.4.13)', () => {
    instance = createTooltip(element, { content: 'Hello tooltip', showDelay: 100 });

    element.dispatchEvent(new MouseEvent('mouseenter'));
    vi.advanceTimersByTime(100);
    expect(document.querySelector('.and-tooltip')).not.toBeNull();

    element.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(document.querySelector('.and-tooltip')).toBeNull();
    expect(element.getAttribute('aria-describedby')).toBeNull();
  });

  it('should allow interactive hover on tooltip element', () => {
    instance = createTooltip(element, {
      content: 'Hello tooltip',
      showDelay: 100,
      hideDelay: 100,
      interactive: true,
    });

    element.dispatchEvent(new MouseEvent('mouseenter'));
    vi.advanceTimersByTime(100);

    const tooltip = document.querySelector('.and-tooltip') as HTMLElement;
    expect(tooltip).not.toBeNull();

    // Mouse leaves trigger but enters tooltip
    element.dispatchEvent(new MouseEvent('mouseleave'));
    tooltip.dispatchEvent(new MouseEvent('mouseenter'));

    // Even after delay, it should not close
    vi.advanceTimersByTime(200);
    expect(document.querySelector('.and-tooltip')).not.toBeNull();

    // Mouse leaves tooltip
    tooltip.dispatchEvent(new MouseEvent('mouseleave'));
    vi.advanceTimersByTime(200);
    expect(document.querySelector('.and-tooltip')).toBeNull();
  });

  it('should update content dynamically when updateOptions is called', () => {
    instance = createTooltip(element, { content: 'Initial', showDelay: 0 });
    instance.show();
    vi.advanceTimersByTime(0);

    let tooltip = document.querySelector('.and-tooltip');
    expect(tooltip?.textContent).toBe('Initial');

    instance.updateOptions({ content: 'Updated content' });
    tooltip = document.querySelector('.and-tooltip');
    expect(tooltip?.textContent).toBe('Updated content');
  });
});

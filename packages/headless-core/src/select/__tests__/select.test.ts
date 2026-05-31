import { describe, it, expect, vi } from 'vitest';
import { createSelect } from '../select';
import type { SelectOption } from '../select';

const options: SelectOption[] = [
  { text: 'Apple', value: 'apple' },
  { text: 'Banana', value: 'banana' },
  { text: 'Cherry', value: 'cherry' },
  { text: 'Disabled', value: 'disabled', disabled: true },
];

function createKeyboardEvent(key: string, altKey = false): KeyboardEvent {
  const preventDefault = vi.fn();
  return { key, altKey, preventDefault } as unknown as KeyboardEvent;
}

describe('createSelect', () => {
  it('initializes with closed state and default value', () => {
    const select = createSelect({ options, defaultValue: 'banana' });
    expect(select.state.isOpen).toBe(false);
    expect(select.state.selectedValue).toBe('banana');
    expect(select.state.highlightedIndex).toBe(1);
    expect(select.queries.getSelectedText()).toBe('Banana');
  });

  it('opens and closes', () => {
    const select = createSelect({ options });
    expect(select.state.isOpen).toBe(false);

    select.actions.open();
    expect(select.state.isOpen).toBe(true);

    select.actions.close();
    expect(select.state.isOpen).toBe(false);
  });

  it('toggles open state', () => {
    const select = createSelect({ options });
    select.actions.toggle();
    expect(select.state.isOpen).toBe(true);
    select.actions.toggle();
    expect(select.state.isOpen).toBe(false);
  });

  it('does not open when disabled', () => {
    const select = createSelect({ options, disabled: true });
    select.actions.open();
    expect(select.state.isOpen).toBe(false);
  });

  it('notifies on open change', () => {
    const onOpenChange = vi.fn();
    const select = createSelect({ options, onOpenChange });

    select.actions.open();
    expect(onOpenChange).toHaveBeenCalledWith(true);

    select.actions.close();
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('selects value and emits callback', () => {
    const onValueChange = vi.fn();
    const select = createSelect({ options, onValueChange });

    select.actions.selectValue('cherry');
    expect(select.state.selectedValue).toBe('cherry');
    expect(onValueChange).toHaveBeenCalledWith('cherry');
  });

  it('does not select disabled option', () => {
    const select = createSelect({ options });
    select.actions.selectValue('disabled');
    expect(select.state.selectedValue).toBeNull();
  });

  it('selects highlighted option', () => {
    const select = createSelect({ options });
    select.actions.open();
    select.actions.highlightNext();
    select.actions.selectHighlighted();
    expect(select.state.selectedValue).toBe('banana');
    expect(select.state.isOpen).toBe(false);
  });

  it('skips disabled options when highlighting next', () => {
    const select = createSelect({ options });
    select.actions.open();
    // Start at apple (0), next should be banana (1), cherry (2), then wrap to apple (0) skipping disabled (3)
    select.actions.highlightNext(); // -> banana
    expect(select.state.highlightedIndex).toBe(1);
    select.actions.highlightNext(); // -> cherry
    expect(select.state.highlightedIndex).toBe(2);
    select.actions.highlightNext(); // -> apple (wrap, skip disabled)
    expect(select.state.highlightedIndex).toBe(0);
  });

  it('skips disabled options when highlighting prev', () => {
    const select = createSelect({ options });
    select.actions.open();
    select.actions.highlightPrev(); // should wrap to cherry, skipping disabled
    expect(select.state.highlightedIndex).toBe(2);
  });

  it('highlights first and last', () => {
    const select = createSelect({ options });
    select.actions.open();
    select.actions.highlightLast();
    // highlightLast uses highlightTo(options.length - 1, -1)
    // It starts at 3, checks disabled -> true, moves to 2, checks cherry -> not disabled, stops
    expect(select.state.highlightedIndex).toBe(2);

    select.actions.highlightFirst();
    expect(select.state.highlightedIndex).toBe(0);
  });

  it('handles typeahead', () => {
    vi.useFakeTimers();
    const select = createSelect({ options });
    select.actions.open();

    select.handleMenuKeyDown(createKeyboardEvent('b'));
    expect(select.state.highlightedIndex).toBe(1); // Banana

    vi.advanceTimersByTime(600);
    vi.useRealTimers();
  });

  it('closes on Escape', () => {
    const select = createSelect({ options });
    select.actions.open();
    select.handleMenuKeyDown(createKeyboardEvent('Escape'));
    expect(select.state.isOpen).toBe(false);
  });

  it('closes on Tab', () => {
    const select = createSelect({ options });
    select.actions.open();
    select.handleMenuKeyDown(createKeyboardEvent('Tab'));
    expect(select.state.isOpen).toBe(false);
  });

  it('closes on Alt+ArrowUp', () => {
    const select = createSelect({ options });
    select.actions.open();
    select.handleMenuKeyDown(createKeyboardEvent('ArrowUp', true));
    expect(select.state.isOpen).toBe(false);
  });

  it('closes on Alt+ArrowDown', () => {
    const select = createSelect({ options });
    select.actions.open();
    select.handleMenuKeyDown(createKeyboardEvent('ArrowDown', true));
    expect(select.state.isOpen).toBe(false);
  });

  it('updates options dynamically', () => {
    const select = createSelect({ options });
    select.actions.selectValue('banana');

    const newOptions: SelectOption[] = [
      { text: 'Date', value: 'date' },
      { text: 'Elderberry', value: 'elderberry' },
    ];
    select.actions.setOptions(newOptions);

    expect(select.queries.getOptions()).toEqual(newOptions);
    // Previous selection should be cleared since value no longer exists
    expect(select.state.highlightedIndex).toBe(-1);
  });

  it('sets disabled and closes if open', () => {
    const select = createSelect({ options });
    select.actions.open();
    expect(select.state.isOpen).toBe(true);

    select.actions.setDisabled(true);
    expect(select.state.disabled).toBe(true);
    expect(select.state.isOpen).toBe(false);
  });

  it('returns correct trigger props', () => {
    const select = createSelect({ options, disabled: true });
    const props = select.getTriggerProps();
    expect(props['aria-haspopup']).toBe('listbox');
    expect(props['aria-expanded']).toBe('false');
    expect(props['aria-disabled']).toBe('true');
  });

  it('returns correct item props', () => {
    const select = createSelect({ options, defaultValue: 'apple' });
    select.actions.open();
    const props = select.getItemProps(options[0], 0);
    expect(props.role).toBe('option');
    expect(props['aria-selected']).toBe('true');
    expect(props['data-state']).toBe('active');

    const props2 = select.getItemProps(options[1], 1);
    expect(props2['aria-selected']).toBe('false');
    expect(props2['data-state']).toBe('inactive');
  });

  it('subscribes to state changes', () => {
    const select = createSelect({ options });
    const listener = vi.fn();
    const unsubscribe = select.subscribe(listener);

    select.actions.open();
    expect(listener).toHaveBeenCalled();

    unsubscribe();
    select.actions.close();
    // listener was called once for open, not for close after unsubscribe
    expect(listener).toHaveBeenCalledTimes(1);
  });
});

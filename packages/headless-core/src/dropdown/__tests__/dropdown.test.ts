import { describe, it, expect, vi } from 'vitest';
import { createDropdown } from '../dropdown';

describe('createDropdown', () => {
  it('returns expected default state and methods', () => {
    const dropdown = createDropdown();
    expect(dropdown.state.isOpen).toBe(false);
    expect(dropdown.state.placement).toBe('bottom');
    expect(dropdown.state.disabled).toBe(false);
    expect(dropdown.actions).toBeDefined();
  });

  it('can explicitly set initial config', () => {
    const dropdown = createDropdown({
      defaultOpen: true,
      placement: 'top',
      disabled: true,
    });
    expect(dropdown.state.isOpen).toBe(true);
    expect(dropdown.state.placement).toBe('top');
    expect(dropdown.state.disabled).toBe(true);
  });

  it('can open and close', () => {
    const dropdown = createDropdown();
    dropdown.actions.open();
    expect(dropdown.state.isOpen).toBe(true);
    dropdown.actions.close();
    expect(dropdown.state.isOpen).toBe(false);
  });

  it('can toggle', () => {
    const dropdown = createDropdown();
    dropdown.actions.toggle();
    expect(dropdown.state.isOpen).toBe(true);
    dropdown.actions.toggle();
    expect(dropdown.state.isOpen).toBe(false);
  });

  it('calls onOpenChange callback', () => {
    const onOpenChange = vi.fn();
    const dropdown = createDropdown({ onOpenChange });
    dropdown.actions.open();
    expect(onOpenChange).toHaveBeenCalledWith(true);
    dropdown.actions.close();
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('closes on select by default', () => {
    const dropdown = createDropdown({ defaultOpen: true });
    dropdown.actions.selectItem('item-1');
    expect(dropdown.state.isOpen).toBe(false);
  });

  it('does not close on select if configured false', () => {
    const dropdown = createDropdown({ defaultOpen: true, closeOnSelect: false });
    dropdown.actions.selectItem('item-1');
    expect(dropdown.state.isOpen).toBe(true);
  });

  it('does nothing when disabled', () => {
    const dropdown = createDropdown({ disabled: true });
    dropdown.actions.open();
    expect(dropdown.state.isOpen).toBe(false);
    dropdown.actions.toggle();
    expect(dropdown.state.isOpen).toBe(false);
    dropdown.actions.selectItem('item-1');
    expect(dropdown.state.isOpen).toBe(false);
  });

  it('can change disabled state', () => {
    const dropdown = createDropdown();

    dropdown.actions.setDisabled(true);
    expect(dropdown.state.disabled).toBe(true);

    dropdown.actions.setDisabled(false);
    expect(dropdown.state.disabled).toBe(false);
  });

  it('provides correct queries', () => {
    const dropdown = createDropdown();
    expect(dropdown.queries.isOpen()).toBe(false);
    dropdown.actions.open();
    expect(dropdown.queries.isOpen()).toBe(true);
  });

  it('provides correct trigger props', () => {
    const dropdown = createDropdown();
    let props = dropdown.getTriggerProps();
    expect(props['aria-haspopup']).toBe('menu');
    expect(props['aria-expanded']).toBe(false);
    expect(props['aria-disabled']).toBe(false);
    expect(props['data-state']).toBe('closed');

    dropdown.actions.open();
    props = dropdown.getTriggerProps();
    expect(props['aria-expanded']).toBe(true);
    expect(props['data-state']).toBe('open');
  });

  it('provides correct content props', () => {
    const dropdown = createDropdown();
    let props = dropdown.getContentProps();
    expect(props.role).toBe('menu');
    expect(props['data-state']).toBe('closed');
    expect(props.hidden).toBe(true);

    dropdown.actions.open();
    props = dropdown.getContentProps();
    expect(props['data-state']).toBe('open');
    expect(props.hidden).toBe(false);
  });

  it('provides correct item props', () => {
    const dropdown = createDropdown();
    let props = dropdown.getItemProps('item-1');
    expect(props.role).toBe('menuitem');
    expect(props.tabindex).toBe(-1);

    dropdown.actions.open();
    props = dropdown.getItemProps('item-1');
    expect(props.tabindex).toBe(0);
  });

  it('handles trigger keydown to open (Enter, Space, ArrowDown, ArrowUp)', () => {
    const dropdown = createDropdown();
    const preventDefault = vi.fn();

    dropdown.handleTriggerKeyDown({ key: 'Enter', preventDefault } as any);
    expect(preventDefault).toHaveBeenCalled();
    expect(dropdown.state.isOpen).toBe(true);

    dropdown.actions.close();
    dropdown.handleTriggerKeyDown({ key: ' ', preventDefault } as any);
    expect(dropdown.state.isOpen).toBe(true);

    dropdown.actions.close();
    dropdown.handleTriggerKeyDown({ key: 'ArrowDown', preventDefault } as any);
    expect(dropdown.state.isOpen).toBe(true);

    dropdown.actions.close();
    dropdown.handleTriggerKeyDown({ key: 'ArrowUp', preventDefault } as any);
    expect(dropdown.state.isOpen).toBe(true);
  });

  it('handles content keydown (Escape to close, Tab to close)', () => {
    const dropdown = createDropdown({ defaultOpen: true });
    const preventDefault = vi.fn();

    dropdown.handleContentKeyDown({ key: 'Escape', preventDefault } as any, []);
    expect(preventDefault).toHaveBeenCalled();
    expect(dropdown.state.isOpen).toBe(false);

    dropdown.actions.open();
    dropdown.handleContentKeyDown({ key: 'Tab', preventDefault } as any, []);
    expect(preventDefault).toHaveBeenCalledTimes(1); // Not called for Tab
    expect(dropdown.state.isOpen).toBe(false);
  });
});

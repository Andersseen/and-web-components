import { describe, it, expect, vi } from 'vitest';
import { createMenuList } from '../menu-list';

describe('createMenuList', () => {
  it('returns expected default state and methods', () => {
    const menu = createMenuList();
    expect(menu.state.items).toEqual([]);
    expect(menu.state.ariaLabel).toBe('Menu');
    expect(menu.state.focusedIndex).toBe(-1);
    expect(menu.actions).toBeDefined();
  });

  it('can explicitly set initial config', () => {
    const items = [{ id: '1' }, { id: '2', disabled: true }];
    const menu = createMenuList({ ariaLabel: 'Actions', items });
    expect(menu.state.items).toEqual(items);
    expect(menu.state.ariaLabel).toBe('Actions');
  });

  it('can set items', () => {
    const menu = createMenuList();
    const items = [{ id: '1' }];
    menu.actions.setItems(items);
    expect(menu.state.items).toEqual(items);
    expect(menu.state.focusedIndex).toBe(-1);
  });

  it('can focus an enabled item', () => {
    const items = [{ id: '1' }, { id: '2' }];
    const menu = createMenuList({ items });
    menu.actions.focusItem(1);
    expect(menu.state.focusedIndex).toBe(1);
  });

  it('does not focus a disabled item', () => {
    const items = [{ id: '1' }, { id: '2', disabled: true }];
    const menu = createMenuList({ items });
    menu.actions.focusItem(1);
    expect(menu.state.focusedIndex).toBe(-1);
  });

  it('can select an enabled item and triggers onSelect callback', () => {
    const onSelect = vi.fn();
    const items = [{ id: '1' }];
    const menu = createMenuList({ items, onSelect });
    menu.actions.selectItem('1');
    expect(onSelect).toHaveBeenCalledWith('1');
  });

  it('cannot select a disabled item', () => {
    const onSelect = vi.fn();
    const items = [{ id: '1', disabled: true }];
    const menu = createMenuList({ items, onSelect });
    menu.actions.selectItem('1');
    expect(onSelect).not.toHaveBeenCalled();
  });

  it('provides correct menu props', () => {
    const menu = createMenuList({ ariaLabel: 'File Menu' });
    const props = menu.getMenuProps();
    expect(props.role).toBe('menu');
    expect(props['aria-label']).toBe('File Menu');
  });

  it('provides correct item props with roving focus', () => {
    const items = [{ id: '1' }, { id: '2', disabled: true }];
    const menu = createMenuList({ items, rovingFocus: true });
    menu.actions.focusItem(0);

    const props1 = menu.getItemProps(items[0], 0);
    expect(props1.role).toBe('menuitem');
    expect(props1.tabindex).toBe(0);
    expect(props1['data-state']).toBe('active');
    expect(props1['aria-disabled']).toBeUndefined();

    const props2 = menu.getItemProps(items[1], 1);
    expect(props2.role).toBe('menuitem');
    expect(props2.tabindex).toBe(-1);
    expect(props2['data-state']).toBe('inactive');
    expect(props2['aria-disabled']).toBe(true);
    expect(props2['data-disabled']).toBe(true);
  });

  it('provides correct item props without roving focus', () => {
    const items = [{ id: '1' }];
    const menu = createMenuList({ items, rovingFocus: false });

    const props1 = menu.getItemProps(items[0], 0);
    expect(props1.tabindex).toBe(0); // enabled items are focusable without rovingFocus
  });

  it('handles menu keyboard navigation (ArrowDown, ArrowUp, Home, End)', () => {
    const items = [{ id: '1' }, { id: '2', disabled: true }, { id: '3' }];
    const menu = createMenuList({ items });
    const preventDefault = vi.fn();

    // ArrowDown from start (or nowhere) -> 1 (index 0)
    menu.handleMenuKeyDown({ key: 'ArrowDown', preventDefault } as any);
    expect(preventDefault).toHaveBeenCalled();
    expect(menu.state.focusedIndex).toBe(0);

    // ArrowDown -> 3 (index 2, skipping disabled index 1)
    menu.handleMenuKeyDown({ key: 'ArrowDown', preventDefault } as any);
    expect(menu.state.focusedIndex).toBe(2);

    // ArrowDown at end -> loops to 1 (index 0)
    menu.handleMenuKeyDown({ key: 'ArrowDown', preventDefault } as any);
    expect(menu.state.focusedIndex).toBe(0);

    // ArrowUp -> loops to 3 (index 2)
    menu.handleMenuKeyDown({ key: 'ArrowUp', preventDefault } as any);
    expect(menu.state.focusedIndex).toBe(2);

    // Home -> 1 (index 0)
    menu.handleMenuKeyDown({ key: 'Home', preventDefault } as any);
    expect(menu.state.focusedIndex).toBe(0);

    // End -> 3 (index 2)
    menu.handleMenuKeyDown({ key: 'End', preventDefault } as any);
    expect(menu.state.focusedIndex).toBe(2);
  });

  it('handles item keyboard interactions (Enter, Space)', () => {
    const onSelect = vi.fn();
    const items = [{ id: '1' }];
    const menu = createMenuList({ items, onSelect });
    const preventDefault = vi.fn();

    menu.handleItemKeyDown({ key: 'Enter', preventDefault } as any, items[0]);
    expect(preventDefault).toHaveBeenCalled();
    expect(onSelect).toHaveBeenCalledWith('1');

    menu.handleItemKeyDown({ key: ' ', preventDefault } as any, items[0]);
    expect(preventDefault).toHaveBeenCalledTimes(2);
    expect(onSelect).toHaveBeenCalledWith('1');
  });

  it('delegates unknown item keyboard events to menu handler', () => {
    const items = [{ id: '1' }, { id: '2' }];
    const menu = createMenuList({ items });
    const preventDefault = vi.fn();

    menu.actions.focusItem(0);
    menu.handleItemKeyDown({ key: 'ArrowDown', preventDefault } as any, items[0]);
    expect(preventDefault).toHaveBeenCalled();
    expect(menu.state.focusedIndex).toBe(1); // ArrowDown handled by menu
  });

  it('ignores item keyboard interactions if disabled', () => {
    const onSelect = vi.fn();
    const items = [{ id: '1', disabled: true }];
    const menu = createMenuList({ items, onSelect });
    const preventDefault = vi.fn();

    menu.handleItemKeyDown({ key: 'Enter', preventDefault } as any, items[0]);
    expect(preventDefault).not.toHaveBeenCalled();
    expect(onSelect).not.toHaveBeenCalled();
  });
});

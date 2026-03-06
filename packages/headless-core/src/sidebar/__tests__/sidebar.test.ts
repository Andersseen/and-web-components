import { describe, it, expect, vi } from 'vitest';
import { createSidebar } from '../sidebar';

describe('createSidebar', () => {
  const mockItems = [
    { id: 'home', label: 'Home', section: 'main' as const },
    { id: 'about', label: 'About', section: 'main' as const },
    { id: 'settings', label: 'Settings', section: 'bottom' as const },
    { id: 'disabled', label: 'Disabled', disabled: true },
  ];

  it('returns expected default state and methods', () => {
    const sidebar = createSidebar();
    expect(sidebar.state.activeItem).toBe('home');
    expect(sidebar.state.collapsed).toBe(false);
    expect(sidebar.state.mobileCollapsed).toBe(true);
    expect(sidebar.actions).toBeDefined();
    expect(sidebar.queries).toBeDefined();
  });

  it('can initialize with config', () => {
    const sidebar = createSidebar({
      items: mockItems,
      defaultActiveItem: 'about',
      defaultCollapsed: true,
      mobileCollapse: false,
    });
    expect(sidebar.state.activeItem).toBe('about');
    expect(sidebar.state.collapsed).toBe(true);
    expect(sidebar.state.mobileCollapsed).toBe(false);
  });

  it('can set active item', () => {
    const sidebar = createSidebar({ items: mockItems });
    sidebar.actions.setActiveItem('about');
    expect(sidebar.state.activeItem).toBe('about');
    expect(sidebar.queries.isActive('about')).toBe(true);
  });

  it('does not set active item if disabled', () => {
    const sidebar = createSidebar({ items: mockItems });
    sidebar.actions.setActiveItem('disabled');
    expect(sidebar.state.activeItem).toBe('home');
  });

  it('calls onActiveItemChange when active item changes', () => {
    const onActiveItemChange = vi.fn();
    const sidebar = createSidebar({ items: mockItems, onActiveItemChange });
    sidebar.actions.setActiveItem('about');
    expect(onActiveItemChange).toHaveBeenCalledWith('about');
  });

  it('can set and toggle collapsed state', () => {
    const sidebar = createSidebar();
    sidebar.actions.setCollapsed(true);
    expect(sidebar.state.collapsed).toBe(true);
    sidebar.actions.toggleCollapse();
    expect(sidebar.state.collapsed).toBe(false);
  });

  it('calls onCollapsedChange when collapsed state changes', () => {
    const onCollapsedChange = vi.fn();
    const sidebar = createSidebar({ onCollapsedChange });
    sidebar.actions.setCollapsed(true);
    expect(onCollapsedChange).toHaveBeenCalledWith(true);
  });

  it('can set mobile collapsed state', () => {
    const sidebar = createSidebar();
    sidebar.actions.setMobileCollapsed(false);
    expect(sidebar.state.mobileCollapsed).toBe(false);
  });

  it('can update items dynamically', () => {
    const sidebar = createSidebar();
    sidebar.actions.setItems(mockItems);
    expect(sidebar.queries.getItemIds()).toEqual(['home', 'about', 'settings', 'disabled']);
  });

  it('correctly queries sections', () => {
    const sidebar = createSidebar({ items: mockItems });
    const main = sidebar.queries.getMainItems();
    const bottom = sidebar.queries.getBottomItems();

    expect(main.length).toBe(3); // home, about, disabled (defaults to main if not specified, but we specified main for home/about and undefined for disabled which defaults to main via `?? 'main'`)
    expect(main.map(i => i.id)).toEqual(['home', 'about', 'disabled']);

    expect(bottom.length).toBe(1);
    expect(bottom[0].id).toBe('settings');
  });

  it('provides correct container props', () => {
    const sidebar = createSidebar({ ariaLabel: 'Nav Panel', defaultCollapsed: true });
    const props = sidebar.getContainerProps();
    expect(props.role).toBe('navigation');
    expect(props['aria-label']).toBe('Nav Panel');
    expect(props['data-collapsed']).toBe(true);
    expect(props['data-mobile-collapsed']).toBe(true);
  });

  it('provides correct nav list props', () => {
    const sidebar = createSidebar();
    const mainProps = sidebar.getNavListProps();
    expect(mainProps.role).toBe('menu');
    expect(mainProps['aria-label']).toBe('Main navigation');

    const bottomProps = sidebar.getNavListProps('bottom');
    expect(bottomProps['aria-label']).toBe('Secondary navigation');
  });

  it('provides correct item props', () => {
    const sidebar = createSidebar({ items: mockItems, defaultActiveItem: 'home' });

    const activeProps = sidebar.getItemProps('home');
    expect(activeProps.role).toBe('menuitem');
    expect(activeProps['aria-current']).toBe('page');
    expect(activeProps['aria-disabled']).toBeUndefined();
    expect(activeProps['data-active']).toBe(true);
    expect(activeProps['data-state']).toBe('active');
    expect(activeProps.tabindex).toBe(0);
    expect(activeProps.id).toBe('sidebar-item-home');

    const inactiveProps = sidebar.getItemProps('about');
    expect(inactiveProps['aria-current']).toBeUndefined();
    expect(inactiveProps['data-active']).toBe(false);
    expect(inactiveProps['data-state']).toBe('inactive');
    expect(inactiveProps.tabindex).toBe(-1);

    const disabledProps = sidebar.getItemProps('disabled');
    expect(disabledProps['aria-disabled']).toBe(true);
  });

  it('provides correct toggle props', () => {
    const sidebar = createSidebar();
    let props = sidebar.getToggleProps();
    expect(props.role).toBe('button');
    expect(props['aria-expanded']).toBe(true);
    expect(props['aria-label']).toBe('Collapse sidebar');
    expect(props['data-collapsed']).toBe(false);

    sidebar.actions.setCollapsed(true);
    props = sidebar.getToggleProps();
    expect(props['aria-expanded']).toBe(false);
    expect(props['aria-label']).toBe('Expand sidebar');
    expect(props['data-collapsed']).toBe(true);
  });

  it('handles keyboard navigation (ArrowDown, ArrowUp, Home, End)', () => {
    const sidebar = createSidebar({ items: mockItems });
    const preventDefault = vi.fn();

    // Initial: 'home' (index 0)

    // ArrowDown -> 'about' (index 1)
    sidebar.handleItemKeyDown({ key: 'ArrowDown', preventDefault } as any, 'home');
    expect(preventDefault).toHaveBeenCalled();
    expect(sidebar.state.activeItem).toBe('about');

    // ArrowDown from 'about' -> 'settings' (skips disabled)
    sidebar.handleItemKeyDown({ key: 'ArrowDown', preventDefault } as any, 'about');
    expect(sidebar.state.activeItem).toBe('settings');

    // ArrowDown from 'settings' -> loops to 'home'
    sidebar.handleItemKeyDown({ key: 'ArrowDown', preventDefault } as any, 'settings');
    expect(sidebar.state.activeItem).toBe('home');

    // ArrowUp from 'home' -> loops to 'settings'
    sidebar.handleItemKeyDown({ key: 'ArrowUp', preventDefault } as any, 'home');
    expect(sidebar.state.activeItem).toBe('settings');

    // Home -> 'home'
    sidebar.handleItemKeyDown({ key: 'Home', preventDefault } as any, 'settings');
    expect(sidebar.state.activeItem).toBe('home');

    // End -> 'settings'
    sidebar.handleItemKeyDown({ key: 'End', preventDefault } as any, 'home');
    expect(sidebar.state.activeItem).toBe('settings');
  });

  it('handles keyboard interactions (Enter, Space)', () => {
    const sidebar = createSidebar({ items: mockItems, defaultActiveItem: 'home' });
    const preventDefault = vi.fn();

    // Enter on 'about' sets it to active
    sidebar.handleItemKeyDown({ key: 'Enter', preventDefault } as any, 'about');
    expect(preventDefault).toHaveBeenCalled();
    expect(sidebar.state.activeItem).toBe('about');

    // Space on 'settings' sets it to active
    sidebar.handleItemKeyDown({ key: ' ', preventDefault } as any, 'settings');
    expect(sidebar.state.activeItem).toBe('settings');
  });
});

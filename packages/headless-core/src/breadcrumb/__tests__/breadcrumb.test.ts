import { describe, it, expect, vi } from 'vitest';
import { createBreadcrumb } from '../breadcrumb';

describe('createBreadcrumb', () => {
  it('returns expected default state and methods', () => {
    const breadcrumb = createBreadcrumb();
    expect(breadcrumb.state.items).toEqual([]);
    expect(breadcrumb.state.ariaLabel).toBe('Breadcrumb');
    expect(breadcrumb.actions).toBeDefined();
  });

  it('can explicitly set initial items', () => {
    const items = [
      { id: '1', label: 'Home', href: '/' },
      { id: '2', label: 'Current', current: true }
    ];
    const breadcrumb = createBreadcrumb({ items, ariaLabel: 'Nav' });
    expect(breadcrumb.state.items).toEqual(items);
    expect(breadcrumb.state.ariaLabel).toBe('Nav');
  });

  it('can set items', () => {
    const breadcrumb = createBreadcrumb();
    const items = [{ id: '1', label: 'Home', href: '/' }];
    breadcrumb.actions.setItems(items);
    expect(breadcrumb.state.items).toEqual(items);
  });

  it('can set current item', () => {
    const items = [
      { id: '1', label: 'Home', href: '/' },
      { id: '2', label: 'Current' }
    ];
    const breadcrumb = createBreadcrumb({ items });
    breadcrumb.actions.setCurrentItem('2');
    expect(breadcrumb.state.items[0].current).toBe(false);
    expect(breadcrumb.state.items[1].current).toBe(true);
  });

  it('provides correct nav and list props', () => {
    const breadcrumb = createBreadcrumb();
    const navProps = breadcrumb.getNavProps();
    expect(navProps.role).toBe('navigation');
    expect(navProps['aria-label']).toBe('Breadcrumb');

    const listProps = breadcrumb.getListProps();
    expect(listProps.role).toBe('list');
  });

  it('provides correct item and link props for current and non-current items', () => {
    const breadcrumb = createBreadcrumb();

    const currentItem = { id: '2', label: 'Current', current: true };
    const nonCurrentItem = { id: '1', label: 'Home', href: '/' };

    const currentItemProps = breadcrumb.getItemProps(currentItem);
    expect(currentItemProps['aria-current']).toBe('page');
    expect(currentItemProps['data-state']).toBe('active');

    const currentLinkProps = breadcrumb.getLinkProps(currentItem);
    expect(currentLinkProps['aria-current']).toBe('page');
    expect(currentLinkProps.href).toBeUndefined();
    expect(currentLinkProps.tabindex).toBeUndefined();

    const nonCurrentItemProps = breadcrumb.getItemProps(nonCurrentItem);
    expect(nonCurrentItemProps['aria-current']).toBeUndefined();
    expect(nonCurrentItemProps['data-state']).toBe('inactive');

    const nonCurrentLinkProps = breadcrumb.getLinkProps(nonCurrentItem);
    expect(nonCurrentLinkProps.href).toBe('/');
    expect(nonCurrentLinkProps['aria-current']).toBeUndefined();
    expect(nonCurrentLinkProps.tabindex).toBe(0);
  });

  it('handles keyboard interaction and triggers onNavigate for non-current item', () => {
    const onNavigate = vi.fn();
    const breadcrumb = createBreadcrumb({ onNavigate });
    const item = { id: '1', label: 'Home', href: '/' };
    const preventDefault = vi.fn();

    breadcrumb.handleKeyDown({ key: 'Enter', preventDefault } as any, item);
    expect(preventDefault).toHaveBeenCalled();
    expect(onNavigate).toHaveBeenCalledWith(item);

    breadcrumb.handleKeyDown({ key: ' ', preventDefault } as any, item);
    expect(preventDefault).toHaveBeenCalledTimes(2);
    expect(onNavigate).toHaveBeenCalledTimes(2);
  });

  it('ignores keyboard interaction for current item', () => {
    const onNavigate = vi.fn();
    const breadcrumb = createBreadcrumb({ onNavigate });
    const item = { id: '2', label: 'Current', current: true };
    const preventDefault = vi.fn();

    breadcrumb.handleKeyDown({ key: 'Enter', preventDefault } as any, item);
    expect(preventDefault).not.toHaveBeenCalled();
    expect(onNavigate).not.toHaveBeenCalled();
  });
});

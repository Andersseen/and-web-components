import { describe, it, expect, vi } from 'vitest';
import { createTabs } from '../tabs';

describe('createTabs', () => {
  it('returns expected default state and methods', () => {
    const tabs = createTabs();
    expect(tabs.state.selectedTab).toBe(null);
    expect(tabs.state.orientation).toBe('horizontal');
    expect(tabs.state.activationMode).toBe('automatic');
    expect(tabs.state.disabled).toBe(false);
    expect(tabs.actions).toBeDefined();
    expect(tabs.queries).toBeDefined();
  });

  it('can explicitly set initial config', () => {
    const tabs = createTabs({
      defaultValue: 'tab-1',
      orientation: 'vertical',
      activationMode: 'manual',
      disabled: true,
    });
    expect(tabs.state.selectedTab).toBe('tab-1');
    expect(tabs.state.orientation).toBe('vertical');
    expect(tabs.state.activationMode).toBe('manual');
    expect(tabs.state.disabled).toBe(true);
  });

  it('can select a tab', () => {
    const tabs = createTabs();
    tabs.actions.selectTab('tab-2');
    expect(tabs.state.selectedTab).toBe('tab-2');
    expect(tabs.queries.isSelected('tab-2')).toBe(true);
    expect(tabs.queries.getSelectedTab()).toBe('tab-2');
  });

  it('does nothing when disabled', () => {
    const tabs = createTabs({ disabled: true });
    tabs.actions.selectTab('tab-1');
    expect(tabs.state.selectedTab).toBe(null);
  });

  it('calls onValueChange callback', () => {
    const onValueChange = vi.fn();
    const tabs = createTabs({ onValueChange });
    tabs.actions.selectTab('tab-1');
    expect(onValueChange).toHaveBeenCalledWith('tab-1');
  });

  it('does not call onValueChange if already selected', () => {
    const onValueChange = vi.fn();
    const tabs = createTabs({ defaultValue: 'tab-1', onValueChange });
    tabs.actions.selectTab('tab-1');
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('can change disabled state', () => {
    const tabs = createTabs();
    tabs.actions.setDisabled(true);
    expect(tabs.state.disabled).toBe(true);
  });

  it('provides correct container props', () => {
    const tabs = createTabs({ orientation: 'vertical' });
    const props = tabs.getContainerProps();
    expect(props['data-orientation']).toBe('vertical');
  });

  it('provides correct tab list props', () => {
    const tabs = createTabs();
    const props = tabs.getTabListProps();
    expect(props.role).toBe('tablist');
    expect(props['aria-orientation']).toBe('horizontal');
  });

  it('provides correct tab trigger props', () => {
    const tabs = createTabs({ defaultValue: 'tab-1' });

    const selectedProps = tabs.getTabTriggerProps('tab-1');
    expect(selectedProps.role).toBe('tab');
    expect(selectedProps['aria-selected']).toBe(true);
    expect(selectedProps.tabindex).toBe(0);
    expect(selectedProps['data-state']).toBe('active');

    const unselectedProps = tabs.getTabTriggerProps('tab-2');
    expect(unselectedProps['aria-selected']).toBe(false);
    expect(unselectedProps.tabindex).toBe(-1);
    expect(unselectedProps['data-state']).toBe('inactive');
  });

  it('provides correct tab content props', () => {
    const tabs = createTabs({ defaultValue: 'tab-1' });

    const selectedProps = tabs.getTabContentProps('tab-1');
    expect(selectedProps.role).toBe('tabpanel');
    expect(selectedProps.tabindex).toBe(0);
    expect(selectedProps.hidden).toBe(false);
    expect(selectedProps['data-state']).toBe('active');

    const unselectedProps = tabs.getTabContentProps('tab-2');
    expect(unselectedProps.hidden).toBe(true);
    expect(unselectedProps['data-state']).toBe('inactive');
  });

  describe('keyboard navigation', () => {
    const tabIds = ['tab-1', 'tab-2', 'tab-3'];

    it('handles horizontal navigation (ArrowRight, ArrowLeft, Home, End)', () => {
      const tabs = createTabs({ orientation: 'horizontal', defaultValue: 'tab-1' });
      const preventDefault = vi.fn();

      // ArrowRight -> tab-2
      tabs.handleTabKeyDown({ key: 'ArrowRight', preventDefault } as any, 'tab-1', tabIds);
      expect(preventDefault).toHaveBeenCalled();
      expect(tabs.state.selectedTab).toBe('tab-2');

      // ArrowLeft from tab-2 -> tab-1
      tabs.handleTabKeyDown({ key: 'ArrowLeft', preventDefault } as any, 'tab-2', tabIds);
      expect(tabs.state.selectedTab).toBe('tab-1');

      // ArrowLeft from tab-1 -> loops to tab-3
      tabs.handleTabKeyDown({ key: 'ArrowLeft', preventDefault } as any, 'tab-1', tabIds);
      expect(tabs.state.selectedTab).toBe('tab-3');

      // ArrowRight from tab-3 -> loops to tab-1
      tabs.handleTabKeyDown({ key: 'ArrowRight', preventDefault } as any, 'tab-3', tabIds);
      expect(tabs.state.selectedTab).toBe('tab-1');

      // End -> tab-3
      tabs.handleTabKeyDown({ key: 'End', preventDefault } as any, 'tab-1', tabIds);
      expect(tabs.state.selectedTab).toBe('tab-3');

      // Home -> tab-1
      tabs.handleTabKeyDown({ key: 'Home', preventDefault } as any, 'tab-3', tabIds);
      expect(tabs.state.selectedTab).toBe('tab-1');
    });

    it('handles vertical navigation (ArrowDown, ArrowUp)', () => {
      const tabs = createTabs({ orientation: 'vertical', defaultValue: 'tab-1' });
      const preventDefault = vi.fn();

      // ArrowDown -> tab-2
      tabs.handleTabKeyDown({ key: 'ArrowDown', preventDefault } as any, 'tab-1', tabIds);
      expect(preventDefault).toHaveBeenCalled();
      expect(tabs.state.selectedTab).toBe('tab-2');

      // ArrowUp from tab-2 -> tab-1
      tabs.handleTabKeyDown({ key: 'ArrowUp', preventDefault } as any, 'tab-2', tabIds);
      expect(tabs.state.selectedTab).toBe('tab-1');
    });

    it('does not auto-select in manual mode', () => {
      const tabs = createTabs({ activationMode: 'manual', defaultValue: 'tab-1' });
      const preventDefault = vi.fn();

      tabs.handleTabKeyDown({ key: 'ArrowRight', preventDefault } as any, 'tab-1', tabIds);
      expect(preventDefault).toHaveBeenCalled();
      expect(tabs.state.selectedTab).toBe('tab-1'); // Stays on tab-1
    });

    it('ignores navigation when disabled', () => {
      const tabs = createTabs({ disabled: true, defaultValue: 'tab-1' });
      const preventDefault = vi.fn();

      tabs.handleTabKeyDown({ key: 'ArrowRight', preventDefault } as any, 'tab-1', tabIds);
      expect(preventDefault).not.toHaveBeenCalled();
      expect(tabs.state.selectedTab).toBe('tab-1');
    });

    it('ignores navigation for unknown tab', () => {
      const tabs = createTabs({ defaultValue: 'tab-1' });
      const preventDefault = vi.fn();

      tabs.handleTabKeyDown({ key: 'ArrowRight', preventDefault } as any, 'unknown-tab', tabIds);
      expect(preventDefault).not.toHaveBeenCalled();
    });
  });
});

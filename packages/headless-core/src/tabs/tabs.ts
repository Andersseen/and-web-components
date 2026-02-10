/**
 * Headless Tabs Component
 *
 * Provides state management and accessibility for tab components.
 * Implements ARIA tabs pattern with keyboard navigation.
 */

import type {
  AriaAttributes,
  DataAttributes,
  EventCallback,
} from "../types/common";
import { createIdGenerator } from "../utils/id";
import { Keys } from "../types/common";

/**
 * Configuration options for creating tabs
 */
export interface TabsConfig {
  /**
   * Initially selected tab
   */
  defaultValue?: string;

  /**
   * Callback when selected tab changes
   */
  onValueChange?: EventCallback<string>;

  /**
   * Orientation of the tabs
   * @default 'horizontal'
   */
  orientation?: "horizontal" | "vertical";

  /**
   * Whether to activate tab on focus (automatic) or require selection (manual)
   * @default 'automatic'
   */
  activationMode?: "automatic" | "manual";

  /**
   * Whether the tabs are disabled
   * @default false
   */
  disabled?: boolean;
}

/**
 * Tabs state
 */
export interface TabsState {
  selectedTab: string | null;
  orientation: "horizontal" | "vertical";
  activationMode: "automatic" | "manual";
  disabled: boolean;
}

/**
 * Props for tabs container
 */
export interface TabsContainerProps extends DataAttributes {
  "data-orientation": "horizontal" | "vertical";
}

/**
 * Props for tab list element
 */
export interface TabListProps extends AriaAttributes, DataAttributes {
  role: "tablist";
  "aria-orientation": "horizontal" | "vertical";
}

/**
 * Props for individual tab trigger
 */
export interface TabTriggerProps extends AriaAttributes, DataAttributes {
  role: "tab";
  "aria-selected": boolean;
  "aria-controls": string;
  "aria-disabled": boolean;
  tabindex: number;
  id: string;
}

/**
 * Props for tab content panel
 */
export interface TabContentProps extends AriaAttributes, DataAttributes {
  role: "tabpanel";
  "aria-labelledby": string;
  tabindex: number;
  id: string;
  hidden: boolean;
}

/**
 * Return type of createTabs
 */
export interface TabsReturn {
  /**
   * Current state
   */
  state: Readonly<TabsState>;

  /**
   * Actions
   */
  actions: {
    selectTab: (tabId: string) => void;
    setDisabled: (disabled: boolean) => void;
  };

  /**
   * Queries
   */
  queries: {
    isSelected: (tabId: string) => boolean;
    getSelectedTab: () => string | null;
  };

  /**
   * Get props for different elements
   */
  getContainerProps: () => TabsContainerProps;
  getTabListProps: () => TabListProps;
  getTabTriggerProps: (tabId: string) => TabTriggerProps;
  getTabContentProps: (tabId: string) => TabContentProps;

  /**
   * Keyboard navigation handler
   */
  handleTabKeyDown: (
    event: KeyboardEvent,
    tabId: string,
    allTabIds: string[],
  ) => void;
}

/**
 * Create a headless tabs component
 *
 * @example
 * ```ts
 * const tabs = createTabs({
 *   defaultValue: 'tab-1',
 *   orientation: 'horizontal',
 *   onValueChange: (tabId) => console.log('Selected:', tabId)
 * });
 *
 * // Select a tab
 * tabs.actions.selectTab('tab-2');
 *
 * // Check if tab is selected
 * tabs.queries.isSelected('tab-2'); // true
 *
 * // Get props
 * const listProps = tabs.getTabListProps();
 * const triggerProps = tabs.getTabTriggerProps('tab-1');
 * const contentProps = tabs.getTabContentProps('tab-1');
 * ```
 */
export function createTabs(config: TabsConfig = {}): TabsReturn {
  const generateId = createIdGenerator("tabs");

  // Internal state
  let state: TabsState = {
    selectedTab: config.defaultValue ?? null,
    orientation: config.orientation ?? "horizontal",
    activationMode: config.activationMode ?? "automatic",
    disabled: config.disabled ?? false,
  };

  // Actions
  const selectTab = (tabId: string): void => {
    if (state.disabled || state.selectedTab === tabId) return;

    state = { ...state, selectedTab: tabId };
    config.onValueChange?.(tabId);
  };

  const setDisabled = (disabled: boolean): void => {
    state = { ...state, disabled };
  };

  // Queries
  const isSelected = (tabId: string): boolean => {
    return state.selectedTab === tabId;
  };

  const getSelectedTab = (): string | null => {
    return state.selectedTab;
  };

  // Get element props
  const getContainerProps = (): TabsContainerProps => ({
    "data-orientation": state.orientation,
  });

  const getTabListProps = (): TabListProps => ({
    role: "tablist",
    "aria-orientation": state.orientation,
  });

  const getTabTriggerProps = (tabId: string): TabTriggerProps => {
    const selected = isSelected(tabId);
    const triggerId = generateId(`trigger-${tabId}`);
    const contentId = generateId(`content-${tabId}`);

    return {
      role: "tab",
      "aria-selected": selected,
      "aria-controls": contentId,
      "aria-disabled": state.disabled,
      tabindex: selected ? 0 : -1,
      id: triggerId,
      "data-state": selected ? "active" : "inactive",
      "data-disabled": state.disabled,
      "data-orientation": state.orientation,
    };
  };

  const getTabContentProps = (tabId: string): TabContentProps => {
    const selected = isSelected(tabId);
    const triggerId = generateId(`trigger-${tabId}`);
    const contentId = generateId(`content-${tabId}`);

    return {
      role: "tabpanel",
      "aria-labelledby": triggerId,
      tabindex: 0,
      id: contentId,
      hidden: !selected,
      "data-state": selected ? "active" : "inactive",
    };
  };

  // Keyboard navigation
  const handleTabKeyDown = (
    event: KeyboardEvent,
    currentTabId: string,
    allTabIds: string[],
  ): void => {
    if (state.disabled) return;

    const currentIndex = allTabIds.indexOf(currentTabId);
    if (currentIndex === -1) return;

    let nextIndex: number | null = null;

    const isHorizontal = state.orientation === "horizontal";

    switch (event.key) {
      case isHorizontal ? Keys.ArrowRight : Keys.ArrowDown:
        event.preventDefault();
        nextIndex = (currentIndex + 1) % allTabIds.length;
        break;

      case isHorizontal ? Keys.ArrowLeft : Keys.ArrowUp:
        event.preventDefault();
        nextIndex =
          currentIndex === 0 ? allTabIds.length - 1 : currentIndex - 1;
        break;

      case Keys.Home:
        event.preventDefault();
        nextIndex = 0;
        break;

      case Keys.End:
        event.preventDefault();
        nextIndex = allTabIds.length - 1;
        break;

      default:
        break;
    }

    if (nextIndex !== null && allTabIds[nextIndex]) {
      const nextTabId = allTabIds[nextIndex];

      // In automatic mode, select on focus
      if (state.activationMode === "automatic") {
        selectTab(nextTabId);
      }

      // Note: Actual DOM focus management would happen in the framework layer
      // The consuming component should handle focusing the appropriate element
    }
  };

  return {
    get state() {
      return Object.freeze({ ...state });
    },
    actions: {
      selectTab,
      setDisabled,
    },
    queries: {
      isSelected,
      getSelectedTab,
    },
    getContainerProps,
    getTabListProps,
    getTabTriggerProps,
    getTabContentProps,
    handleTabKeyDown,
  };
}

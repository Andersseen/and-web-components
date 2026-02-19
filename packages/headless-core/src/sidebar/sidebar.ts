/**
 * Headless Sidebar Component
 *
 * Provides state management and accessibility for side navigation.
 * Supports active item tracking and collapsible state.
 */

import type {
  AriaAttributes,
  DataAttributes,
  EventCallback,
} from "../types/common";

/**
 * Configuration options for creating a sidebar
 */
export interface SidebarConfig {
  /**
   * ID of the initially active item
   * @default 'home'
   */
  defaultActiveItem?: string;

  /**
   * Callback when active item changes
   */
  onActiveItemChange?: EventCallback<string>;

  /**
   * Whether the sidebar is initially collapsed
   * @default false
   */
  defaultCollapsed?: boolean;

  /**
   * Callback when collapsed state changes
   */
  onCollapsedChange?: EventCallback<boolean>;
}

/**
 * Sidebar state
 */
export interface SidebarState {
  activeItem: string;
  collapsed: boolean;
}

/**
 * Props for sidebar container element
 */
export interface SidebarContainerProps extends DataAttributes {
  role: "navigation";
  "data-collapsed": boolean;
}

/**
 * Props for navigation item element (button/link)
 */
export interface SidebarItemProps extends AriaAttributes, DataAttributes {
  role: "button" | "link";
  "aria-current"?: "page" | "step" | "location";
  "data-active"?: boolean;
  "data-collapsed"?: boolean;
  tabindex: number;
}

/**
 * Props for collapse toggle button
 */
export interface SidebarToggleProps extends AriaAttributes, DataAttributes {
  "aria-expanded": boolean;
  "aria-label": string;
  "data-collapsed"?: boolean;
  role: "button";
  tabindex: number;
}

/**
 * Return type of createSidebar
 */
export interface SidebarReturn {
  /**
   * Current state
   */
  state: Readonly<SidebarState>;

  /**
   * Actions to manipulate sidebar state
   */
  actions: {
    setActiveItem: (itemId: string) => void;
    toggleCollapse: () => void;
    setCollapsed: (collapsed: boolean) => void;
  };

  /**
   * Query methods
   */
  queries: {
    isActive: (itemId: string) => boolean;
    isCollapsed: () => boolean;
  };

  /**
   * Get props for different elements
   */
  getContainerProps: () => SidebarContainerProps;
  getItemProps: (itemId: string) => SidebarItemProps;
  getToggleProps: () => SidebarToggleProps;
}

/**
 * Create a headless sidebar component
 */
export function createSidebar(config: SidebarConfig = {}): SidebarReturn {
  // Internal state
  let state: SidebarState = {
    activeItem: config.defaultActiveItem ?? "home",
    collapsed: config.defaultCollapsed ?? false,
  };

  // Notify of changes
  const notifyActiveItemChange = (): void => {
    config.onActiveItemChange?.(state.activeItem);
  };

  const notifyCollapsedChange = (): void => {
    config.onCollapsedChange?.(state.collapsed);
  };

  // Actions
  const setActiveItem = (itemId: string): void => {
    if (state.activeItem === itemId) return;

    state = { ...state, activeItem: itemId };
    notifyActiveItemChange();
  };

  const setCollapsed = (collapsed: boolean): void => {
    if (state.collapsed === collapsed) return;

    state = { ...state, collapsed };
    notifyCollapsedChange();
  };

  const toggleCollapse = (): void => {
    setCollapsed(!state.collapsed);
  };

  // Queries
  const isActive = (itemId: string): boolean => {
    return state.activeItem === itemId;
  };

  const isCollapsed = (): boolean => {
    return state.collapsed;
  };

  // Get element props
  const getContainerProps = (): SidebarContainerProps => ({
    role: "navigation",
    "data-collapsed": state.collapsed,
  });

  const getItemProps = (itemId: string): SidebarItemProps => {
    const active = isActive(itemId);
    return {
      role: "button",
      "aria-current": active ? "page" : undefined,
      "data-active": active,
      "data-collapsed": state.collapsed,
      tabindex: 0,
    };
  };

  const getToggleProps = (): SidebarToggleProps => ({
    "aria-expanded": !state.collapsed,
    "aria-label": state.collapsed ? "Expand sidebar" : "Collapse sidebar",
    role: "button",
    tabindex: 0,
    "data-collapsed": state.collapsed,
  });

  return {
    get state() {
      return Object.freeze({ ...state });
    },
    actions: {
      setActiveItem,
      toggleCollapse,
      setCollapsed,
    },
    queries: {
      isActive,
      isCollapsed,
    },
    getContainerProps,
    getItemProps,
    getToggleProps,
  };
}

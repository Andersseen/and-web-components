/**
 * Headless Sidebar Component
 *
 * Provides state management, keyboard navigation, and accessibility
 * for side navigation panels. Implements the WAI-ARIA navigation pattern.
 *
 * Features:
 * - Active item tracking with visual state (`data-state`, `aria-current`)
 * - Keyboard navigation (Arrow Up/Down, Home, End)
 * - Collapsible state with toggle
 * - Mobile auto-collapse support
 * - Configurable item groups (main + bottom section)
 *
 * @example
 * ```ts
 * const sidebar = createSidebar({
 *   items: [
 *     { id: 'home', label: 'Home', icon: 'home' },
 *     { id: 'settings', label: 'Settings', icon: 'settings', section: 'bottom' },
 *   ],
 *   defaultActiveItem: 'home',
 *   onActiveItemChange: (id) => console.log('Active:', id),
 * });
 * ```
 */

import type {
  AriaAttributes,
  DataAttributes,
  EventCallback,
} from "../types/common";
import { Keys } from "../types/common";

// ─── Item Definition ────────────────────────────────────────────────

/**
 * A sidebar item definition.
 */
export interface SidebarItemDef {
  /** Unique identifier */
  id: string;
  /** Display label */
  label: string;
  /** Optional icon name */
  icon?: string;
  /** Whether the item is disabled */
  disabled?: boolean;
  /** Section: 'main' (default) or 'bottom' */
  section?: "main" | "bottom";
}

/**
 * Configuration options for creating a sidebar
 */
export interface SidebarConfig {
  /**
   * Registered sidebar items.
   * Enables keyboard navigation and active tracking.
   */
  items?: SidebarItemDef[];

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

  /**
   * Whether mobile auto-collapse is enabled.
   * When true, the sidebar will be collapsed on mobile viewports.
   * @default true
   */
  mobileCollapse?: boolean;

  /**
   * ARIA label for the sidebar navigation
   * @default 'Sidebar navigation'
   */
  ariaLabel?: string;
}

/**
 * Sidebar state
 */
export interface SidebarState {
  activeItem: string;
  collapsed: boolean;
  /** Whether the sidebar is in mobile-collapsed mode */
  mobileCollapsed: boolean;
}

/**
 * Props for sidebar container element
 */
export interface SidebarContainerProps extends DataAttributes {
  role: "navigation";
  "aria-label": string;
  "data-collapsed": boolean;
  "data-mobile-collapsed": boolean;
}

/**
 * Props for navigation item element (button/link)
 */
export interface SidebarItemProps extends AriaAttributes, DataAttributes {
  role: "menuitem";
  "aria-current"?: "page" | undefined;
  "aria-disabled"?: boolean;
  "data-active": boolean;
  "data-state": "active" | "inactive";
  "data-collapsed": boolean;
  tabindex: number;
  id: string;
}

/**
 * Props for the navigation list wrapper
 */
export interface SidebarNavListProps extends AriaAttributes, DataAttributes {
  role: "menu";
  "aria-label": string;
}

/**
 * Props for collapse toggle button
 */
export interface SidebarToggleProps extends AriaAttributes, DataAttributes {
  "aria-expanded": boolean;
  "aria-label": string;
  "data-collapsed": boolean;
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
    setMobileCollapsed: (collapsed: boolean) => void;
    /** Re-register items (if the item list changes dynamically) */
    setItems: (items: SidebarItemDef[]) => void;
  };

  /**
   * Query methods
   */
  queries: {
    isActive: (itemId: string) => boolean;
    isCollapsed: () => boolean;
    isMobileCollapsed: () => boolean;
    isDisabled: (itemId: string) => boolean;
    /** Get items for the main section */
    getMainItems: () => SidebarItemDef[];
    /** Get items for the bottom section */
    getBottomItems: () => SidebarItemDef[];
    /** Get all registered item IDs */
    getItemIds: () => string[];
  };

  /**
   * Get props for different elements
   */
  getContainerProps: () => SidebarContainerProps;
  getNavListProps: (section?: "main" | "bottom") => SidebarNavListProps;
  getItemProps: (itemId: string) => SidebarItemProps;
  getToggleProps: () => SidebarToggleProps;

  /**
   * Keyboard navigation handler — attach to each nav item's `keydown`.
   * Handles Up/Down arrows, Home, End.
   */
  handleItemKeyDown: (event: KeyboardEvent, currentItemId: string) => void;
}

/**
 * Create a headless sidebar component
 */
export function createSidebar(config: SidebarConfig = {}): SidebarReturn {
  // Build item lookup
  let items: SidebarItemDef[] = config.items ?? [];
  let itemMap = new Map<string, SidebarItemDef>(
    items.map((i) => [i.id, i]),
  );
  let itemIds: string[] = items.map((i) => i.id);

  // Internal state
  let state: SidebarState = {
    activeItem: config.defaultActiveItem ?? "home",
    collapsed: config.defaultCollapsed ?? false,
    mobileCollapsed: config.mobileCollapse !== false,
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
    const item = itemMap.get(itemId);
    if (item?.disabled) return;

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

  const setMobileCollapsed = (collapsed: boolean): void => {
    state = { ...state, mobileCollapsed: collapsed };
  };

  const setItems = (newItems: SidebarItemDef[]): void => {
    items = newItems;
    itemMap = new Map(items.map((i) => [i.id, i]));
    itemIds = items.map((i) => i.id);
  };

  // Queries
  const isActive = (itemId: string): boolean => {
    return state.activeItem === itemId;
  };

  const isCollapsed = (): boolean => {
    return state.collapsed;
  };

  const isMobileCollapsed = (): boolean => {
    return state.mobileCollapsed;
  };

  const isDisabled = (itemId: string): boolean => {
    return itemMap.get(itemId)?.disabled === true;
  };

  const getMainItems = (): SidebarItemDef[] => {
    return items.filter((i) => (i.section ?? "main") === "main");
  };

  const getBottomItems = (): SidebarItemDef[] => {
    return items.filter((i) => i.section === "bottom");
  };

  const getItemIds = (): string[] => [...itemIds];

  // ── Keyboard Navigation ─────────────────────────────────────────

  const getEnabledIds = (): string[] =>
    itemIds.filter((id) => !itemMap.get(id)?.disabled);

  const handleItemKeyDown = (
    event: KeyboardEvent,
    currentItemId: string,
  ): void => {
    const enabledIds = getEnabledIds();
    const currentIndex = enabledIds.indexOf(currentItemId);
    if (currentIndex === -1) return;

    let nextIndex: number | null = null;

    switch (event.key) {
      case Keys.ArrowDown:
        event.preventDefault();
        nextIndex = (currentIndex + 1) % enabledIds.length;
        break;

      case Keys.ArrowUp:
        event.preventDefault();
        nextIndex =
          currentIndex === 0 ? enabledIds.length - 1 : currentIndex - 1;
        break;

      case Keys.Home:
        event.preventDefault();
        nextIndex = 0;
        break;

      case Keys.End:
        event.preventDefault();
        nextIndex = enabledIds.length - 1;
        break;

      case Keys.Enter:
      case Keys.Space:
        event.preventDefault();
        setActiveItem(currentItemId);
        return;

      default:
        return;
    }

    if (nextIndex !== null && enabledIds[nextIndex]) {
      setActiveItem(enabledIds[nextIndex]);
    }
  };

  // Get element props
  const getContainerProps = (): SidebarContainerProps => ({
    role: "navigation",
    "aria-label": config.ariaLabel ?? "Sidebar navigation",
    "data-collapsed": state.collapsed,
    "data-mobile-collapsed": state.mobileCollapsed,
  });

  const getNavListProps = (
    section: "main" | "bottom" = "main",
  ): SidebarNavListProps => ({
    role: "menu",
    "aria-label":
      section === "bottom" ? "Secondary navigation" : "Main navigation",
  });

  const getItemProps = (itemId: string): SidebarItemProps => {
    const active = isActive(itemId);
    const disabled = isDisabled(itemId);
    return {
      role: "menuitem",
      "aria-current": active ? "page" : undefined,
      "aria-disabled": disabled || undefined,
      "data-active": active,
      "data-state": active ? "active" : "inactive",
      "data-collapsed": state.collapsed,
      tabindex: active ? 0 : -1,
      id: `sidebar-item-${itemId}`,
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
      setMobileCollapsed,
      setItems,
    },
    queries: {
      isActive,
      isCollapsed,
      isMobileCollapsed,
      isDisabled,
      getMainItems,
      getBottomItems,
      getItemIds,
    },
    getContainerProps,
    getNavListProps,
    getItemProps,
    getToggleProps,
    handleItemKeyDown,
  };
}

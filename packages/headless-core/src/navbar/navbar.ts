/**
 * Headless Navbar Component
 *
 * Provides state management, keyboard navigation, and accessibility
 * for navigation bars. Implements the WAI-ARIA navigation pattern.
 *
 * Features:
 * - Active item tracking with visual state (`data-state`, `aria-current`)
 * - Keyboard navigation (Arrow keys, Home, End)
 * - Mobile menu toggle with ARIA
 * - Scroll-spy helper for hash-based navigation
 * - URL/hash-based active item detection
 * - Position-aware (sticky/fixed) state
 *
 * @example
 * ```ts
 * const navbar = createNavbar({
 *   items: [
 *     { id: 'home', label: 'Home', href: '#hero' },
 *     { id: 'features', label: 'Features', href: '#features' },
 *   ],
 *   defaultActiveItem: 'home',
 *   onActiveItemChange: (id) => console.log('Active:', id),
 * });
 *
 * // Get props for elements
 * const navProps = navbar.getContainerProps();
 * const listProps = navbar.getNavListProps();
 * const itemProps = navbar.getItemProps('home');
 *
 * // Keyboard navigation
 * element.addEventListener('keydown', (e) => navbar.handleItemKeyDown(e, 'home'));
 *
 * // Scroll-spy (call in scroll handler)
 * navbar.actions.updateActiveFromScroll();
 * ```
 */

import type {
  AriaAttributes,
  DataAttributes,
  EventCallback,
} from "../types/common";
import { Keys } from "../types/common";
import { createIdGenerator } from "../utils/id";

// ─── Item Definition ────────────────────────────────────────────────

/**
 * A navigation item definition.
 * Used both by headless core and consuming components.
 */
export interface NavbarItem {
  /** Unique identifier */
  id: string;
  /** Display label */
  label: string;
  /** Optional href — makes the item a link */
  href?: string;
  /** Optional link target (`_blank`, etc.) */
  target?: string;
  /** Optional icon name (consumed by rendering layer) */
  icon?: string;
  /** Whether the item is disabled */
  disabled?: boolean;
}

// ─── Configuration ──────────────────────────────────────────────────

/**
 * Configuration options for creating a navbar
 */
export interface NavbarConfig {
  /**
   * Registered navigation items.
   * Enables keyboard navigation, scroll-spy, and active tracking.
   */
  items?: NavbarItem[];

  /**
   * ID of the initially active item.
   * @default first item id, or 'home'
   */
  defaultActiveItem?: string;

  /**
   * Callback when active item changes
   */
  onActiveItemChange?: EventCallback<string>;

  /**
   * Whether the mobile menu is initially open
   * @default false
   */
  mobileMenuOpen?: boolean;

  /**
   * Callback when mobile menu open state changes
   */
  onMobileMenuChange?: EventCallback<boolean>;

  /**
   * Enable scroll-spy: automatically update active item
   * based on which section is currently visible.
   * Items must have `href` starting with `#`.
   * @default false
   */
  scrollSpy?: boolean;

  /**
   * Offset in pixels from the top of the viewport
   * used by scroll-spy to determine active section.
   * @default 100
   */
  scrollSpyOffset?: number;

  /**
   * ARIA label for the navigation landmark
   * @default 'Main navigation'
   */
  ariaLabel?: string;
}

// ─── State ──────────────────────────────────────────────────────────

/**
 * Navbar state
 */
export interface NavbarState {
  /** Currently active item ID */
  activeItem: string;
  /** Whether the mobile menu is open */
  mobileMenuOpen: boolean;
  /** Registered item IDs (in order) */
  itemIds: string[];
}

// ─── Element Props ──────────────────────────────────────────────────

/**
 * Props for the `<nav>` container element
 */
export interface NavbarContainerProps extends DataAttributes {
  role: "navigation";
  "aria-label": string;
}

/**
 * Props for the navigation item list (`<ul>` or `<div>` wrapper)
 */
export interface NavbarNavListProps extends AriaAttributes, DataAttributes {
  role: "menubar";
  "aria-label": string;
}

/**
 * Props for a single navigation item element (button or link)
 */
export interface NavbarItemProps extends AriaAttributes, DataAttributes {
  role: "menuitem";
  "aria-current"?: "page" | undefined;
  "aria-disabled"?: boolean;
  "data-active": boolean;
  "data-state": "active" | "inactive";
  tabindex: number;
  id: string;
  href?: string;
  target?: string;
}

/**
 * Props for mobile menu toggle button
 */
export interface NavbarToggleProps extends AriaAttributes, DataAttributes {
  "aria-expanded": boolean;
  "aria-label": string;
  "aria-controls": string;
  role: "button";
  tabindex: number;
}

/**
 * Props for the mobile menu panel
 */
export interface NavbarMobileMenuProps extends DataAttributes {
  id: string;
  role: "menu";
  "aria-label": string;
  "data-state": "open" | "closed";
  hidden: boolean;
}

// ─── Return Type ────────────────────────────────────────────────────

/**
 * Return type of `createNavbar`
 */
export interface NavbarReturn {
  /**
   * Current reactive state
   */
  state: Readonly<NavbarState>;

  /**
   * Actions to manipulate navbar state
   */
  actions: {
    /** Set the active navigation item */
    setActiveItem: (itemId: string) => void;
    /** Toggle the mobile menu */
    toggleMobileMenu: () => void;
    /** Open or close the mobile menu */
    setMobileMenuOpen: (open: boolean) => void;
    /** Close the mobile menu */
    closeMobileMenu: () => void;
    /** Re-register items (if the item list changes dynamically) */
    setItems: (items: NavbarItem[]) => void;
    /**
     * Detect which section is in view and update active item.
     * Call this from a scroll event listener.
     */
    updateActiveFromScroll: () => void;
    /**
     * Detect active item from the current URL hash.
     * Useful on initial load or `hashchange` event.
     */
    updateActiveFromHash: () => void;
  };

  /**
   * Query methods
   */
  queries: {
    /** Check if an item is active */
    isActive: (itemId: string) => boolean;
    /** Get the active item ID */
    getActiveItem: () => string;
    /** Check if an item is disabled */
    isDisabled: (itemId: string) => boolean;
    /** Get all registered item IDs */
    getItemIds: () => string[];
  };

  /**
   * Get props for different elements
   */
  getContainerProps: () => NavbarContainerProps;
  getNavListProps: () => NavbarNavListProps;
  getItemProps: (
    itemId: string,
    options?: { href?: string; target?: string },
  ) => NavbarItemProps;
  getToggleProps: () => NavbarToggleProps;
  getMobileMenuProps: () => NavbarMobileMenuProps;

  /**
   * Keyboard navigation handler — attach to each nav item's `keydown`.
   * Handles Left/Right arrows, Home, End.
   */
  handleItemKeyDown: (event: KeyboardEvent, currentItemId: string) => void;
}

// ─── Factory ────────────────────────────────────────────────────────

/**
 * Create a headless navbar component
 */
export function createNavbar(config: NavbarConfig = {}): NavbarReturn {
  const generateId = createIdGenerator("navbar");
  const menuId = generateId("mobile-menu");

  // Build item lookup
  let items: NavbarItem[] = config.items ?? [];
  let itemMap = new Map<string, NavbarItem>(items.map((i) => [i.id, i]));
  let itemIds: string[] = items.map((i) => i.id);

  // Resolve default active item
  const resolveDefault = (): string =>
    config.defaultActiveItem ?? itemIds[0] ?? "home";

  // Internal state
  let state: NavbarState = {
    activeItem: resolveDefault(),
    mobileMenuOpen: config.mobileMenuOpen ?? false,
    itemIds: [...itemIds],
  };

  // ── Notifications ───────────────────────────────────────────────

  const notifyActiveItemChange = (): void => {
    config.onActiveItemChange?.(state.activeItem);
  };

  const notifyMobileMenuChange = (): void => {
    config.onMobileMenuChange?.(state.mobileMenuOpen);
  };

  // ── Actions ─────────────────────────────────────────────────────

  const setActiveItem = (itemId: string): void => {
    if (state.activeItem === itemId) return;
    const item = itemMap.get(itemId);
    if (item?.disabled) return;

    state = { ...state, activeItem: itemId };
    notifyActiveItemChange();
  };

  const setMobileMenuOpen = (open: boolean): void => {
    if (state.mobileMenuOpen === open) return;
    state = { ...state, mobileMenuOpen: open };
    notifyMobileMenuChange();
  };

  const toggleMobileMenu = (): void => {
    setMobileMenuOpen(!state.mobileMenuOpen);
  };

  const closeMobileMenu = (): void => {
    setMobileMenuOpen(false);
  };

  const setItems = (newItems: NavbarItem[]): void => {
    items = newItems;
    itemMap = new Map(items.map((i) => [i.id, i]));
    itemIds = items.map((i) => i.id);
    state = { ...state, itemIds: [...itemIds] };
  };

  /**
   * Scroll-spy: iterate href targets and find the one whose section
   * is closest to (but above) the scroll-spy offset line.
   */
  const updateActiveFromScroll = (): void => {
    if (typeof document === "undefined") return;

    const offset = config.scrollSpyOffset ?? 100;
    let bestId: string | null = null;
    let bestTop = -Infinity;

    for (const item of items) {
      if (!item.href?.startsWith("#")) continue;
      const el = document.querySelector(item.href);
      if (!el) continue;

      const rect = el.getBoundingClientRect();
      // Section top relative to viewport — consider "in view" when it
      // has scrolled past the offset line (rect.top <= offset)
      if (rect.top <= offset && rect.top > bestTop) {
        bestTop = rect.top;
        bestId = item.id;
      }
    }

    if (bestId && bestId !== state.activeItem) {
      setActiveItem(bestId);
    }
  };

  /**
   * Detect active item from current URL hash.
   */
  const updateActiveFromHash = (): void => {
    if (typeof window === "undefined") return;
    const hash = window.location.hash;
    if (!hash) return;

    const match = items.find((i) => i.href === hash);
    if (match) {
      setActiveItem(match.id);
    }
  };

  // ── Queries ─────────────────────────────────────────────────────

  const isActive = (itemId: string): boolean => {
    return state.activeItem === itemId;
  };

  const getActiveItem = (): string => state.activeItem;

  const isDisabled = (itemId: string): boolean => {
    return itemMap.get(itemId)?.disabled === true;
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
      case Keys.ArrowRight:
        event.preventDefault();
        nextIndex = (currentIndex + 1) % enabledIds.length;
        break;

      case Keys.ArrowLeft:
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
        closeMobileMenu();
        return;

      case Keys.Escape:
        event.preventDefault();
        closeMobileMenu();
        return;

      default:
        return;
    }

    if (nextIndex !== null && enabledIds[nextIndex]) {
      setActiveItem(enabledIds[nextIndex]);
      // Note: Actual DOM focus is handled by the consuming component.
      // The component should listen to state.activeItem changes and
      // call `.focus()` on the corresponding element.
    }
  };

  // ── Get Element Props ───────────────────────────────────────────

  const getContainerProps = (): NavbarContainerProps => ({
    role: "navigation",
    "aria-label": config.ariaLabel ?? "Main navigation",
  });

  const getNavListProps = (): NavbarNavListProps => ({
    role: "menubar",
    "aria-label": config.ariaLabel ?? "Main navigation",
  });

  const getItemProps = (
    itemId: string,
    options?: { href?: string; target?: string },
  ): NavbarItemProps => {
    const active = isActive(itemId);
    const disabled = isDisabled(itemId);
    const itemEl = generateId(`item-${itemId}`);

    return {
      role: "menuitem",
      "aria-current": active ? "page" : undefined,
      "aria-disabled": disabled || undefined,
      "data-active": active,
      "data-state": active ? "active" : "inactive",
      tabindex: active ? 0 : -1,
      id: itemEl,
      ...(options?.href && { href: options.href }),
      ...(options?.target && { target: options.target }),
    };
  };

  const getToggleProps = (): NavbarToggleProps => ({
    "aria-expanded": state.mobileMenuOpen,
    "aria-label": state.mobileMenuOpen
      ? "Close navigation menu"
      : "Open navigation menu",
    "aria-controls": menuId,
    role: "button",
    tabindex: 0,
    "data-state": state.mobileMenuOpen ? "open" : "closed",
  });

  const getMobileMenuProps = (): NavbarMobileMenuProps => ({
    id: menuId,
    role: "menu",
    "aria-label": "Navigation menu",
    "data-state": state.mobileMenuOpen ? "open" : "closed",
    hidden: !state.mobileMenuOpen,
  });

  // ── Return ──────────────────────────────────────────────────────

  return {
    get state() {
      return Object.freeze({ ...state });
    },
    actions: {
      setActiveItem,
      toggleMobileMenu,
      setMobileMenuOpen,
      closeMobileMenu,
      setItems,
      updateActiveFromScroll,
      updateActiveFromHash,
    },
    queries: {
      isActive,
      getActiveItem,
      isDisabled,
      getItemIds,
    },
    getContainerProps,
    getNavListProps,
    getItemProps,
    getToggleProps,
    getMobileMenuProps,
    handleItemKeyDown,
  };
}

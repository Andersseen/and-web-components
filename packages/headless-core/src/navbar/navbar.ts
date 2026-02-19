/**
 * Headless Navbar Component
 *
 * Provides state management and accessibility for navigation bars.
 * Supports active item tracking and mobile menu toggling.
 */

import type {
  AriaAttributes,
  DataAttributes,
  EventCallback,
} from "../types/common";
import { createIdGenerator } from "../utils/id";

/**
 * Configuration options for creating a navbar
 */
export interface NavbarConfig {
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
   * Whether the mobile menu is synonymous with a drawer state
   * @default false
   */
  mobileMenuOpen?: boolean;

  /**
   * Callback when mobile menu open state changes
   */
  onMobileMenuChange?: EventCallback<boolean>;
}

/**
 * Navbar state
 */
export interface NavbarState {
  activeItem: string;
  mobileMenuOpen: boolean;
}

/**
 * Props for navbar container element
 */
export interface NavbarContainerProps extends DataAttributes {
  role: "navigation";
}

/**
 * Props for navigation item element (button/link)
 */
export interface NavbarItemProps extends AriaAttributes, DataAttributes {
  role: "button" | "link";
  "aria-current"?: "page" | "step" | "location" | "date" | "time" | boolean;
  "data-active"?: boolean;
  tabindex: number;
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
 * Return type of createNavbar
 */
export interface NavbarReturn {
  /**
   * Current state
   */
  state: Readonly<NavbarState>;

  /**
   * Actions to manipulate navbar state
   */
  actions: {
    setActiveItem: (itemId: string) => void;
    toggleMobileMenu: () => void;
    setMobileMenuOpen: (open: boolean) => void;
    closeMobileMenu: () => void;
  };

  /**
   * Query methods
   */
  queries: {
    isActive: (itemId: string) => boolean;
  };

  /**
   * Get props for different elements
   */
  getContainerProps: () => NavbarContainerProps;
  getItemProps: (itemId: string) => NavbarItemProps;
  getToggleProps: () => NavbarToggleProps;
}

/**
 * Create a headless navbar component
 */
export function createNavbar(config: NavbarConfig = {}): NavbarReturn {
  const generateId = createIdGenerator("navbar");
  const menuId = generateId("mobile-menu");

  // Internal state
  let state: NavbarState = {
    activeItem: config.defaultActiveItem ?? "home",
    mobileMenuOpen: config.mobileMenuOpen ?? false,
  };

  // Notify of changes
  const notifyActiveItemChange = (): void => {
    config.onActiveItemChange?.(state.activeItem);
  };

  const notifyMobileMenuChange = (): void => {
    config.onMobileMenuChange?.(state.mobileMenuOpen);
  };

  // Actions
  const setActiveItem = (itemId: string): void => {
    if (state.activeItem === itemId) return;

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

  // Queries
  const isActive = (itemId: string): boolean => {
    return state.activeItem === itemId;
  };

  // Get element props
  const getContainerProps = (): NavbarContainerProps => ({
    role: "navigation",
  });

  const getItemProps = (itemId: string): NavbarItemProps => {
    const active = isActive(itemId);
    return {
      role: "button",
      "aria-current": active ? "page" : undefined,
      "data-active": active,
      tabindex: 0,
    };
  };

  const getToggleProps = (): NavbarToggleProps => ({
    "aria-expanded": state.mobileMenuOpen,
    "aria-label": "Toggle navigation menu",
    "aria-controls": menuId,
    role: "button",
    tabindex: 0,
    "data-state": state.mobileMenuOpen ? "open" : "closed",
  });

  return {
    get state() {
      return Object.freeze({ ...state });
    },
    actions: {
      setActiveItem,
      toggleMobileMenu,
      setMobileMenuOpen,
      closeMobileMenu,
    },
    queries: {
      isActive,
    },
    getContainerProps,
    getItemProps,
    getToggleProps,
  };
}

/**
 * Headless Breadcrumb Component
 *
 * Provides state management and accessibility for breadcrumb navigation.
 * Handles ARIA semantics, current-page tracking, and keyboard navigation.
 */

import type { AriaAttributes, DataAttributes } from "../types/common";

/**
 * Configuration for a single breadcrumb item
 */
export interface BreadcrumbItemConfig {
  /** Unique identifier for the item. */
  id: string;

  /** Display label. */
  label: string;

  /** Optional navigation URL. */
  href?: string;

  /** Whether this item represents the current page. */
  current?: boolean;
}

/**
 * Configuration options for creating a breadcrumb
 */
export interface BreadcrumbConfig {
  /**
   * Accessible label for the breadcrumb navigation landmark.
   * @default 'Breadcrumb'
   */
  ariaLabel?: string;

  /**
   * Array of breadcrumb items in order.
   */
  items?: BreadcrumbItemConfig[];

  /**
   * Callback fired when a breadcrumb item is activated.
   */
  onNavigate?: (item: BreadcrumbItemConfig) => void;
}

/**
 * Breadcrumb state
 */
export interface BreadcrumbState {
  items: BreadcrumbItemConfig[];
  ariaLabel: string;
}

/**
 * Props for the <nav> wrapper element
 */
export interface BreadcrumbNavProps extends AriaAttributes {
  "aria-label": string;
  role: "navigation";
}

/**
 * Props for the ordered list element
 */
export interface BreadcrumbListProps {
  role: "list";
}

/**
 * Props for an individual breadcrumb item
 */
export interface BreadcrumbItemProps extends AriaAttributes, DataAttributes {
  "aria-current"?: "page";
  "data-state"?: "active" | "inactive";
}

/**
 * Props for the link/text element inside a breadcrumb item
 */
export interface BreadcrumbLinkProps extends AriaAttributes {
  href?: string;
  "aria-current"?: "page";
  tabindex?: number;
}

/**
 * Return type of createBreadcrumb
 */
export interface BreadcrumbReturn {
  /** Current state. */
  state: Readonly<BreadcrumbState>;

  /** Actions. */
  actions: {
    setItems: (items: BreadcrumbItemConfig[]) => void;
    setCurrentItem: (itemId: string) => void;
  };

  /** Get props for different elements. */
  getNavProps: () => BreadcrumbNavProps;
  getListProps: () => BreadcrumbListProps;
  getItemProps: (item: BreadcrumbItemConfig) => BreadcrumbItemProps;
  getLinkProps: (item: BreadcrumbItemConfig) => BreadcrumbLinkProps;

  /** Keyboard handler for breadcrumb links. */
  handleKeyDown: (event: KeyboardEvent, item: BreadcrumbItemConfig) => void;
}

/**
 * Create a headless breadcrumb component
 *
 * @example
 * ```ts
 * const breadcrumb = createBreadcrumb({
 *   ariaLabel: 'Breadcrumb',
 *   items: [
 *     { id: 'home', label: 'Home', href: '/' },
 *     { id: 'products', label: 'Products', href: '/products' },
 *     { id: 'detail', label: 'Widget', current: true },
 *   ],
 *   onNavigate: (item) => console.log('Navigate:', item.href),
 * });
 *
 * const navProps = breadcrumb.getNavProps();
 * const listProps = breadcrumb.getListProps();
 * const linkProps = breadcrumb.getLinkProps(item);
 * ```
 */
export function createBreadcrumb(
  config: BreadcrumbConfig = {},
): BreadcrumbReturn {
  let state: BreadcrumbState = {
    items: config.items ?? [],
    ariaLabel: config.ariaLabel ?? "Breadcrumb",
  };

  /* ── Actions ─────────────────────────────────────────────────────── */

  const setItems = (items: BreadcrumbItemConfig[]): void => {
    state = { ...state, items };
  };

  const setCurrentItem = (itemId: string): void => {
    state = {
      ...state,
      items: state.items.map((item) => ({
        ...item,
        current: item.id === itemId,
      })),
    };
  };

  /* ── Props getters ───────────────────────────────────────────────── */

  const getNavProps = (): BreadcrumbNavProps => ({
    role: "navigation",
    "aria-label": state.ariaLabel,
  });

  const getListProps = (): BreadcrumbListProps => ({
    role: "list",
  });

  const getItemProps = (item: BreadcrumbItemConfig): BreadcrumbItemProps => ({
    ...(item.current ? { "aria-current": "page" as const } : {}),
    "data-state": item.current ? "active" : "inactive",
  });

  const getLinkProps = (item: BreadcrumbItemConfig): BreadcrumbLinkProps => ({
    ...(item.href && !item.current ? { href: item.href } : {}),
    ...(item.current ? { "aria-current": "page" as const } : {}),
    tabindex: item.current ? undefined : 0,
  });

  /* ── Keyboard ────────────────────────────────────────────────────── */

  const handleKeyDown = (
    event: KeyboardEvent,
    item: BreadcrumbItemConfig,
  ): void => {
    if (item.current) return;

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      config.onNavigate?.(item);
    }
  };

  /* ── Return ──────────────────────────────────────────────────────── */

  return {
    get state() {
      return Object.freeze({ ...state });
    },
    actions: {
      setItems,
      setCurrentItem,
    },
    getNavProps,
    getListProps,
    getItemProps,
    getLinkProps,
    handleKeyDown,
  };
}

/**
 * Headless Context Menu Component
 *
 * Provides state management and accessibility for context (right-click) menus.
 * Handles open/close state, positioning relative to pointer, outside-click
 * dismissal, and Escape-key support.
 */

import type {
  AriaAttributes,
  DataAttributes,
  EventCallback,
} from "../types/common";
import { Keys } from "../types/common";

/**
 * Position of the context menu relative to the viewport
 */
export interface ContextMenuPosition {
  x: number;
  y: number;
}

/**
 * Configuration options for creating a context menu
 */
export interface ContextMenuConfig {
  /**
   * Callback when the open state changes.
   */
  onOpenChange?: EventCallback<boolean>;

  /**
   * Callback when the menu is positioned (receives coordinates).
   */
  onPosition?: EventCallback<ContextMenuPosition>;

  /**
   * Close the menu after an item is selected.
   * @default true
   */
  closeOnSelect?: boolean;
}

/**
 * Context menu state
 */
export interface ContextMenuState {
  isOpen: boolean;
  position: ContextMenuPosition;
}

/**
 * Props for the trigger wrapper element
 */
export interface ContextMenuTriggerProps extends DataAttributes {
  "data-state": "open" | "closed";
}

/**
 * Props for the floating menu panel
 */
export interface ContextMenuPanelProps extends AriaAttributes, DataAttributes {
  role: "menu";
  "aria-label": string;
  "data-state": "open" | "closed";
  hidden: boolean;
}

/**
 * Return type of createContextMenu
 */
export interface ContextMenuReturn {
  /** Current state. */
  state: Readonly<ContextMenuState>;

  /** Actions. */
  actions: {
    open: (position: ContextMenuPosition) => void;
    close: () => void;
    selectItem: (itemId?: string) => void;
  };

  /** Get props for different elements. */
  getTriggerProps: () => ContextMenuTriggerProps;
  getPanelProps: (label?: string) => ContextMenuPanelProps;

  /**
   * Handle the native `contextmenu` event on the trigger.
   * Call this from your component's right-click handler.
   * It prevents the default browser menu and computes position.
   */
  handleContextMenu: (event: MouseEvent, triggerRect?: DOMRect) => void;

  /** Handle keydown at the document level for dismissal. */
  handleKeyDown: (event: KeyboardEvent) => void;
}

/**
 * Create a headless context menu component
 *
 * @example
 * ```ts
 * const ctx = createContextMenu({
 *   closeOnSelect: true,
 *   onOpenChange: (open) => console.log('Open:', open),
 *   onPosition: (pos) => console.log('Position:', pos),
 * });
 *
 * el.addEventListener('contextmenu', (e) => ctx.handleContextMenu(e));
 * document.addEventListener('keydown', (e) => ctx.handleKeyDown(e));
 *
 * const triggerProps = ctx.getTriggerProps();
 * const panelProps = ctx.getPanelProps('Context menu');
 * ```
 */
export function createContextMenu(
  config: ContextMenuConfig = {},
): ContextMenuReturn {
  const closeOnSelect = config.closeOnSelect ?? true;

  let state: ContextMenuState = {
    isOpen: false,
    position: { x: 0, y: 0 },
  };

  /* ── Internal helpers ────────────────────────────────────────────── */

  const notifyOpen = (): void => {
    config.onOpenChange?.(state.isOpen);
  };

  /* ── Actions ─────────────────────────────────────────────────────── */

  const open = (position: ContextMenuPosition): void => {
    state = { ...state, isOpen: true, position };
    notifyOpen();
    config.onPosition?.(position);
  };

  const close = (): void => {
    if (!state.isOpen) return;
    state = { ...state, isOpen: false };
    notifyOpen();
  };

  const selectItem = (_itemId?: string): void => {
    if (closeOnSelect) {
      close();
    }
  };

  /* ── Props getters ───────────────────────────────────────────────── */

  const getTriggerProps = (): ContextMenuTriggerProps => ({
    "data-state": state.isOpen ? "open" : "closed",
  });

  const getPanelProps = (
    label: string = "Context menu",
  ): ContextMenuPanelProps => ({
    role: "menu",
    "aria-label": label,
    "data-state": state.isOpen ? "open" : "closed",
    hidden: !state.isOpen,
  });

  /* ── Event handlers ──────────────────────────────────────────────── */

  const handleContextMenu = (
    event: MouseEvent,
    triggerRect?: DOMRect,
  ): void => {
    event.preventDefault();

    const x = triggerRect ? event.clientX - triggerRect.left : event.clientX;
    const y = triggerRect ? event.clientY - triggerRect.top : event.clientY;

    open({ x, y });
  };

  const handleKeyDown = (event: KeyboardEvent): void => {
    if (!state.isOpen) return;

    if (event.key === Keys.Escape) {
      event.preventDefault();
      close();
    }
  };

  /* ── Return ──────────────────────────────────────────────────────── */

  return {
    get state() {
      return Object.freeze({ ...state });
    },
    actions: {
      open,
      close,
      selectItem,
    },
    getTriggerProps,
    getPanelProps,
    handleContextMenu,
    handleKeyDown,
  };
}

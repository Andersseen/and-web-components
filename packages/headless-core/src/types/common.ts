/**
 * Common types used across all headless components
 */

/**
 * Generic event emitter callback
 */
export type EventCallback<T = void> = (value: T) => void;

/**
 * Cleanup function returned by setup methods
 */
export type CleanupFn = () => void;

/**
 * Common ARIA attributes
 */
export interface AriaAttributes {
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
  "aria-hidden"?: boolean;
  "aria-disabled"?: boolean;
  "aria-expanded"?: boolean;
  "aria-selected"?: boolean;
  "aria-controls"?: string;
  "aria-haspopup"?:
    | boolean
    | "true"
    | "false"
    | "menu"
    | "listbox"
    | "tree"
    | "grid"
    | "dialog";
  role?: string;
}

/**
 * Common data attributes for state
 */
export interface DataAttributes {
  "data-state"?:
    | "open"
    | "closed"
    | "active"
    | "inactive"
    | "selected"
    | "unselected";
  "data-disabled"?: boolean;
  "data-orientation"?: "horizontal" | "vertical";
}

/**
 * Keyboard event keys
 */
export const Keys = {
  Enter: "Enter",
  Space: " ",
  Escape: "Escape",
  ArrowUp: "ArrowUp",
  ArrowDown: "ArrowDown",
  ArrowLeft: "ArrowLeft",
  ArrowRight: "ArrowRight",
  Home: "Home",
  End: "End",
  Tab: "Tab",
} as const;

export type KeyboardKey = (typeof Keys)[keyof typeof Keys];

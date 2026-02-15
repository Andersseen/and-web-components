/**
 * Headless Tooltip Component
 *
 * Provides state management and accessibility for tooltip components.
 * Handles show/hide with configurable delays, placement, and
 * hover/focus trigger support.
 */

import type {
  AriaAttributes,
  DataAttributes,
  EventCallback,
} from "../types/common";
import { generateId } from "../utils/id";

/**
 * Tooltip placement options
 */
export type TooltipPlacement = "top" | "bottom" | "left" | "right";

/**
 * Configuration options for creating a tooltip
 */
export interface TooltipConfig {
  /**
   * Placement of the tooltip relative to the trigger
   * @default 'top'
   */
  placement?: TooltipPlacement;

  /**
   * Delay before showing the tooltip (ms)
   * @default 0
   */
  openDelay?: number;

  /**
   * Delay before hiding the tooltip (ms)
   * @default 0
   */
  closeDelay?: number;

  /**
   * Callback when visibility changes
   */
  onVisibilityChange?: EventCallback<boolean>;

  /**
   * Whether the tooltip is disabled
   * @default false
   */
  disabled?: boolean;
}

/**
 * Tooltip state
 */
export interface TooltipState {
  isVisible: boolean;
  placement: TooltipPlacement;
  disabled: boolean;
}

/**
 * Props for the trigger element
 */
export interface TooltipTriggerProps extends AriaAttributes {
  "aria-describedby": string;
}

/**
 * Props for the tooltip content element
 */
export interface TooltipContentProps extends AriaAttributes, DataAttributes {
  role: "tooltip";
  id: string;
  "aria-hidden": boolean;
  "data-state": "open" | "closed";
  "data-side": TooltipPlacement;
  hidden: boolean;
}

/**
 * Return type of createTooltip
 */
export interface TooltipReturn {
  /**
   * Current state
   */
  state: Readonly<TooltipState>;

  /**
   * Actions
   */
  actions: {
    show: () => void;
    hide: () => void;
    setPlacement: (placement: TooltipPlacement) => void;
    setDisabled: (disabled: boolean) => void;
  };

  /**
   * Get props for different elements
   */
  getTriggerProps: () => TooltipTriggerProps;
  getTooltipProps: () => TooltipContentProps;

  /**
   * Event handlers for trigger element
   */
  handleMouseEnter: () => void;
  handleMouseLeave: () => void;
  handleFocusIn: () => void;
  handleFocusOut: () => void;

  /**
   * Cleanup function to clear all pending timers
   */
  destroy: () => void;
}

/**
 * Create a headless tooltip component
 *
 * @example
 * ```ts
 * const tooltip = createTooltip({
 *   placement: 'top',
 *   openDelay: 200,
 *   closeDelay: 100,
 *   onVisibilityChange: (visible) => console.log('Tooltip:', visible)
 * });
 *
 * // Attach to trigger element
 * trigger.addEventListener('mouseenter', tooltip.handleMouseEnter);
 * trigger.addEventListener('mouseleave', tooltip.handleMouseLeave);
 * trigger.addEventListener('focusin', tooltip.handleFocusIn);
 * trigger.addEventListener('focusout', tooltip.handleFocusOut);
 *
 * // Get props
 * const triggerProps = tooltip.getTriggerProps();
 * const tooltipProps = tooltip.getTooltipProps();
 *
 * // Cleanup
 * tooltip.destroy();
 * ```
 */
export function createTooltip(config: TooltipConfig = {}): TooltipReturn {
  const openDelay = config.openDelay ?? 0;
  const closeDelay = config.closeDelay ?? 0;
  const tooltipId = generateId("tooltip");

  // Internal state
  let state: TooltipState = {
    isVisible: false,
    placement: config.placement ?? "top",
    disabled: config.disabled ?? false,
  };

  let timeout: ReturnType<typeof setTimeout> | null = null;

  const clearTimer = (): void => {
    if (timeout !== null) {
      clearTimeout(timeout);
      timeout = null;
    }
  };

  const notifyChange = (): void => {
    config.onVisibilityChange?.(state.isVisible);
  };

  // Actions
  const show = (): void => {
    if (state.disabled) return;

    clearTimer();
    timeout = setTimeout(() => {
      state = { ...state, isVisible: true };
      notifyChange();
    }, openDelay);
  };

  const hide = (): void => {
    clearTimer();
    timeout = setTimeout(() => {
      state = { ...state, isVisible: false };
      notifyChange();
    }, closeDelay);
  };

  const setPlacement = (placement: TooltipPlacement): void => {
    state = { ...state, placement };
  };

  const setDisabled = (disabled: boolean): void => {
    state = { ...state, disabled };
    if (disabled && state.isVisible) {
      clearTimer();
      state = { ...state, isVisible: false };
      notifyChange();
    }
  };

  // Get element props
  const getTriggerProps = (): TooltipTriggerProps => ({
    "aria-describedby": state.isVisible ? tooltipId : "",
  });

  const getTooltipProps = (): TooltipContentProps => ({
    role: "tooltip",
    id: tooltipId,
    "aria-hidden": !state.isVisible,
    "data-state": state.isVisible ? "open" : "closed",
    "data-side": state.placement,
    hidden: !state.isVisible,
  });

  // Event handlers
  const handleMouseEnter = (): void => show();
  const handleMouseLeave = (): void => hide();
  const handleFocusIn = (): void => show();
  const handleFocusOut = (): void => hide();

  // Cleanup
  const destroy = (): void => {
    clearTimer();
  };

  return {
    get state() {
      return Object.freeze({ ...state });
    },
    actions: {
      show,
      hide,
      setPlacement,
      setDisabled,
    },
    getTriggerProps,
    getTooltipProps,
    handleMouseEnter,
    handleMouseLeave,
    handleFocusIn,
    handleFocusOut,
    destroy,
  };
}

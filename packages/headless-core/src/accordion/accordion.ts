/**
 * Headless Accordion Component
 *
 * Provides state management and accessibility for accordion/collapsible components.
 * Supports single and multi-select modes with full keyboard navigation.
 */

import type {
  AriaAttributes,
  DataAttributes,
  EventCallback,
} from "../types/common";
import { createIdGenerator } from "../utils/id";
import { Keys } from "../types/common";

/**
 * Configuration options for creating an accordion
 */
export interface AccordionConfig {
  /**
   * Allow multiple items to be expanded simultaneously
   * @default false
   */
  allowMultiple?: boolean;

  /**
   * Items expanded by default
   * @default []
   */
  defaultValue?: string[];

  /**
   * Callback when expanded items change
   */
  onValueChange?: EventCallback<string[]>;

  /**
   * Orientation of the accordion
   * @default 'vertical'
   */
  orientation?: "horizontal" | "vertical";

  /**
   * Whether the accordion is disabled
   * @default false
   */
  disabled?: boolean;
}

/**
 * Accordion state
 */
export interface AccordionState {
  expandedItems: Set<string>;
  orientation: "horizontal" | "vertical";
  disabled: boolean;
}

/**
 * Props for accordion container element
 */
export interface AccordionContainerProps extends DataAttributes {
  "data-orientation": "horizontal" | "vertical";
}

/**
 * Props for accordion item trigger/button element
 */
export interface AccordionTriggerProps extends AriaAttributes, DataAttributes {
  "aria-expanded": boolean;
  "aria-controls": string;
  "aria-disabled": boolean;
  role: "button";
  tabindex: number;
}

/**
 * Props for accordion item content/panel element
 */
export interface AccordionContentProps extends AriaAttributes, DataAttributes {
  role: "region";
  id: string;
  "aria-hidden": boolean;
  hidden: boolean;
}

/**
 * Return type of createAccordion
 */
export interface AccordionReturn {
  /**
   * Current state
   */
  state: Readonly<AccordionState>;

  /**
   * Actions to manipulate accordion state
   */
  actions: {
    toggle: (itemId: string) => void;
    expand: (itemId: string) => void;
    collapse: (itemId: string) => void;
    expandAll: () => void;
    collapseAll: () => void;
    setDisabled: (disabled: boolean) => void;
  };

  /**
   * Query methods
   */
  queries: {
    isExpanded: (itemId: string) => boolean;
    getExpandedItems: () => string[];
  };

  /**
   * Get props for different elements
   */
  getContainerProps: () => AccordionContainerProps;
  getTriggerProps: (itemId: string) => AccordionTriggerProps;
  getContentProps: (itemId: string) => AccordionContentProps;

  /**
   * Keyboard event handler for trigger elements
   */
  handleTriggerKeyDown: (event: KeyboardEvent, itemId: string) => void;
}

/**
 * Create a headless accordion component
 *
 * @example
 * ```ts
 * const accordion = createAccordion({
 *   allowMultiple: true,
 *   defaultValue: ['item-1'],
 *   onValueChange: (items) => console.log('Expanded:', items)
 * });
 *
 * // Check if item is expanded
 * accordion.queries.isExpanded('item-1'); // true
 *
 * // Toggle an item
 * accordion.actions.toggle('item-2');
 *
 * // Get props for elements
 * const containerProps = accordion.getContainerProps();
 * const triggerProps = accordion.getTriggerProps('item-1');
 * const contentProps = accordion.getContentProps('item-1');
 * ```
 */
export function createAccordion(config: AccordionConfig = {}): AccordionReturn {
  const generateId = createIdGenerator("accordion");

  // Internal state
  let state: AccordionState = {
    expandedItems: new Set(config.defaultValue || []),
    orientation: config.orientation ?? "vertical",
    disabled: config.disabled ?? false,
  };

  const allowMultiple = config.allowMultiple ?? false;

  // Notify of changes
  const notifyChange = (): void => {
    config.onValueChange?.(Array.from(state.expandedItems));
  };

  // Actions
  const toggle = (itemId: string): void => {
    if (state.disabled) return;

    const newExpanded = new Set(state.expandedItems);

    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      if (!allowMultiple) {
        newExpanded.clear();
      }
      newExpanded.add(itemId);
    }

    state = { ...state, expandedItems: newExpanded };
    notifyChange();
  };

  const expand = (itemId: string): void => {
    if (state.disabled || state.expandedItems.has(itemId)) return;

    const newExpanded = allowMultiple
      ? new Set([...state.expandedItems, itemId])
      : new Set([itemId]);

    state = { ...state, expandedItems: newExpanded };
    notifyChange();
  };

  const collapse = (itemId: string): void => {
    if (state.disabled || !state.expandedItems.has(itemId)) return;

    const newExpanded = new Set(state.expandedItems);
    newExpanded.delete(itemId);

    state = { ...state, expandedItems: newExpanded };
    notifyChange();
  };

  const expandAll = (): void => {
    if (state.disabled || !allowMultiple) return;
    // Note: This requires knowing all item IDs, so it's a placeholder
    // In real usage, you'd pass available items
  };

  const collapseAll = (): void => {
    if (state.disabled || state.expandedItems.size === 0) return;

    state = { ...state, expandedItems: new Set() };
    notifyChange();
  };

  const setDisabled = (disabled: boolean): void => {
    state = { ...state, disabled };
  };

  // Queries
  const isExpanded = (itemId: string): boolean => {
    return state.expandedItems.has(itemId);
  };

  const getExpandedItems = (): string[] => {
    return Array.from(state.expandedItems);
  };

  // Get element props
  const getContainerProps = (): AccordionContainerProps => ({
    "data-orientation": state.orientation,
  });

  const getTriggerProps = (itemId: string): AccordionTriggerProps => {
    const expanded = isExpanded(itemId);
    const contentId = generateId(`content-${itemId}`);

    return {
      "aria-expanded": expanded,
      "aria-controls": contentId,
      "aria-disabled": state.disabled,
      role: "button",
      tabindex: state.disabled ? -1 : 0,
      "data-state": expanded ? "open" : "closed",
      "data-disabled": state.disabled,
    };
  };

  const getContentProps = (itemId: string): AccordionContentProps => {
    const expanded = isExpanded(itemId);
    const contentId = generateId(`content-${itemId}`);

    return {
      role: "region",
      id: contentId,
      "aria-hidden": !expanded,
      hidden: !expanded,
      "data-state": expanded ? "open" : "closed",
    };
  };

  // Keyboard navigation
  const handleTriggerKeyDown = (event: KeyboardEvent, itemId: string): void => {
    if (state.disabled) return;

    switch (event.key) {
      case Keys.Enter:
      case Keys.Space:
        event.preventDefault();
        toggle(itemId);
        break;

      case Keys.Home:
        event.preventDefault();
        // Focus first trigger (implementation depends on DOM access)
        break;

      case Keys.End:
        event.preventDefault();
        // Focus last trigger (implementation depends on DOM access)
        break;

      default:
        break;
    }
  };

  return {
    get state() {
      return Object.freeze({
        expandedItems: new Set(state.expandedItems),
        orientation: state.orientation,
        disabled: state.disabled,
      });
    },
    actions: {
      toggle,
      expand,
      collapse,
      expandAll,
      collapseAll,
      setDisabled,
    },
    queries: {
      isExpanded,
      getExpandedItems,
    },
    getContainerProps,
    getTriggerProps,
    getContentProps,
    handleTriggerKeyDown,
  };
}

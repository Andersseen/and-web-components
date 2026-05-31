/**
 * Headless Select Component
 *
 * Provides state management and accessibility for single-select dropdowns.
 * Handles open/close, keyboard navigation, typeahead, and disabled-option skipping.
 */

import { createStore } from '../utils/store';
import type { EventCallback } from '../types/common';
import { Keys } from '../types/common';

export interface SelectOption {
  value: string;
  text: string;
  disabled?: boolean;
}

export interface SelectConfig {
  options?: SelectOption[];
  defaultValue?: string;
  disabled?: boolean;
  onValueChange?: EventCallback<string>;
  onOpenChange?: EventCallback<boolean>;
}

export interface SelectState {
  isOpen: boolean;
  highlightedIndex: number;
  selectedValue: string | null;
  disabled: boolean;
}

export interface SelectTriggerProps {
  'aria-haspopup': 'listbox';
  'aria-expanded': 'true' | 'false';
  'aria-disabled': 'true' | 'false';
  'data-state': 'open' | 'closed';
}

export interface SelectMenuProps {
  'role': 'listbox';
  'aria-label': string;
  'data-state': 'open' | 'closed';
  'hidden': boolean;
}

export interface SelectItemProps {
  'role': 'option';
  'aria-selected': 'true' | 'false';
  'aria-disabled': 'true' | 'false';
  'data-state': 'active' | 'inactive' | 'highlighted';
  'tabindex': number;
}

export interface SelectReturn {
  state: Readonly<SelectState>;
  subscribe: (callback: (state: Readonly<SelectState>) => void) => () => void;
  actions: {
    open: () => void;
    close: () => void;
    toggle: () => void;
    highlightNext: () => void;
    highlightPrev: () => void;
    highlightFirst: () => void;
    highlightLast: () => void;
    selectHighlighted: () => void;
    selectValue: (value: string) => void;
    setDisabled: (disabled: boolean) => void;
    setOptions: (options: SelectOption[]) => void;
  };
  queries: {
    isOpen: () => boolean;
    getSelectedText: () => string | undefined;
    getHighlightedOption: () => SelectOption | undefined;
    getOptions: () => SelectOption[];
  };
  getTriggerProps: () => SelectTriggerProps;
  getMenuProps: () => SelectMenuProps;
  getItemProps: (option: SelectOption, index: number) => SelectItemProps;
  handleTriggerKeyDown: (event: KeyboardEvent) => void;
  handleMenuKeyDown: (event: KeyboardEvent) => void;
}

export function createSelect(config: SelectConfig = {}): SelectReturn {
  let options = config.options ?? [];

  const findIndex = (value: string | null) => {
    if (value === null) return -1;
    return options.findIndex(o => o.value === value);
  };

  const findSelectedIndex = () => findIndex(config.defaultValue ?? null);

  const store = createStore<SelectState>({
    isOpen: false,
    highlightedIndex: findSelectedIndex(),
    selectedValue: config.defaultValue ?? null,
    disabled: config.disabled ?? false,
  });

  /* ── Typeahead ─────────────────────────────────────────────────── */

  let searchQuery = '';
  let searchTimer: ReturnType<typeof setTimeout> | undefined;

  const clearSearchTimer = () => {
    if (searchTimer) {
      clearTimeout(searchTimer);
      searchTimer = undefined;
    }
  };

  const resetSearch = () => {
    clearSearchTimer();
    searchQuery = '';
  };

  const isPrintableKey = (key: string): boolean =>
    key.length === 1 && !key.startsWith('Arrow') && !key.startsWith('Escape') && key !== 'Tab' && key !== 'Enter';

  const handleTypeahead = (key: string) => {
    searchQuery += key.toLowerCase();
    clearSearchTimer();
    searchTimer = setTimeout(() => {
      searchQuery = '';
    }, 500);

    const start = store.state.highlightedIndex >= 0 ? store.state.highlightedIndex + 1 : 0;
    const len = options.length;

    // Search from current highlight + 1
    for (let i = 0; i < len; i++) {
      const idx = (start + i) % len;
      const option = options[idx];
      if (option.disabled) continue;
      if (option.text.toLowerCase().startsWith(searchQuery)) {
        store.setState({ highlightedIndex: idx });
        return;
      }
    }

    // If no match from cursor, search from beginning
    for (let i = 0; i < len; i++) {
      const option = options[i];
      if (option.disabled) continue;
      if (option.text.toLowerCase().startsWith(searchQuery)) {
        store.setState({ highlightedIndex: i });
        return;
      }
    }
  };

  /* ── Highlight navigation (skips disabled, wraps) ─────────────── */

  const highlightTo = (startIndex: number, direction: 1 | -1) => {
    if (options.length === 0) {
      store.setState({ highlightedIndex: -1 });
      return;
    }

    let index = startIndex;
    const len = options.length;

    for (let i = 0; i < len; i++) {
      if (index >= len) index = 0;
      if (index < 0) index = len - 1;

      if (!options[index].disabled) {
        store.setState({ highlightedIndex: index });
        return;
      }
      index += direction;
    }

    store.setState({ highlightedIndex: -1 });
  };

  const highlightNext = () => {
    if (options.length === 0) return;
    const start = store.state.highlightedIndex >= 0 ? store.state.highlightedIndex : -1;
    highlightTo(start + 1, 1);
  };

  const highlightPrev = () => {
    if (options.length === 0) return;
    const start = store.state.highlightedIndex >= 0 ? store.state.highlightedIndex : options.length;
    highlightTo(start - 1, -1);
  };

  const highlightFirst = () => highlightTo(0, 1);
  const highlightLast = () => highlightTo(options.length - 1, -1);

  /* ── Selection ─────────────────────────────────────────────────── */

  const selectIndex = (index: number) => {
    const option = options[index];
    if (!option || option.disabled) return;
    if (store.state.selectedValue === option.value) return;
    store.setState({ selectedValue: option.value, highlightedIndex: index });
    config.onValueChange?.(option.value);
  };

  const selectHighlighted = () => {
    const option = options[store.state.highlightedIndex];
    if (option && !option.disabled && store.state.selectedValue !== option.value) {
      store.setState({ selectedValue: option.value });
      config.onValueChange?.(option.value);
    }
    close();
  };

  const selectValue = (value: string) => {
    const idx = findIndex(value);
    if (idx >= 0) selectIndex(idx);
  };

  /* ── Open / Close ──────────────────────────────────────────────── */

  const notifyOpen = () => config.onOpenChange?.(store.state.isOpen);

  const open = () => {
    if (store.state.disabled || store.state.isOpen) return;
    const idx = findIndex(store.state.selectedValue);
    const nextIndex = idx >= 0 ? idx : options.findIndex(o => !o.disabled);
    store.setState({ isOpen: true, highlightedIndex: nextIndex >= 0 ? nextIndex : -1 });
    notifyOpen();
  };

  const close = () => {
    if (!store.state.isOpen) return;
    store.setState({ isOpen: false });
    resetSearch();
    notifyOpen();
  };

  const toggle = () => (store.state.isOpen ? close() : open());

  /* ── Actions ───────────────────────────────────────────────────── */

  const setDisabled = (disabled: boolean) => {
    store.setState({ disabled });
    if (disabled && store.state.isOpen) close();
  };

  const setOptions = (nextOptions: SelectOption[]) => {
    options = nextOptions;
    const idx = findIndex(store.state.selectedValue);
    store.setState({ highlightedIndex: idx });
  };

  /* ── Queries ───────────────────────────────────────────────────── */

  const getSelectedText = () => {
    const opt = options.find(o => o.value === store.state.selectedValue);
    return opt?.text;
  };

  const getHighlightedOption = () => options[store.state.highlightedIndex];

  const getOptions = () => options;

  /* ── Props getters ─────────────────────────────────────────────── */

  const getTriggerProps = (): SelectTriggerProps => ({
    'aria-haspopup': 'listbox',
    'aria-expanded': store.state.isOpen ? 'true' : 'false',
    'aria-disabled': store.state.disabled ? 'true' : 'false',
    'data-state': store.state.isOpen ? 'open' : 'closed',
  });

  const getMenuProps = (): SelectMenuProps => ({
    'role': 'listbox',
    'aria-label': 'Options',
    'data-state': store.state.isOpen ? 'open' : 'closed',
    'hidden': !store.state.isOpen,
  });

  const getItemProps = (option: SelectOption, index: number): SelectItemProps => {
    const highlighted = index === store.state.highlightedIndex;
    const selected = option.value === store.state.selectedValue;
    return {
      'role': 'option',
      'aria-selected': selected ? 'true' : 'false',
      'aria-disabled': (option.disabled ?? false) ? 'true' : 'false',
      'data-state': selected ? 'active' : highlighted ? 'highlighted' : 'inactive',
      'tabindex': highlighted ? 0 : -1,
    };
  };

  /* ── Keyboard handlers ─────────────────────────────────────────── */

  const handleTriggerKeyDown = (event: KeyboardEvent) => {
    if (store.state.disabled) return;
    const { key } = event;

    switch (key) {
      case Keys.Enter:
      case Keys.Space:
      case Keys.ArrowDown:
        event.preventDefault();
        open();
        break;
      case Keys.ArrowUp:
        event.preventDefault();
        open();
        break;
      default:
        if (isPrintableKey(key)) {
          event.preventDefault();
          open();
          handleTypeahead(key);
        }
        break;
    }
  };

  const handleMenuKeyDown = (event: KeyboardEvent) => {
    if (!store.state.isOpen) return;
    const { key, altKey } = event;

    switch (key) {
      case Keys.Escape:
        event.preventDefault();
        close();
        break;
      case Keys.Tab:
        close();
        break;
      case Keys.ArrowDown:
        if (altKey) {
          event.preventDefault();
          close();
          break;
        }
        event.preventDefault();
        highlightNext();
        break;
      case Keys.ArrowUp:
        if (altKey) {
          event.preventDefault();
          close();
          break;
        }
        event.preventDefault();
        highlightPrev();
        break;
      case Keys.Home:
        event.preventDefault();
        highlightFirst();
        break;
      case Keys.End:
        event.preventDefault();
        highlightLast();
        break;
      case Keys.Enter:
      case Keys.Space:
        event.preventDefault();
        selectHighlighted();
        break;
      default:
        if (isPrintableKey(key)) {
          event.preventDefault();
          handleTypeahead(key);
        }
        break;
    }
  };

  return {
    get state() {
      return store.state;
    },
    subscribe: callback => store.subscribe(state => callback(state)),
    actions: {
      open,
      close,
      toggle,
      highlightNext,
      highlightPrev,
      highlightFirst,
      highlightLast,
      selectHighlighted,
      selectValue,
      setDisabled,
      setOptions,
    },
    queries: {
      isOpen: () => store.state.isOpen,
      getSelectedText,
      getHighlightedOption,
      getOptions,
    },
    getTriggerProps,
    getMenuProps,
    getItemProps,
    handleTriggerKeyDown,
    handleMenuKeyDown,
  };
}

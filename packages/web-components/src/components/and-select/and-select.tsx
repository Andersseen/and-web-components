import { Component, Prop, h, Host, Event, EventEmitter, Element, State, Listen, Watch } from '@stencil/core';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';
import { createIdGenerator } from '@andersseen/headless-components';

export type SelectOption = {
  text: string;
  value: string;
  disabled?: boolean;
};

export type SelectMenuPlacement = 'auto' | 'bottom' | 'top';

const selectVariants = cva(
  [
    'inline-flex h-10 w-full items-center rounded-md border border-border bg-background',
    'px-3 py-2 pr-10 text-sm font-sans text-left text-foreground shadow-sm',
    'cursor-pointer',
    'transition-all duration-fast ring-offset-background',
    'hover:bg-accent/60 hover:text-accent-foreground',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    'disabled:cursor-not-allowed disabled:opacity-50',
  ].join(' '),
  {
    variants: {
      hasError: {
        true: 'border-destructive focus-visible:ring-destructive',
        false: '',
      },
    },
    defaultVariants: {
      hasError: false,
    },
  },
);

export type SelectVariantProps = VariantProps<typeof selectVariants>;

@Component({
  tag: 'and-select',
  styleUrls: ['and-select.css'],
  shadow: true,
})
export class AndSelect {
  @Element() el: HTMLElement;

  @State() private isOpen: boolean = false;
  @State() private resolvedPlacement: 'bottom' | 'top' = 'bottom';
  @State() private menuMaxHeight: number = 256;
  @State() private highlightedIndex: number = -1;

  private wrapperEl?: HTMLDivElement;
  private menuEl?: HTMLDivElement;
  private triggerEl?: HTMLButtonElement;
  private generateId = createIdGenerator('select');
  private listboxId = this.generateId('listbox');
  private searchQuery = '';
  private searchTimer?: ReturnType<typeof setTimeout>;

  /** Options rendered in the select menu. Can be an array or a JSON string. */
  @Prop() options: SelectOption[] | string = [];

  /** Placeholder shown when no value is selected. */
  @Prop({ reflect: true }) placeholder: string = 'Select an option';

  /** Current selected value. */
  @Prop({ reflect: true, mutable: true }) value: string = '';

  /** Name attribute forwarded to native select. */
  @Prop({ reflect: true }) name: string;

  /** Disables interaction when true. */
  @Prop({ reflect: true }) disabled: boolean = false;

  /** Marks the field as required. */
  @Prop({ reflect: true }) required: boolean = false;

  /** Whether the select is in an error state. */
  @Prop({ reflect: true }) hasError: boolean = false;

  /**
   * Menu placement strategy.
   */
  @Prop({ reflect: true }) menuPlacement: SelectMenuPlacement = 'auto';

  /** Accessible label for the select. */
  @Prop() label: string;

  /** ID of element describing this field. */
  @Prop() describedBy: string;

  /** Additional CSS classes from the consumer. */
  @Prop({ attribute: 'class' }) customClass: string;

  /** Emitted when selected value changes. */
  @Event({ bubbles: true, composed: true }) andSelectChange: EventEmitter<string>;

  /** Emitted when select loses focus / closes. */
  @Event({ bubbles: true, composed: true }) andBlur: EventEmitter<void>;

  /* ── Watchers ───────────────────────────────────────────────────── */

  @Watch('options')
  @Watch('value')
  resetHighlight() {
    this.highlightedIndex = this.findSelectedIndex();
  }

  /* ── Outside interactions ─────────────────────────────────────── */

  @Listen('click', { target: 'window' })
  handleOutsideClick(event: MouseEvent) {
    if (!this.isOpen) {
      return;
    }
    const path = event.composedPath();
    if (!path.includes(this.el)) {
      this.closeMenu();
    }
  }

  @Listen('resize', { target: 'window' })
  handleWindowResize() {
    if (this.isOpen) {
      this.updateMenuPlacement();
    }
  }

  @Listen('scroll', { target: 'window' })
  handleWindowScroll() {
    if (this.isOpen) {
      this.updateMenuPlacement();
    }
  }

  /* ── Keyboard handling (on host so it fires when trigger is focused) ── */

  private handleKeyDown = (event: KeyboardEvent) => {
    const { key, altKey } = event;

    // When closed, some keys open the menu
    if (!this.isOpen) {
      switch (key) {
        case 'ArrowDown':
        case 'ArrowUp':
        case 'Enter':
        case ' ':
          event.preventDefault();
          this.openMenu();
          return;
        default:
          // Typeahead when closed also opens
          if (this.isPrintableKey(key)) {
            event.preventDefault();
            this.openMenu();
            this.handleTypeahead(key);
          }
          return;
      }
    }

    // When open, full navigation
    switch (key) {
      case 'ArrowDown': {
        event.preventDefault();
        this.highlightNext(1);
        return;
      }
      case 'ArrowUp': {
        event.preventDefault();
        this.highlightNext(-1);
        return;
      }
      case 'Home': {
        event.preventDefault();
        this.highlightTo(0, 1);
        return;
      }
      case 'End': {
        event.preventDefault();
        this.highlightTo(this.resolvedOptions.length - 1, -1);
        return;
      }
      case 'Enter':
      case ' ': {
        event.preventDefault();
        const option = this.resolvedOptions[this.highlightedIndex];
        if (option && !option.disabled) {
          this.selectValue(option.value);
        }
        return;
      }
      case 'Escape': {
        event.preventDefault();
        this.closeMenu();
        return;
      }
      case 'Tab': {
        // Tab closes menu and lets default focus move
        this.closeMenu();
        return;
      }
      default: {
        if (altKey && (key === 'ArrowUp' || key === 'ArrowDown')) {
          event.preventDefault();
          this.closeMenu();
          return;
        }
        if (this.isPrintableKey(key)) {
          event.preventDefault();
          this.handleTypeahead(key);
        }
      }
    }
  };

  /* ── Menu control ─────────────────────────────────────────────── */

  private openMenu() {
    if (this.disabled) {
      return;
    }
    this.isOpen = true;
    this.highlightedIndex = this.findSelectedIndex();
    if (this.highlightedIndex === -1) {
      this.highlightTo(0, 1);
    }
    requestAnimationFrame(() => this.updateMenuPlacement());
  }

  private closeMenu() {
    if (!this.isOpen) {
      return;
    }
    this.isOpen = false;
    this.highlightedIndex = -1;
    this.andBlur.emit();
    // Return focus to trigger
    this.triggerEl?.focus();
  }

  private toggleOpen = () => {
    if (this.disabled) {
      return;
    }
    if (this.isOpen) {
      this.closeMenu();
    } else {
      this.openMenu();
    }
  };

  private selectValue(nextValue: string) {
    this.value = nextValue;
    this.andSelectChange.emit(nextValue);
    this.closeMenu();
  }

  private handleSelect = (nextValue: string) => {
    this.selectValue(nextValue);
  };

  /* ── Highlight navigation ─────────────────────────────────────── */

  private findSelectedIndex(): number {
    return this.resolvedOptions.findIndex(o => o.value === this.value);
  }

  private highlightNext(delta: 1 | -1) {
    if (this.resolvedOptions.length === 0) {
      return;
    }
    const start = this.highlightedIndex >= 0 ? this.highlightedIndex : delta > 0 ? -1 : this.resolvedOptions.length;
    this.highlightTo(start + delta, delta);
  }

  private highlightTo(startIndex: number, direction: 1 | -1) {
    if (this.resolvedOptions.length === 0) {
      this.highlightedIndex = -1;
      return;
    }

    let index = startIndex;
    const len = this.resolvedOptions.length;

    for (let i = 0; i < len; i++) {
      // Wrap around
      if (index >= len) {
        index = 0;
      }
      if (index < 0) {
        index = len - 1;
      }

      if (!this.resolvedOptions[index].disabled) {
        this.highlightedIndex = index;
        this.scrollOptionIntoView(index);
        return;
      }
      index += direction;
    }

    // All disabled
    this.highlightedIndex = -1;
  }

  private scrollOptionIntoView(index: number) {
    const optionEl = this.menuEl?.querySelectorAll<HTMLElement>('.select-option')[index];
    if (optionEl) {
      optionEl.scrollIntoView({ block: 'nearest' });
    }
  }

  /* ── Typeahead ────────────────────────────────────────────────── */

  private isPrintableKey(key: string): boolean {
    return (
      key.length === 1 && !key.startsWith('Arrow') && !key.startsWith('Escape') && key !== 'Tab' && key !== 'Enter'
    );
  }

  private handleTypeahead(key: string) {
    // Accumulate search query
    this.searchQuery += key.toLowerCase();
    this.clearSearchTimer();
    this.searchTimer = setTimeout(() => {
      this.searchQuery = '';
    }, 500);

    // Search from current highlight + 1
    const start = this.highlightedIndex >= 0 ? this.highlightedIndex + 1 : 0;
    const len = this.resolvedOptions.length;

    for (let i = 0; i < len; i++) {
      const idx = (start + i) % len;
      const option = this.resolvedOptions[idx];
      if (option.disabled) {
        continue;
      }
      if (option.text.toLowerCase().startsWith(this.searchQuery)) {
        this.highlightedIndex = idx;
        this.scrollOptionIntoView(idx);
        return;
      }
    }

    // If no match from cursor, search from beginning
    for (let i = 0; i < len; i++) {
      const option = this.resolvedOptions[i];
      if (option.disabled) {
        continue;
      }
      if (option.text.toLowerCase().startsWith(this.searchQuery)) {
        this.highlightedIndex = i;
        this.scrollOptionIntoView(i);
        return;
      }
    }
  }

  /** Parsed options — handles both array and JSON string input */
  private get resolvedOptions(): SelectOption[] {
    if (typeof this.options === 'string') {
      try {
        const parsed = JSON.parse(this.options);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }
    return Array.isArray(this.options) ? this.options : [];
  }

  private clearSearchTimer() {
    if (this.searchTimer) {
      clearTimeout(this.searchTimer);
      this.searchTimer = undefined;
    }
  }

  /* ── Placement ──────────────────────────────────────────────── */

  private updateMenuPlacement() {
    if (!this.wrapperEl) {
      return;
    }

    const rect = this.wrapperEl.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const viewportMargin = 8;
    const gap = 6;

    const spaceBelow = Math.max(0, viewportHeight - rect.bottom - viewportMargin - gap);
    const spaceAbove = Math.max(0, rect.top - viewportMargin - gap);

    const preferredHeight = this.menuEl?.scrollHeight ?? 256;
    const minUsefulHeight = 140;

    if (this.menuPlacement === 'top') {
      this.resolvedPlacement = 'top';
      this.menuMaxHeight = Math.max(96, spaceAbove);
      return;
    }

    if (this.menuPlacement === 'bottom') {
      this.resolvedPlacement = 'bottom';
      this.menuMaxHeight = Math.max(96, spaceBelow);
      return;
    }

    const shouldOpenTop = spaceBelow < Math.min(preferredHeight, minUsefulHeight) && spaceAbove > spaceBelow;

    this.resolvedPlacement = shouldOpenTop ? 'top' : 'bottom';
    this.menuMaxHeight = Math.max(96, shouldOpenTop ? spaceAbove : spaceBelow);
  }

  /* ── Render ───────────────────────────────────────────────────── */

  render() {
    const selected = this.resolvedOptions.find(option => option.value === this.value);
    const hasValue = !!selected;
    const displayText = selected?.text ?? this.placeholder;
    const activeDescendant =
      this.isOpen && this.highlightedIndex >= 0 ? `${this.listboxId}-option-${this.highlightedIndex}` : undefined;

    return (
      <Host class="block">
        <div
          class="select-wrapper"
          ref={el => {
            this.wrapperEl = el as HTMLDivElement;
          }}
        >
          <button
            type="button"
            ref={el => {
              this.triggerEl = el as HTMLButtonElement;
            }}
            class={cn(
              selectVariants({ hasError: this.hasError }),
              !hasValue && 'text-muted-foreground',
              hasValue && 'text-foreground',
              this.customClass,
            )}
            disabled={this.disabled}
            role="combobox"
            aria-haspopup="listbox"
            aria-expanded={String(this.isOpen)}
            aria-controls={this.listboxId}
            aria-activedescendant={activeDescendant}
            aria-label={this.label}
            aria-describedby={this.describedBy}
            aria-invalid={this.hasError ? 'true' : undefined}
            aria-required={this.required ? 'true' : undefined}
            onClick={this.toggleOpen}
            onKeyDown={this.handleKeyDown}
          >
            <span class="select-value">{displayText}</span>
          </button>

          <and-icon class="select-icon" name="chevron-down" size={16} />

          <div
            id={this.listboxId}
            class={cn('select-menu', this.isOpen ? 'select-menu--open' : 'select-menu--closed')}
            data-placement={this.resolvedPlacement}
            role="listbox"
            aria-hidden={this.isOpen ? 'false' : 'true'}
            style={{ maxHeight: `${this.menuMaxHeight}px` }}
            ref={el => {
              this.menuEl = el as HTMLDivElement;
            }}
          >
            {this.resolvedOptions.map((option, index) => {
              const isSelected = option.value === this.value;
              const isHighlighted = index === this.highlightedIndex;
              return (
                <button
                  type="button"
                  id={`${this.listboxId}-option-${index}`}
                  role="option"
                  aria-selected={isSelected ? 'true' : 'false'}
                  class={cn(
                    'select-option',
                    isSelected && 'select-option--selected',
                    isHighlighted && 'select-option--highlighted',
                  )}
                  disabled={option.disabled}
                  onClick={() => this.handleSelect(option.value)}
                >
                  <span>{option.text}</span>
                  {isSelected && <and-icon name="check" size={16} />}
                </button>
              );
            })}
          </div>

          {this.name && <input type="hidden" name={this.name} value={this.value} />}
        </div>
      </Host>
    );
  }
}

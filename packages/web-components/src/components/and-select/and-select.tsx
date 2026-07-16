import { Component, Prop, h, Host, Event, EventEmitter, Element, State, Listen, Watch } from '@stencil/core';
import { cn } from '../../utils/cn';
import { createIdGenerator, createSelect } from '@andersseen/headless-components';
import type { SelectReturn, SelectState } from '@andersseen/headless-components';
import type { SelectOption, SelectMenuPlacement } from './types';
import { selectVariants } from './and-select-variants';

/**
 * Custom `role="combobox"` select, styleable unlike a native `<select>`.
 * Implements the ARIA combobox pattern: `aria-expanded`, `aria-controls`,
 * `aria-activedescendant` tracks the highlighted option while focus stays
 * on the trigger, and the listbox options get `aria-selected`. A hidden
 * native `<input>` mirrors `value` when `name` is set.
 *
 * Renders in light DOM (`scoped` styles, not Shadow DOM) on purpose: that
 * hidden input is a real descendant of whatever `<form>` wraps this
 * component, so it actually shows up in `FormData` on submit — inside a
 * Shadow DOM it would be invisible to the enclosing form. A `reset` listener
 * on the wrapping `<form>` restores the original default on native
 * `form.reset()` (see `connectedCallback`) — needed because the mirror
 * input's own reset default drifts to whatever was last selected.
 *
 * @example
 * ```html
 * <and-select label="Country" name="country" options='[{"value":"us","text":"United States"}]'>
 * </and-select>
 * ```
 */
@Component({
  tag: 'and-select',
  styleUrls: ['and-select.css', '../../global/component-base.css'],
  scoped: true,
})
export class AndSelect {
  @Element() el!: HTMLElement;

  @State() private selectState!: SelectState;
  @State() private resolvedPlacement: 'bottom' | 'top' = 'bottom';
  @State() private menuMaxHeight: number = 256;

  private selectLogic!: SelectReturn;
  private wrapperEl?: HTMLDivElement;
  private menuEl?: HTMLDivElement;
  private triggerEl?: HTMLButtonElement;
  private generateId = createIdGenerator('select');
  private listboxId = this.generateId('listbox');
  private prevHighlightedIndex = -1;
  private prevIsOpen = false;
  private unsubscribe?: () => void;
  private defaultValue: string = '';
  private formEl: HTMLFormElement | null = null;

  /** Options rendered in the select menu. Can be an array or a JSON string. */
  @Prop() options: SelectOption[] | string = [];

  /** Placeholder shown when no value is selected. */
  @Prop({ reflect: true }) placeholder: string = 'Select an option';

  /** Current selected value. */
  @Prop({ reflect: true, mutable: true }) value: string = '';

  /** Name attribute forwarded to native select. */
  @Prop({ reflect: true }) name: string = '';

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
  @Prop() label: string = '';

  /** ID of element describing this field. */
  @Prop() describedBy: string = '';

  /** Additional CSS classes from the consumer. */
  @Prop({ attribute: 'class' }) customClass: string = '';

  /** Emitted when selected value changes. */
  @Event({ bubbles: true, composed: true }) andSelectChange!: EventEmitter<string>;

  /** Emitted when select loses focus / closes. */
  @Event({ bubbles: true, composed: true }) andSelectBlur!: EventEmitter<void>;

  /* ── Lifecycle ──────────────────────────────────────────────────── */

  componentWillLoad() {
    this.defaultValue = this.value;
    this.selectLogic = createSelect({
      options: this.resolvedOptions,
      defaultValue: this.value || undefined,
      disabled: this.disabled,
      onValueChange: v => {
        this.value = v;
        this.andSelectChange.emit(v);
      },
      onOpenChange: isOpen => {
        if (!isOpen) {
          this.andSelectBlur.emit();
        }
      },
    });
    this.selectState = this.selectLogic.state;
    this.prevIsOpen = this.selectState.isOpen;
    this.prevHighlightedIndex = this.selectState.highlightedIndex;

    this.unsubscribe = this.selectLogic.subscribe(s => {
      this.selectState = s;

      if (this.prevIsOpen && !s.isOpen) {
        this.triggerEl?.focus();
      }

      if (s.highlightedIndex !== this.prevHighlightedIndex) {
        this.scrollOptionIntoView(s.highlightedIndex);
      }

      if (s.isOpen && !this.prevIsOpen) {
        requestAnimationFrame(() => this.updateMenuPlacement());
      }

      this.prevIsOpen = s.isOpen;
      this.prevHighlightedIndex = s.highlightedIndex;
    });
  }

  // connectedCallback (unlike componentWillLoad) re-fires whenever the
  // element is (re)inserted into the DOM, so it also catches the element
  // being moved into a <form> after its first mount.
  connectedCallback() {
    // The hidden mirror <input> (see render()) is a real light-DOM descendant
    // of any wrapping <form>, so FormData already sees it. But it doesn't fix
    // native form.reset() on its own: Stencil re-stamps that input's `value`
    // attribute on every selection change, which drags its own reset default
    // along with it — so a native reset restores the *last selected* value,
    // not the true original default. Force it back ourselves.
    this.formEl = this.el.closest('form');
    this.formEl?.addEventListener('reset', this.handleFormReset);
  }

  disconnectedCallback() {
    this.unsubscribe?.();
    this.formEl?.removeEventListener('reset', this.handleFormReset);
  }

  /* ── Watchers ───────────────────────────────────────────────────── */

  @Watch('options')
  handleOptionsChange() {
    this.selectLogic?.actions.setOptions(this.resolvedOptions);
  }

  @Watch('value')
  handleValueChange() {
    if (this.selectLogic && this.value !== this.selectLogic.state.selectedValue) {
      this.selectLogic.actions.selectValue(this.value);
    }
  }

  @Watch('disabled')
  handleDisabledChange(v: boolean) {
    this.selectLogic?.actions.setDisabled(v);
  }

  /* ── Outside interactions ───────────────────────────────────────── */

  @Listen('click', { target: 'window' })
  handleOutsideClick(event: MouseEvent) {
    if (!this.selectState?.isOpen) {
      return;
    }
    const path = event.composedPath();
    if (!path.includes(this.el)) {
      this.selectLogic.actions.close();
    }
  }

  @Listen('resize', { target: 'window' })
  handleWindowResize() {
    if (this.selectState?.isOpen) {
      this.updateMenuPlacement();
    }
  }

  @Listen('scroll', { target: 'window' })
  handleWindowScroll() {
    if (this.selectState?.isOpen) {
      this.updateMenuPlacement();
    }
  }

  /* ── Keyboard handling (focus stays on trigger via aria-activedescendant) ── */

  private handleKeyDown = (event: KeyboardEvent) => {
    if (this.selectState.isOpen) {
      this.selectLogic.handleMenuKeyDown(event);
    } else {
      this.selectLogic.handleTriggerKeyDown(event);
    }
  };

  private handleFormReset = () => {
    this.selectLogic?.actions.setSelectedValue(this.defaultValue || null);
  };

  /* ── Menu control ───────────────────────────────────────────────── */

  private toggleOpen = () => {
    this.selectLogic.actions.toggle();
  };

  private handleSelect = (nextValue: string) => {
    this.selectLogic.actions.selectValue(nextValue);
  };

  /* ── DOM helpers ────────────────────────────────────────────────── */

  private scrollOptionIntoView(index: number) {
    const optionEl = this.menuEl?.querySelectorAll<HTMLElement>('.select-option')[index];
    if (optionEl) {
      optionEl.scrollIntoView({ block: 'nearest' });
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

  /* ── Placement ──────────────────────────────────────────────────── */

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

  /* ── Render ─────────────────────────────────────────────────────── */

  render() {
    const selected = this.resolvedOptions.find(option => option.value === this.value);
    const hasValue = !!selected;
    const displayText = selected?.text ?? this.placeholder;
    const activeDescendant =
      this.selectState.isOpen && this.selectState.highlightedIndex >= 0
        ? `${this.listboxId}-option-${this.selectState.highlightedIndex}`
        : undefined;

    const triggerProps = this.selectLogic.getTriggerProps();
    const menuProps = this.selectLogic.getMenuProps();

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
            {...triggerProps}
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
            class={cn('select-menu', this.selectState.isOpen ? 'select-menu--open' : 'select-menu--closed')}
            data-placement={this.resolvedPlacement}
            {...menuProps}
            aria-hidden={this.selectState.isOpen ? 'false' : 'true'}
            style={{ maxHeight: `${this.menuMaxHeight}px` }}
            ref={el => {
              this.menuEl = el as HTMLDivElement;
            }}
          >
            {this.resolvedOptions.map((option, index) => {
              const itemProps = this.selectLogic.getItemProps(option, index);
              const isHighlighted = index === this.selectState.highlightedIndex;
              return (
                <button
                  type="button"
                  id={`${this.listboxId}-option-${index}`}
                  {...itemProps}
                  class={cn(
                    'select-option',
                    itemProps['aria-selected'] === 'true' && 'select-option--selected',
                    isHighlighted && 'select-option--highlighted',
                  )}
                  disabled={option.disabled}
                  onClick={() => this.handleSelect(option.value)}
                >
                  <span>{option.text}</span>
                  {itemProps['aria-selected'] === 'true' && <and-icon name="check" size={16} />}
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

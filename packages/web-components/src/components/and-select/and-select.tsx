import { Component, Prop, h, Host, Event, EventEmitter, Element, State, Listen } from '@stencil/core';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';

export type SelectOption = {
  text: string;
  value: string;
  disabled?: boolean;
};

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
  styleUrls: ['and-select.css', '../../global/global.css'],
  shadow: true,
})
export class AndSelect {
  @Element() el: HTMLElement;
  @State() private isOpen: boolean = false;

  /** Options rendered in the select menu. */
  @Prop() options: SelectOption[] = [];

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

  /** Accessible label for the select (used when no visible label exists). */
  @Prop() label: string;

  /** ID of element describing this field (e.g. helper or error text). */
  @Prop() describedBy: string;

  /** Additional CSS classes from the consumer. */
  @Prop({ attribute: 'class' }) customClass: string;

  /** Emitted when selected value changes. */
  @Event({ bubbles: true, composed: true }) andSelectChange: EventEmitter<string>;

  /** Emitted when select loses focus. */
  @Event({ bubbles: true, composed: true }) andBlur: EventEmitter<void>;

  @Listen('click', { target: 'window' })
  handleOutsideClick(event: MouseEvent) {
    if (!this.isOpen) return;
    const path = event.composedPath();
    if (!path.includes(this.el)) {
      this.isOpen = false;
      this.andBlur.emit();
    }
  }

  @Listen('keydown', { target: 'window' })
  handleWindowKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape' && this.isOpen) {
      this.isOpen = false;
      this.andBlur.emit();
    }
  }

  private handleSelect = (nextValue: string) => {
    this.value = nextValue;
    this.andSelectChange.emit(nextValue);
    this.isOpen = false;
  };

  private toggleOpen = () => {
    if (this.disabled) return;
    this.isOpen = !this.isOpen;
  };

  render() {
    const selected = this.options.find(option => option.value === this.value);
    const hasValue = !!selected;
    const displayText = selected?.text ?? this.placeholder;

    return (
      <Host class="block">
        <div class="select-wrapper">
          <button
            type="button"
            class={cn(selectVariants({ hasError: this.hasError }), !hasValue && 'text-muted-foreground', hasValue && 'text-foreground', this.customClass)}
            disabled={this.disabled}
            role="combobox"
            aria-haspopup="listbox"
            aria-expanded={String(this.isOpen)}
            aria-label={this.label}
            aria-describedby={this.describedBy}
            aria-invalid={this.hasError ? 'true' : undefined}
            onClick={this.toggleOpen}
          >
            <span class="select-value">{displayText}</span>
          </button>

          <and-icon class="select-icon" name="chevron-down" size={16} />

          <div class={cn('select-menu', this.isOpen ? 'select-menu--open' : 'select-menu--closed')} role="listbox" aria-hidden={this.isOpen ? 'false' : 'true'}>
            {this.options.map(option => {
              const isSelected = option.value === this.value;
              return (
                <button
                  type="button"
                  role="option"
                  aria-selected={isSelected ? 'true' : 'false'}
                  class={cn('select-option', isSelected && 'select-option--selected')}
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

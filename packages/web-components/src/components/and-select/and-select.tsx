import { Component, Prop, h, Host, Event, EventEmitter, Element } from '@stencil/core';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';

export type SelectOption = {
  text: string;
  value: string;
  disabled?: boolean;
};

const selectVariants = cva(
  [
    'flex h-11 sm:h-10 w-full rounded-md border border-input bg-background',
    'px-3 py-2 pr-10 text-sm font-sans shadow-sm',
    'transition-all duration-fast ring-offset-background',
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

  private handleChange = (ev: Event) => {
    const target = ev.target as HTMLSelectElement;
    this.value = target.value;
    this.andSelectChange.emit(target.value);
  };

  private handleBlur = () => {
    this.andBlur.emit();
  };

  render() {
    const hasValue = this.value.length > 0;

    return (
      <Host class="block">
        <div class="select-wrapper">
          <select
            class={cn(selectVariants({ hasError: this.hasError }), this.customClass)}
            name={this.name}
            disabled={this.disabled}
            required={this.required}
            aria-label={this.label}
            aria-describedby={this.describedBy}
            aria-invalid={this.hasError ? 'true' : undefined}
            onChange={this.handleChange}
            onBlur={this.handleBlur}
          >
            <option value="" disabled={this.required} selected={!hasValue} hidden={this.required}>
              {this.placeholder}
            </option>
            {this.options.map(option => (
              <option value={option.value} disabled={option.disabled} selected={option.value === this.value}>
                {option.text}
              </option>
            ))}
          </select>
          <and-icon class="select-icon" name="chevron-down" size={16} />
        </div>
      </Host>
    );
  }
}

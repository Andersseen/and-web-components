import { Component, Prop, h, Host, Event, EventEmitter, Element } from '@stencil/core';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';

/* ────────────────────────────────────────────────────────────────────
 * Variants
 * ──────────────────────────────────────────────────────────────────── */

const inputVariants = cva(
  [
    'flex h-11 sm:h-10 w-full rounded-md border border-input bg-background',
    'px-3 py-2 text-sm font-sans shadow-sm',
    'transition-all duration-fast ring-offset-background',
    'file:border-0 file:bg-transparent file:text-sm file:font-medium',
    'placeholder:text-muted-foreground',
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

export type InputVariantProps = VariantProps<typeof inputVariants>;

export type InputType = 'text' | 'password' | 'email' | 'number' | 'tel' | 'url' | 'search';

/* ────────────────────────────────────────────────────────────────────
 * Component
 * ──────────────────────────────────────────────────────────────────── */

@Component({
  tag: 'and-input',
  styleUrls: ['and-input.css', '../../global/global.css'],
  shadow: true,
})
export class AndInput {
  @Element() el: HTMLElement;

  /** Placeholder text for the input. */
  @Prop({ reflect: true }) placeholder: string;

  /** Current value of the input. */
  @Prop({ reflect: true, mutable: true }) value: string;

  /** HTML input type. */
  @Prop({ reflect: true }) type: InputType = 'text';

  /** Disables interaction when true. */
  @Prop({ reflect: true }) disabled: boolean = false;

  /** Marks the input as required. */
  @Prop({ reflect: true }) required: boolean = false;

  /** Whether the input is in an error state. */
  @Prop({ reflect: true }) hasError: boolean = false;

  /** Accessible label for the input (used when no visible label exists). */
  @Prop() label: string;

  /** ID of the element that describes this input (e.g. error message). */
  @Prop() describedBy: string;

  /** Additional CSS classes from the consumer. */
  @Prop({ attribute: 'class' }) customClass: string;

  /** Emitted when the input value changes. */
  @Event({ bubbles: true, composed: true }) andInput: EventEmitter<string>;

  /** Emitted when the input loses focus. */
  @Event({ bubbles: true, composed: true }) andBlur: EventEmitter<void>;

  /* ── Handlers ───────────────────────────────────────────────────── */

  private handleInput = (ev: Event) => {
    const target = ev.target as HTMLInputElement;
    this.value = target.value;
    this.andInput.emit(target.value);
  };

  private handleBlur = () => {
    this.andBlur.emit();
  };

  /* ── Render ─────────────────────────────────────────────────────── */

  render() {
    return (
      <Host class="block">
        <input
          type={this.type}
          class={cn(inputVariants({ hasError: this.hasError }), this.customClass)}
          placeholder={this.placeholder}
          value={this.value}
          disabled={this.disabled}
          required={this.required}
          aria-label={this.label}
          aria-describedby={this.describedBy}
          aria-invalid={this.hasError ? 'true' : undefined}
          onInput={this.handleInput}
          onBlur={this.handleBlur}
        />
      </Host>
    );
  }
}

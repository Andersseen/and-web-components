import { Component, Prop, h, Host, Event, EventEmitter, Element, Watch } from '@stencil/core';
import { cva, type VariantProps } from 'class-variance-authority';
import { createInput, type InputReturn } from '@andersseen/headless-components';
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
  styleUrls: ['and-input.css', '../../global/component-base.css'],
  shadow: true,
})
export class AndInput {
  @Element() el!: HTMLElement;

  /** Placeholder text for the input. */
  @Prop({ reflect: true }) placeholder!: string;

  /** Current value of the input. */
  @Prop({ reflect: true, mutable: true }) value!: string;

  /** HTML input type. */
  @Prop({ reflect: true }) type: InputType = 'text';

  /** Disables interaction when true. */
  @Prop({ reflect: true }) disabled: boolean = false;

  /** Marks the input as required. */
  @Prop({ reflect: true }) required: boolean = false;

  /** Whether the input is in an error state. */
  @Prop({ reflect: true }) hasError: boolean = false;

  /** Accessible label for the input (used when no visible label exists). */
  @Prop() label!: string;

  /** ID of the element that describes this input (e.g. error message). */
  @Prop() describedBy!: string;

  /** Additional CSS classes from the consumer. */
  @Prop({ attribute: 'class' }) customClass!: string;

  /** Emitted when the input value changes. */
  @Event({ bubbles: true, composed: true }) andInputChange!: EventEmitter<string>;

  /** Emitted when the input loses focus. */
  @Event({ bubbles: true, composed: true }) andInputBlur!: EventEmitter<void>;

  private inputLogic!: InputReturn;
  private unsubscribe!: () => void;

  /* ── Lifecycle ──────────────────────────────────────────────────── */

  componentWillLoad() {
    this.inputLogic = createInput({
      defaultValue: this.value,
      disabled: this.disabled,
      required: this.required,
      onValueChange: (value: string) => {
        this.value = value;
        this.andInputChange.emit(value);
      },
    });
    this.unsubscribe = this.inputLogic.subscribe(() => {
      // trigger re-render on state change from headless
      this.value = this.inputLogic.state.value;
    });
  }

  disconnectedCallback() {
    this.unsubscribe?.();
  }

  /* ── Watchers ───────────────────────────────────────────────────── */

  @Watch('disabled')
  disabledChanged(newValue: boolean) {
    this.inputLogic?.actions.setDisabled(newValue);
  }

  @Watch('required')
  requiredChanged(newValue: boolean) {
    this.inputLogic?.actions.setRequired(newValue);
  }

  /* ── Handlers ───────────────────────────────────────────────────── */

  private handleInput = (ev: Event) => {
    const target = ev.target as HTMLInputElement;
    this.inputLogic.actions.setValue(target.value);
  };

  private handleBlur = () => {
    this.inputLogic.actions.blur();
    this.andInputBlur.emit();
  };

  private handleFocus = () => {
    this.inputLogic.actions.focus();
  };

  /* ── Render ─────────────────────────────────────────────────────── */

  render() {
    const props = this.inputLogic?.getInputProps() || {};

    return (
      <Host class="block">
        <input
          {...props}
          type={this.type}
          class={cn(inputVariants({ hasError: this.hasError }), this.customClass)}
          placeholder={this.placeholder}
          aria-label={this.label}
          aria-describedby={this.describedBy}
          aria-invalid={this.hasError ? 'true' : undefined}
          onInput={this.handleInput}
          onBlur={this.handleBlur}
          onFocus={this.handleFocus}
        />
      </Host>
    );
  }
}

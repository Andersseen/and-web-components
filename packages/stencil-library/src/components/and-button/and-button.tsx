import { Component, h, Prop, Element, Event, EventEmitter, State, Watch } from '@stencil/core';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';
import { createButton, type ButtonReturn } from '@andersseen/headless-components';

/* ────────────────────────────────────────────────────────────────────
 * Variants
 * ──────────────────────────────────────────────────────────────────── */

const buttonVariants = cva(
  [
    'inline-flex items-center justify-center rounded-lg text-sm font-medium font-sans',
    'transition-all duration-normal',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background',
    'disabled:opacity-50 disabled:pointer-events-none',
  ].join(' '),
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground shadow-sm hover:shadow-md hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground shadow-sm hover:shadow-md hover:bg-destructive/90',
        outline: 'border border-input bg-background shadow-sm hover:shadow-md hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground shadow-sm hover:shadow-md hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-11 sm:h-10 py-2 px-4',
        sm: 'h-10 sm:h-9 px-3 rounded-md',
        lg: 'h-12 sm:h-11 px-8 rounded-md',
        icon: 'h-11 w-11 sm:h-10 sm:w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

const spinnerClass = 'mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent';

export type ButtonVariantProps = VariantProps<typeof buttonVariants>;

/* ────────────────────────────────────────────────────────────────────
 * Component
 * ──────────────────────────────────────────────────────────────────── */

@Component({
  tag: 'and-button',
  styleUrls: ['and-button.css', '../../global/global.css'],
  shadow: true,
})
export class AndButton {
  @Element() el: HTMLElement;

  /** Visual variant of the button. */
  @Prop({ reflect: true }) variant: ButtonVariantProps['variant'] = 'default';

  /** Size of the button. */
  @Prop({ reflect: true }) size: ButtonVariantProps['size'] = 'default';

  /** HTML button type attribute. */
  @Prop({ reflect: true }) type: 'button' | 'submit' | 'reset' = 'button';

  /** Disables the button when true. */
  @Prop({ reflect: true }) disabled: boolean = false;

  /** Shows a loading spinner and disables interaction. */
  @Prop({ reflect: true }) loading: boolean = false;

  /** Additional CSS classes to merge with the internal styles. */
  @Prop({ attribute: 'class' }) customClass: string;

  /** Emitted on button click. */
  @Event({ bubbles: true, composed: true }) andButtonClick: EventEmitter<MouseEvent>;

  @State() private buttonLogic: ButtonReturn;

  /* ── Lifecycle ──────────────────────────────────────────────────── */

  componentWillLoad() {
    const ariaLabel = this.el.getAttribute('aria-label') || undefined;

    this.buttonLogic = createButton({
      disabled: this.disabled,
      loading: this.loading,
      type: this.type,
      ariaLabel,
      onClick: (e: MouseEvent) => this.andButtonClick.emit(e),
    });
  }

  /* ── Watchers ───────────────────────────────────────────────────── */

  @Watch('disabled')
  disabledChanged(newValue: boolean) {
    this.buttonLogic?.actions.setDisabled(newValue);
  }

  @Watch('loading')
  loadingChanged(newValue: boolean) {
    this.buttonLogic?.actions.setLoading(newValue);
  }

  /* ── Render ─────────────────────────────────────────────────────── */

  render() {
    const props = this.buttonLogic?.getButtonProps() || {};
    const classes = cn(buttonVariants({ variant: this.variant, size: this.size }), this.customClass);

    return (
      <button
        {...props}
        onClick={(e: MouseEvent) => this.buttonLogic?.actions.click(e)}
        class={classes}
      >
        <slot name="start" />
        {this.loading && <span class={spinnerClass} aria-hidden="true" />}
        <slot />
        <slot name="end" />
      </button>
    );
  }
}

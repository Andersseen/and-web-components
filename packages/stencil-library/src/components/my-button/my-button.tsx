import { Component, h, Prop, Element, State, Watch } from '@stencil/core';
import { cva, VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';
import { createButton, ButtonReturn } from '@andersseen/headless-core';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-white',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary-700',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 py-t-gap-sm px-t-gap',
        sm: 'h-9 px-t-gap-sm rounded-md',
        lg: 'h-11 px-t-gap-lg rounded-md',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export type ButtonProps = VariantProps<typeof buttonVariants>;

@Component({
  tag: 'my-button',
  styleUrls: ['my-button.css', '../../global/global.css'],
  shadow: true,
})
export class MyButton {
  @Element() el: HTMLElement;

  @Prop() variant: ButtonProps['variant'] = 'default';
  @Prop() size: ButtonProps['size'] = 'default';
  @Prop() type: 'button' | 'submit' | 'reset' = 'button';
  @Prop() disabled: boolean = false;
  @Prop() loading: boolean = false;
  @Prop({ attribute: 'class' }) customClass: string;

  @State() private buttonLogic: ButtonReturn;

  componentWillLoad() {
    // Get aria-label from the host element if present
    const ariaLabel = this.el.getAttribute('aria-label') || undefined;

    this.buttonLogic = createButton({
      disabled: this.disabled,
      loading: this.loading,
      type: this.type,
      ariaLabel: ariaLabel,
      onClick: e => this.handleClick(e),
    });
  }

  @Watch('disabled')
  disabledChanged(newValue: boolean) {
    if (this.buttonLogic) {
      this.buttonLogic.actions.setDisabled(newValue);
    }
  }

  @Watch('loading')
  loadingChanged(newValue: boolean) {
    if (this.buttonLogic) {
      this.buttonLogic.actions.setLoading(newValue);
    }
  }

  private handleClick = (e: MouseEvent) => {
    // Emit custom event or handle click
    this.el.dispatchEvent(
      new CustomEvent('buttonClick', {
        detail: e,
        bubbles: true,
        composed: true,
      }),
    );
  };

  render() {
    const props = this.buttonLogic?.getButtonProps() || {};

    return (
      <button {...props} onClick={e => this.buttonLogic?.actions.click(e)} class={cn(buttonVariants({ variant: this.variant, size: this.size }), this.customClass)}>
        <slot name="start" />
        {this.loading && <span class="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden="true" />}
        <slot />
        <slot name="end" />
      </button>
    );
  }
}

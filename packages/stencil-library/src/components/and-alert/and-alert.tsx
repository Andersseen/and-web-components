import { Component, Prop, h, Host, State, Event, EventEmitter, Watch } from '@stencil/core';
import { cva } from 'class-variance-authority';
import { createAlert, type AlertVariant, type AlertReturn } from '@andersseen/headless-core';
import { cn } from '../../utils/utils';

const alertVariants = cva(
  'relative w-full rounded-lg border p-t-gap [&>svg~*]:pl-t-gap-lg [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-t-gap [&>svg]:top-t-gap [&>svg]:text-foreground',
  {
    variants: {
      variant: {
        default: 'bg-background text-foreground',
        destructive: 'border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive',
        success: 'border-accent/50 text-accent dark:border-accent [&>svg]:text-accent',
        warning: 'border-secondary/50 text-secondary dark:border-secondary [&>svg]:text-secondary',
        info: 'border-primary/50 text-primary dark:border-primary [&>svg]:text-primary',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

@Component({
  tag: 'and-alert',
  styleUrls: ['and-alert.css', '../../global/global.css'],
  shadow: true,
})
export class MyAlert {
  @Prop({ reflect: true }) variant: AlertVariant = 'default';
  @Prop() dismissible: boolean = false;
  @Event() myDismiss: EventEmitter<void>;

  @State() visible: boolean = true;

  private alertLogic: AlertReturn;

  componentWillLoad() {
    this.alertLogic = createAlert({
      variant: this.variant,
      dismissible: this.dismissible,
      defaultVisible: true,
      onDismiss: () => {
        this.myDismiss.emit();
      },
      onVisibilityChange: visible => {
        this.visible = visible;
      },
    });
  }

  @Watch('variant')
  variantHandler(newValue: AlertVariant) {
    this.alertLogic.actions.setVariant(newValue);
  }

  @Watch('dismissible')
  dismissibleHandler(newValue: boolean) {
    this.alertLogic.actions.setDismissible(newValue);
  }

  render() {
    if (!this.visible) return null;

    const alertProps = this.alertLogic.getAlertProps();
    const dismissButtonProps = this.alertLogic.getDismissButtonProps();

    return (
      <Host class={cn(alertVariants({ variant: this.variant }))} {...alertProps}>
        <slot name="icon"></slot>
        <div class="text-sm [&_p]:leading-relaxed">
          <slot></slot>
        </div>
        {this.dismissible && (
          <button
            class="absolute right-t-gap top-t-gap rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            onClick={() => this.alertLogic.actions.dismiss()}
            {...dismissButtonProps}
          >
            <and-icon name="close" class="h-4 w-4" />
            <span class="sr-only">Dismiss</span>
          </button>
        )}
      </Host>
    );
  }
}

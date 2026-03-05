import { Component, Prop, h, Host, State, Event, EventEmitter, Watch } from '@stencil/core';
import { cva } from 'class-variance-authority';
import { createAlert, type AlertVariant, type AlertReturn } from '@andersseen/headless-components';
import { cn } from '../../utils/cn';

/* ────────────────────────────────────────────────────────────────────
 * Variants
 * ──────────────────────────────────────────────────────────────────── */

const alertVariants = cva(
  [
    'relative w-full rounded-lg border p-t-gap',
    '[&>svg~*]:pl-t-gap-lg [&>svg+div]:translate-y-[-3px]',
    '[&>svg]:absolute [&>svg]:left-t-gap [&>svg]:top-t-gap [&>svg]:text-foreground',
  ].join(' '),
  {
    variants: {
      variant: {
        default: 'bg-background text-foreground border-border',
        destructive: 'border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive',
        success: 'border-success/50 text-success dark:border-success [&>svg]:text-success',
        warning: 'border-warning/50 text-warning dark:border-warning [&>svg]:text-warning',
        info: 'border-info/50 text-info dark:border-info [&>svg]:text-info',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

const dismissButtonClass = [
  'absolute right-t-gap top-t-gap rounded-sm opacity-70',
  'ring-offset-background transition-opacity',
  'hover:opacity-100',
  'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
].join(' ');

/* ────────────────────────────────────────────────────────────────────
 * Component
 * ──────────────────────────────────────────────────────────────────── */

@Component({
  tag: 'and-alert',
  styleUrls: ['and-alert.css', '../../global/global.css'],
  shadow: true,
})
export class AndAlert {
  /** Visual variant of the alert. */
  @Prop({ reflect: true }) variant: AlertVariant = 'default';

  /** Whether the alert can be dismissed. */
  @Prop({ reflect: true }) dismissible: boolean = false;

  /** Emitted when the alert is dismissed. */
  @Event({ bubbles: true, composed: true }) andDismiss: EventEmitter<void>;

  @State() private visible: boolean = true;

  private alertLogic: AlertReturn;

  /* ── Lifecycle ──────────────────────────────────────────────────── */

  componentWillLoad() {
    this.alertLogic = createAlert({
      variant: this.variant,
      dismissible: this.dismissible,
      defaultVisible: true,
      onDismiss: () => this.andDismiss.emit(),
      onVisibilityChange: (isVisible: boolean) => {
        this.visible = isVisible;
      },
    });
  }

  /* ── Watchers ───────────────────────────────────────────────────── */

  @Watch('variant')
  variantChanged(newValue: AlertVariant) {
    this.alertLogic.actions.setVariant(newValue);
  }

  @Watch('dismissible')
  dismissibleChanged(newValue: boolean) {
    this.alertLogic.actions.setDismissible(newValue);
  }

  /* ── Render ─────────────────────────────────────────────────────── */

  render() {
    if (!this.visible) return null;

    const alertProps = this.alertLogic.getAlertProps();
    const dismissButtonProps = this.alertLogic.getDismissButtonProps();

    return (
      <Host
        class={cn(alertVariants({ variant: this.variant }))}
        role="alert"
        {...alertProps}
      >
        <slot name="icon" />
        <div class="text-sm [&_p]:leading-relaxed">
          <slot />
        </div>
        {this.dismissible && (
          <button
            class={dismissButtonClass}
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

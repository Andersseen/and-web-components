import { Component, Prop, h, Host, State, Event, EventEmitter, Watch } from '@stencil/core';
import { createAlert, type AlertVariant, type AlertReturn } from '@andersseen/headless-components';
import { cn } from '../../utils/cn';
import { alertVariants, dismissButtonClass } from './and-alert-variants';

/**
 * Contextual message banner for feedback, warnings, or errors.
 *
 * Renders with `role="alert"` so assistive tech announces it as soon as it
 * mounts — don't use it for content that appears well before it's relevant,
 * since that triggers an announcement immediately on page load too.
 *
 * @example
 * ```html
 * <and-alert variant="destructive" dismissible="true">
 *   <and-icon slot="icon" name="alert-circle"></and-icon>
 *   Something went wrong with your request.
 * </and-alert>
 * ```
 */
@Component({
  tag: 'and-alert',
  styleUrls: ['and-alert.css', '../../global/component-base.css'],
  shadow: true,
})
export class AndAlert {
  /** Visual variant of the alert. */
  @Prop({ reflect: true }) variant: AlertVariant = 'default';

  /** Whether the alert can be dismissed. */
  @Prop({ reflect: true }) dismissible: boolean = false;

  /** Emitted when the alert is dismissed. */
  @Event({ bubbles: true, composed: true }) andDismiss!: EventEmitter<void>;

  @State() private visible: boolean = true;

  private alertLogic!: AlertReturn;

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
    if (!this.visible) {
      return null;
    }

    const alertProps = this.alertLogic.getAlertProps();
    const dismissButtonProps = this.alertLogic.getDismissButtonProps();

    return (
      <Host class={cn(alertVariants({ variant: this.variant }))} role="alert" {...alertProps}>
        <slot name="icon" />
        <div class="text-sm [&_p]:leading-relaxed">
          <slot />
        </div>
        {this.dismissible && (
          <button class={dismissButtonClass} onClick={() => this.alertLogic.actions.dismiss()} {...dismissButtonProps}>
            <and-icon name="close" class="h-4 w-4" />
            <span class="sr-only">Dismiss</span>
          </button>
        )}
      </Host>
    );
  }
}

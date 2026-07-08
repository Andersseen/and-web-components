import { Component, Host, h, Prop, State, Method, Element } from '@stencil/core';
import {
  createToastManager,
  type ToastPosition,
  type ToastType,
  type ToastManagerReturn,
  type ToastItem,
} from '@andersseen/headless-components';
import { cn } from '../../utils/cn';
import { applyGlobalAnimationFlag } from '../../utils/animation-config';
import { toastVariants, dismissButtonVariants, positionClasses } from './and-toast-variants';

/**
 * Toast notification host and manager. The container is a
 * `role="region"` + `aria-live="polite"` landmark; each toast is
 * `role="alert"` with `aria-live="assertive"` so it's announced
 * immediately. Call `present()` imperatively to show a toast — this
 * component renders no visible content until then.
 *
 * @example
 * ```html
 * <and-toast id="toaster" position="bottom-right"></and-toast>
 * <script>
 *   document.getElementById('toaster').present('Saved!', 'success');
 * </script>
 * ```
 */
@Component({
  tag: 'and-toast',
  styleUrls: ['and-toast.css', '../../global/component-base.css', '../../global/animations.css'],
  shadow: true,
})
export class AndToast {
  @Element() el!: HTMLElement;

  /** Position of the toast container on screen. */
  @Prop({ reflect: true }) position: ToastPosition = 'bottom-right';

  @State() private toasts: ToastItem[] = [];

  private toastManager!: ToastManagerReturn;

  /* ── Lifecycle ──────────────────────────────────────────────────── */

  componentWillLoad() {
    applyGlobalAnimationFlag(this.el);
    this.toastManager = createToastManager({
      position: this.position,
      onToastsChange: (toasts: ToastItem[]) => {
        this.toasts = toasts;
      },
    });
  }

  /* ── Public API ─────────────────────────────────────────────────── */

  /** Present a new toast notification. */
  @Method()
  async present(message: string, type: ToastType = 'default', duration: number = 3000): Promise<number> {
    return this.toastManager.actions.present(message, type, duration);
  }

  /* ── Lifecycle Cleanup ──────────────────────────────────────────── */

  disconnectedCallback() {
    // Clear all timers to prevent memory leaks
    this.toastManager.destroy();
  }

  /* ── Handlers ───────────────────────────────────────────────────── */

  private handleDismiss = (id: number) => {
    this.toastManager.actions.dismiss(id);
  };

  /* ── Render ─────────────────────────────────────────────────────── */

  render() {
    const containerProps = this.toastManager.getContainerProps();
    const dismissProps = this.toastManager.getDismissProps();
    const position = containerProps['data-position'];

    return (
      <Host class="block relative z-[100]">
        <div
          class={cn(
            'fixed z-[100] flex flex-col gap-t-gap-sm w-full max-w-md pointer-events-none',
            positionClasses[position],
          )}
          {...containerProps}
        >
          {this.toasts.map(toast => {
            const toastProps = this.toastManager.getToastProps(toast);
            return (
              <div key={toast.id} class={cn(toastVariants({ variant: toast.type }), 'and-toast-item')} {...toastProps}>
                <div class="text-sm font-medium opacity-90">{toast.message}</div>
                <button
                  class={cn(dismissButtonVariants())}
                  onClick={() => this.handleDismiss(toast.id)}
                  aria-label="Dismiss notification"
                  {...dismissProps}
                >
                  <and-icon name="close" size="16" />
                </button>
              </div>
            );
          })}
        </div>
      </Host>
    );
  }
}

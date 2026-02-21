import { Component, Host, h, State, Method, Element } from '@stencil/core';
import { cva } from 'class-variance-authority';
import { createToastManager, type ToastType, type ToastManagerReturn, type ToastItem } from '@andersseen/headless-components';
import { cn } from '../../utils/cn';
import { applyGlobalAnimationFlag } from '../../utils/animation-config';

/* ────────────────────────────────────────────────────────────────────
 * Variants
 * ──────────────────────────────────────────────────────────────────── */

const toastVariants = cva(
  [
    'pointer-events-auto flex w-full max-w-md items-center justify-between',
    'space-x-t-gap overflow-hidden rounded-md border p-t-gap shadow-lg transition-all',
  ].join(' '),
  {
    variants: {
      variant: {
        default: 'bg-background text-foreground border-border',
        destructive: 'bg-destructive text-destructive-foreground border-destructive',
        success: 'bg-background text-foreground border-success',
        error: 'bg-destructive text-destructive-foreground border-destructive',
        info: 'bg-background text-foreground border-info',
        warning: 'bg-background text-foreground border-warning',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

const dismissButtonClass = [
  'ml-auto inline-flex h-6 w-6 shrink-0 items-center justify-center',
  'rounded-md p-0.5 opacity-50 transition-opacity',
  'hover:opacity-100',
  'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
].join(' ');

/* ────────────────────────────────────────────────────────────────────
 * Component
 * ──────────────────────────────────────────────────────────────────── */

@Component({
  tag: 'and-toast',
  styleUrls: ['and-toast.css', '../../global/global.css'],
  shadow: true,
})
export class AndToast {
  @Element() el: HTMLElement;

  @State() private toasts: ToastItem[] = [];

  private toastManager: ToastManagerReturn;

  /* ── Lifecycle ──────────────────────────────────────────────────── */

  componentWillLoad() {
    applyGlobalAnimationFlag(this.el);
    this.toastManager = createToastManager({
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

  /* ── Handlers ───────────────────────────────────────────────────── */

  private handleDismiss = (id: number) => {
    this.toastManager.actions.dismiss(id);
  };

  /* ── Render ─────────────────────────────────────────────────────── */

  render() {
    const containerProps = this.toastManager.getContainerProps();
    const dismissProps = this.toastManager.getDismissProps();

    return (
      <Host class="block relative z-[100]">
        <div
          class="fixed bottom-t-gap right-t-gap z-[100] flex flex-col gap-t-gap-sm w-full max-w-md pointer-events-none"
          role="region"
          aria-label="Notifications"
          aria-live="polite"
          {...containerProps}
        >
          {this.toasts.map(toast => {
            const toastProps = this.toastManager.getToastProps(toast);
            return (
              <div
                key={toast.id}
                class={cn(
                  toastVariants({ variant: toast.type }),
                  'and-toast-item',
                )}
                role="alert"
                {...toastProps}
              >
                <div class="text-sm font-medium opacity-90">{toast.message}</div>
                <button
                  class={dismissButtonClass}
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

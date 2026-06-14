import { Component, Host, h, Prop, State, Method, Element } from '@stencil/core';
import { cva } from 'class-variance-authority';
import {
  createToastManager,
  type ToastPosition,
  type ToastType,
  type ToastManagerReturn,
  type ToastItem,
} from '@andersseen/headless-components';
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

const positionClasses: Record<ToastPosition, string> = {
  'top-right': 'top-t-gap right-t-gap items-end',
  'top-left': 'top-t-gap left-t-gap items-start',
  'bottom-right': 'bottom-t-gap right-t-gap items-end',
  'bottom-left': 'bottom-t-gap left-t-gap items-start',
  'top-center': 'top-t-gap left-1/2 -translate-x-1/2 items-center',
  'bottom-center': 'bottom-t-gap left-1/2 -translate-x-1/2 items-center',
};

/* ────────────────────────────────────────────────────────────────────
 * Component
 * ──────────────────────────────────────────────────────────────────── */

@Component({
  tag: 'and-toast',
  styleUrls: ['and-toast.css', '../../global/component-base.css', '../../global/animations.css'],
  shadow: true,
})
export class AndToast {
  @Element() el: HTMLElement;

  /** Position of the toast container on screen. */
  @Prop({ reflect: true }) position: ToastPosition = 'bottom-right';

  @State() private toasts: ToastItem[] = [];

  private toastManager: ToastManagerReturn;

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
              <div
                key={toast.id}
                class={cn(toastVariants({ variant: toast.type }), 'and-toast-item')}
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

import { Component, Host, h, State, Method, Element } from '@stencil/core';
import { cva } from 'class-variance-authority';
import { createToastManager, type ToastType } from '@andersseen/headless-components';
import { cn } from '../../utils/utils';

const toastVariants = cva(
  'pointer-events-auto flex w-full max-w-md items-center justify-between space-x-t-gap overflow-hidden rounded-md border p-t-gap shadow-lg transition-all',
  {
    variants: {
      variant: {
        default: 'bg-background text-foreground border-border',
        destructive: 'bg-destructive text-destructive-foreground border-destructive group-hover:bg-destructive group-hover:text-destructive-foreground',
        success: 'bg-background text-foreground border-border',
        error: 'bg-destructive text-destructive-foreground border-destructive',
        info: 'bg-background text-foreground border-border',
        warning: 'bg-background text-foreground border-border',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

@Component({
  tag: 'and-toast',
  styleUrls: ['and-toast.css', '../../global/global.css'],
  shadow: true,
})
export class MyToast {
  @Element() el: HTMLElement;

  @State() toasts: any[] = []; // Using any[] temporarily, ideally ToastItem[]

  private toastManager: any;

  componentWillLoad() {
    this.toastManager = createToastManager({
      onToastsChange: toasts => {
        this.toasts = toasts;
      },
    });
  }

  /**
   * Present a new toast
   */
  @Method()
  async present(message: string, type: ToastType = 'default', duration: number = 3000) {
    return this.toastManager.actions.present(message, type, duration);
  }

  dismiss(id: number) {
    this.toastManager.actions.dismiss(id);
  }

  render() {
    const containerProps = this.toastManager.getContainerProps();
    const dismissProps = this.toastManager.getDismissProps();

    return (
      <Host class="block relative z-[100]">
        <div class="fixed bottom-t-gap right-t-gap z-[100] flex flex-col gap-t-gap-sm w-full max-w-md pointer-events-none" {...containerProps}>
          {this.toasts.map(toast => {
            const toastProps = this.toastManager.getToastProps(toast);
            return (
              <div key={toast.id} class={cn(toastVariants({ variant: toast.type }), 'animate-in slide-in-from-right-full fade-in duration-300')} {...toastProps}>
                <div class="text-sm font-medium opacity-90">{toast.message}</div>
                <button
                  class="ml-auto inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md p-0.5 opacity-50 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-opacity"
                  onClick={() => this.dismiss(toast.id)}
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

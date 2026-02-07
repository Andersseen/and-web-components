import { Component, Host, h, State, Method, Element } from '@stencil/core';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

@Component({
  tag: 'my-toast',
  styleUrls: ['my-toast.css', '../../global/global.css'],
  shadow: true,
})
export class MyToast {
  @Element() el: HTMLElement;

  @State() toasts: Array<{ id: number; message: string; type: ToastType }> = [];

  /**
   * Present a new toast
   */
  @Method()
  async present(message: string, type: ToastType = 'info', duration: number = 3000) {
    const id = Date.now();
    this.toasts = [...this.toasts, { id, message, type }];

    setTimeout(() => {
      this.dismiss(id);
    }, duration);
  }

  dismiss(id: number) {
    this.toasts = this.toasts.filter(t => t.id !== id);
  }

  render() {
    return (
      <Host>
        <div class="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
          {this.toasts.map(toast => (
            <div
              key={toast.id}
              class={{
                'flex items-center w-full max-w-xs p-4 rounded-lg shadow dark:bg-gray-800 dark:text-gray-400': true,
                'text-green-500 bg-white': toast.type === 'success',
                'text-red-500 bg-white': toast.type === 'error',
                'text-blue-500 bg-white': toast.type === 'info',
                'text-orange-500 bg-white': toast.type === 'warning',
                'animate-slide-in': true,
              }}
              role="alert"
            >
              <div class="text-sm font-normal">{toast.message}</div>
              <button
                type="button"
                class="ml-auto -mx-1.5 -my-1.5 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 inline-flex items-center justify-center h-8 w-8 text-gray-500 hover:text-gray-900 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700"
                aria-label="Close"
                onClick={() => this.dismiss(toast.id)}
              >
                <my-icon name="close" class="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </Host>
    );
  }
}

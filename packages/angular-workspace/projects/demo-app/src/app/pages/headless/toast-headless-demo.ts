import { Component, signal, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  createToastManager,
  type ToastItem,
  type ToastType,
} from '@andersseen/headless-core';

@Component({
  selector: 'app-toast-headless-demo',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-4xl mx-auto pb-12">
      <header class="mb-10 border-b border-border pb-10">
        <h1 class="text-3xl font-bold tracking-tight text-foreground m-0">
          Toast / Notifications
        </h1>
        <p class="mt-4 text-lg text-muted-foreground max-w-2xl leading-relaxed">
          A succinct message displayed temporarily to provide feedback. Manages
          queue, auto-dismiss timers, and ARIA live region semantics.
        </p>
      </header>

      <section class="mb-12">
        <h2 class="text-xl font-semibold tracking-tight text-foreground mb-5">
          Preview
        </h2>
        <div
          class="rounded-xl border border-border bg-card overflow-hidden shadow-sm"
        >
          <div class="p-12 flex items-center justify-center min-h-[200px]">
            <div class="flex flex-wrap gap-3 justify-center">
              <button
                class="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium transition-opacity hover:opacity-90 cursor-pointer bg-secondary text-secondary-foreground border border-border"
                (click)="show('default')"
              >
                Default
              </button>
              <button
                class="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium transition-opacity hover:opacity-90 cursor-pointer bg-green-600 text-primary-foreground border-0"
                (click)="show('success')"
              >
                ✓ Success
              </button>
              <button
                class="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium transition-opacity hover:opacity-90 cursor-pointer bg-destructive text-destructive-foreground border-0"
                (click)="show('error')"
              >
                ✕ Error
              </button>
              <button
                class="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium transition-opacity hover:opacity-90 cursor-pointer bg-amber-500 text-primary-foreground border-0"
                (click)="show('warning')"
              >
                ⚠ Warning
              </button>
              <button
                class="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium transition-opacity hover:opacity-90 cursor-pointer bg-primary text-primary-foreground border-0"
                (click)="show('info')"
              >
                ℹ Info
              </button>
              <button
                class="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium transition-opacity hover:opacity-90 cursor-pointer bg-transparent text-muted-foreground border border-border"
                (click)="clearAll()"
              >
                Dismiss All
              </button>
            </div>
          </div>
        </div>

        <div
          class="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 w-full max-w-sm pointer-events-none"
          role="region"
          aria-label="Notifications"
          aria-live="polite"
        >
          @for (t of list(); track t.id) {
            <div
              [class]="
                'pointer-events-auto flex items-center gap-3 p-4 rounded-lg bg-card border border-border shadow-lg animate-in slide-in-from-right-full duration-300 ' +
                getToastClasses(t.type)
              "
              role="alert"
            >
              <span class="flex-1 text-sm font-medium">{{ t.message }}</span>
              <button
                class="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded border-0 bg-transparent text-current opacity-50 hover:opacity-100 cursor-pointer text-xs"
                (click)="remove(t.id)"
              >
                ✕
              </button>
            </div>
          }
        </div>
      </section>

      <section class="mb-12">
        <h2 class="text-xl font-semibold tracking-tight text-foreground mb-5">
          Usage
        </h2>
        <div
          class="rounded-xl bg-[#0a0a0a] border border-zinc-800 overflow-x-auto shadow-sm"
        >
          <pre
            class="m-0 p-5 font-mono text-[13px] leading-relaxed text-zinc-200"
          ><code>import {{ '{' }} createToastManager {{ '}' }} from '@andersseen/headless-core';

const toasts = createToastManager({{ '{' }}
    defaultDuration: 3000,
    maxToasts: 5,
    position: 'bottom-right'
{{ '}' }});

toasts.actions.present('Saved!', 'success');
toasts.actions.dismiss(id);
toasts.actions.dismissAll();
toasts.destroy();</code></pre>
        </div>
      </section>

      <section class="mb-12">
        <div class="flex items-center justify-between mb-2">
          <h2 class="text-xl font-semibold tracking-tight text-foreground m-0">
            Headless Implementation
          </h2>
          <span
            class="text-[11px] font-medium px-3 py-1 rounded-full bg-muted text-muted-foreground border border-border tracking-wide"
            >Zero Styles</span
          >
        </div>
        <p
          class="mt-4 text-lg text-muted-foreground max-w-2xl leading-relaxed mb-6"
        >
          The headless core manages the toast queue, timers, and auto-dismiss.
        </p>
        <div
          class="rounded-xl border-2 border-dashed border-border p-8 bg-muted/30"
        >
          <button (click)="showRaw()">Add Raw Toast</button>
          <button (click)="clearRaw()" style="margin-left:8px;">Clear</button>
          <div style="margin-top:12px;">
            @for (t of rawList(); track t.id) {
              <div
                style="padding:8px 12px;border:1px solid #999;margin-top:4px;display:flex;justify-content:space-between;background:white;"
              >
                <span>[{{ t.type }}] {{ t.message }}</span>
                <button (click)="removeRaw(t.id)">×</button>
              </div>
            }
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [],
})
export default class ToastHeadlessDemo implements OnDestroy {
  private _msgs: Record<ToastType, string> = {
    default: 'This is a notification',
    success: 'Changes saved successfully!',
    error: 'Something went wrong',
    warning: 'Please review your input',
    info: 'New update available',
  };
  private _n = 0;
  private _mgr = createToastManager({
    defaultDuration: 4000,
    maxToasts: 5,
    onToastsChange: (l) => this.list.set(l),
  });
  private _raw = createToastManager({
    defaultDuration: 5000,
    maxToasts: 3,
    onToastsChange: (l) => this.rawList.set(l),
  });

  list = signal<ToastItem[]>([]);
  rawList = signal<ToastItem[]>([]);

  show(type: ToastType) {
    this._mgr.actions.present(this._msgs[type], type);
  }

  getToastClasses(type: ToastType) {
    switch (type) {
      case 'success':
        return 'bg-green-50 text-green-900 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800';
      case 'error':
        return 'bg-red-50 text-red-900 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800';
      case 'warning':
        return 'bg-amber-50 text-amber-900 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800';
      case 'info':
        return 'bg-blue-50 text-blue-900 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800';
      default:
        return 'bg-card text-foreground border-border';
    }
  }

  remove(id: number) {
    this._mgr.actions.dismiss(id);
  }
  clearAll() {
    this._mgr.actions.dismissAll();
  }
  showRaw() {
    this._n++;
    this._raw.actions.present(`Raw toast #${this._n}`, 'default');
  }
  removeRaw(id: number) {
    this._raw.actions.dismiss(id);
  }
  clearRaw() {
    this._raw.actions.dismissAll();
  }

  ngOnDestroy() {
    this._mgr.destroy();
    this._raw.destroy();
  }
}

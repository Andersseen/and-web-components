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
    <div class="demo-page">
      <header class="demo-header">
        <h1 class="demo-title">Toast / Notifications</h1>
        <p class="demo-description">
          A succinct message displayed temporarily to provide feedback. Manages
          queue, auto-dismiss timers, and ARIA live region semantics.
        </p>
      </header>

      <section class="demo-section">
        <h2 class="section-title">Preview</h2>
        <div class="preview-card">
          <div class="preview-area">
            <div class="btn-grid">
              <button class="toast-btn default" (click)="show('default')">
                Default
              </button>
              <button class="toast-btn success" (click)="show('success')">
                ✓ Success
              </button>
              <button class="toast-btn error" (click)="show('error')">
                ✕ Error
              </button>
              <button class="toast-btn warning" (click)="show('warning')">
                ⚠ Warning
              </button>
              <button class="toast-btn info" (click)="show('info')">
                ℹ Info
              </button>
              <button class="toast-btn dismiss" (click)="clearAll()">
                Dismiss All
              </button>
            </div>
          </div>
        </div>

        <div
          class="toast-container"
          role="region"
          aria-label="Notifications"
          aria-live="polite"
        >
          @for (t of list(); track t.id) {
            <div [class]="'toast-item ' + t.type" role="alert">
              <span class="toast-message">{{ t.message }}</span>
              <button class="toast-x" (click)="remove(t.id)">✕</button>
            </div>
          }
        </div>
      </section>

      <section class="demo-section">
        <h2 class="section-title">Usage</h2>
        <div class="code-block">
          <pre><code>import {{ '{' }} createToastManager {{ '}' }} from '@andersseen/headless-core';

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

      <section class="demo-section">
        <div class="headless-header">
          <h2 class="section-title">Headless Implementation</h2>
          <span class="badge">Zero Styles</span>
        </div>
        <p class="demo-description" style="margin-bottom:1.5rem;">
          The headless core manages the toast queue, timers, and auto-dismiss.
        </p>
        <div class="headless-area">
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
  styles: [
    `
      .demo-page {
        max-width: 56rem;
        margin: 0 auto;
        padding-bottom: 3rem;
      }
      .demo-header {
        margin-bottom: 2.5rem;
        border-bottom: 1px solid hsl(var(--border));
        padding-bottom: 2.5rem;
      }
      .demo-title {
        font-size: 2rem;
        font-weight: 700;
        letter-spacing: -0.025em;
        color: hsl(var(--foreground));
        margin: 0;
      }
      .demo-description {
        margin-top: 1rem;
        font-size: 1.125rem;
        color: hsl(var(--muted-foreground));
        max-width: 42rem;
        line-height: 1.7;
      }
      .demo-section {
        margin-bottom: 3rem;
      }
      .section-title {
        font-size: 1.375rem;
        font-weight: 600;
        color: hsl(var(--foreground));
        margin: 0 0 1.25rem 0;
      }
      .preview-card {
        border-radius: 0.75rem;
        border: 1px solid hsl(var(--border));
        background: hsl(var(--card));
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
      }
      .preview-area {
        padding: 3rem;
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 200px;
      }
      .btn-grid {
        display: flex;
        flex-wrap: wrap;
        gap: 0.75rem;
        justify-content: center;
      }
      .toast-btn {
        display: inline-flex;
        align-items: center;
        border-radius: 0.375rem;
        font-size: 0.875rem;
        font-weight: 500;
        font-family: inherit;
        height: 2.5rem;
        padding: 0 1rem;
        border: 1px solid transparent;
        cursor: pointer;
        transition: opacity 0.15s;
      }
      .toast-btn.default {
        background: hsl(var(--secondary));
        color: hsl(var(--secondary-foreground));
        border-color: hsl(var(--border));
      }
      .toast-btn.success {
        background: hsl(142, 76%, 36%);
        color: white;
      }
      .toast-btn.error {
        background: hsl(var(--destructive));
        color: hsl(var(--destructive-foreground));
      }
      .toast-btn.warning {
        background: hsl(38, 92%, 50%);
        color: white;
      }
      .toast-btn.info {
        background: hsl(217, 91%, 60%);
        color: white;
      }
      .toast-btn.dismiss {
        background: transparent;
        color: hsl(var(--muted-foreground));
        border-color: hsl(var(--border));
      }
      .toast-btn:hover {
        opacity: 0.85;
      }
      .toast-container {
        position: fixed;
        bottom: 1rem;
        right: 1rem;
        z-index: 100;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        width: 100%;
        max-width: 24rem;
        pointer-events: none;
      }
      .toast-item {
        pointer-events: auto;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.875rem 1rem;
        border-radius: 0.5rem;
        border: 1px solid;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        animation: slideIn 0.3s ease;
        font-size: 0.875rem;
      }
      @keyframes slideIn {
        from {
          opacity: 0;
          transform: translateX(100%);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }
      .toast-item.default {
        background: hsl(var(--card));
        color: hsl(var(--foreground));
        border-color: hsl(var(--border));
      }
      .toast-item.success {
        background: hsl(142, 76%, 96%);
        color: hsl(142, 76%, 26%);
        border-color: hsl(142, 76%, 80%);
      }
      .toast-item.error {
        background: hsl(0, 84%, 96%);
        color: hsl(0, 84%, 32%);
        border-color: hsl(0, 84%, 80%);
      }
      .toast-item.warning {
        background: hsl(38, 92%, 96%);
        color: hsl(38, 70%, 30%);
        border-color: hsl(38, 92%, 75%);
      }
      .toast-item.info {
        background: hsl(217, 91%, 96%);
        color: hsl(217, 91%, 35%);
        border-color: hsl(217, 91%, 80%);
      }
      .toast-message {
        flex: 1;
        font-weight: 500;
      }
      .toast-x {
        flex-shrink: 0;
        width: 1.5rem;
        height: 1.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
        border: none;
        background: none;
        border-radius: 0.25rem;
        color: inherit;
        opacity: 0.5;
        cursor: pointer;
        font-size: 0.75rem;
      }
      .toast-x:hover {
        opacity: 1;
      }
      .code-block {
        border-radius: 0.75rem;
        background: #0a0a0a;
        border: 1px solid #27272a;
        overflow-x: auto;
      }
      .code-block pre {
        margin: 0;
        padding: 1.25rem 1.5rem;
        font-family: 'SF Mono', Menlo, Consolas, monospace;
        font-size: 0.8125rem;
        line-height: 1.7;
        color: #e4e4e7;
      }
      .headless-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 0.5rem;
      }
      .badge {
        font-size: 0.6875rem;
        font-weight: 500;
        padding: 0.25rem 0.75rem;
        border-radius: 9999px;
        background: hsl(var(--muted));
        color: hsl(var(--muted-foreground));
        border: 1px solid hsl(var(--border));
      }
      .headless-area {
        border-radius: 0.75rem;
        border: 2px dashed hsl(var(--border));
        padding: 2rem;
        background: hsl(var(--muted) / 0.3);
      }
    `,
  ],
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

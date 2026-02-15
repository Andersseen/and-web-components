import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { createAlert, type AlertVariant } from '@andersseen/headless-core';

@Component({
  selector: 'app-alert-headless-demo',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="demo-page">
      <header class="demo-header">
        <h1 class="demo-title">Alert</h1>
        <p class="demo-description">
          Displays a callout for user attention. Manages variants, dismissible
          state, and ARIA alert/status semantics based on urgency.
        </p>
      </header>

      <section class="demo-section">
        <h2 class="section-title">Preview</h2>
        <div class="preview-card">
          <div class="preview-area">
            <div class="alert-stack">
              @for (a of alerts; track a.name) {
                @if (a.instance.state.visible) {
                  <div
                    [class]="'alert alert--' + a.variant"
                    [attr.role]="
                      a.variant === 'destructive' || a.variant === 'warning'
                        ? 'alert'
                        : 'status'
                    "
                  >
                    <div class="alert-icon">{{ a.icon }}</div>
                    <div class="alert-content">
                      <div class="alert-title">{{ a.title }}</div>
                      <div class="alert-desc">{{ a.desc }}</div>
                    </div>
                    @if (a.dismissible) {
                      <button
                        class="alert-dismiss"
                        aria-label="Dismiss alert"
                        (click)="dismissAlert(a)"
                      >
                        ✕
                      </button>
                    }
                  </div>
                }
              }
              <button
                class="trigger-btn"
                (click)="resetAll()"
                style="margin-top:1rem;"
              >
                Reset All
              </button>
            </div>
          </div>
        </div>
      </section>

      <section class="demo-section">
        <h2 class="section-title">Usage</h2>
        <div class="code-block">
          <pre><code>import {{ '{' }} createAlert {{ '}' }} from '@andersseen/headless-core';

const alert = createAlert({{ '{' }}
    variant: 'destructive',
    dismissible: true,
    onDismiss: () => console.log('dismissed')
{{ '}' }});

// Get props
const props = alert.getAlertProps();
// => {{ '{' }} role: 'alert', 'aria-live': 'assertive', ... {{ '}' }}

alert.actions.dismiss();
alert.actions.show();
alert.actions.setVariant('success');</code></pre>
        </div>
      </section>

      <section class="demo-section">
        <div class="headless-header">
          <h2 class="section-title">Headless Implementation</h2>
          <span class="badge">Zero Styles</span>
        </div>
        <p class="demo-description" style="margin-bottom:1.5rem;">
          The headless core manages variant, visibility, and ARIA semantics.
        </p>
        <div class="headless-area">
          @if (rawVisible()) {
            <div
              role="alert"
              style="border:1px solid #999;padding:12px;margin-bottom:8px;display:flex;justify-content:space-between;align-items:center;background:white;"
            >
              <span>⚠ This is a raw headless alert</span>
              <button (click)="dismissRaw()">×</button>
            </div>
          } @else {
            <button (click)="showRaw()">Show Raw Alert</button>
          }
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
        padding: 2rem;
      }
      .alert-stack {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
      }
      .alert {
        display: flex;
        align-items: flex-start;
        gap: 0.75rem;
        padding: 1rem;
        border-radius: 0.5rem;
        border: 1px solid;
        font-size: 0.875rem;
        animation: fadeIn 0.2s ease;
      }
      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(-4px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      .alert--default {
        background: hsl(var(--card));
        color: hsl(var(--foreground));
        border-color: hsl(var(--border));
      }
      .alert--destructive {
        background: hsl(0, 84%, 96%);
        color: hsl(0, 84%, 32%);
        border-color: hsl(0, 84%, 80%);
      }
      .alert--success {
        background: hsl(142, 76%, 96%);
        color: hsl(142, 76%, 26%);
        border-color: hsl(142, 76%, 80%);
      }
      .alert--warning {
        background: hsl(38, 92%, 96%);
        color: hsl(38, 70%, 30%);
        border-color: hsl(38, 92%, 75%);
      }
      .alert--info {
        background: hsl(217, 91%, 96%);
        color: hsl(217, 91%, 35%);
        border-color: hsl(217, 91%, 80%);
      }
      .alert-icon {
        font-size: 1.125rem;
        flex-shrink: 0;
        margin-top: 0.125rem;
      }
      .alert-content {
        flex: 1;
      }
      .alert-title {
        font-weight: 600;
        margin-bottom: 0.25rem;
      }
      .alert-desc {
        opacity: 0.85;
        line-height: 1.5;
      }
      .alert-dismiss {
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
      .alert-dismiss:hover {
        opacity: 1;
      }
      .trigger-btn {
        display: inline-flex;
        align-items: center;
        border-radius: 0.375rem;
        font-size: 0.875rem;
        font-weight: 500;
        font-family: inherit;
        height: 2.5rem;
        padding: 0 1rem;
        background: transparent;
        color: hsl(var(--foreground));
        border: 1px solid hsl(var(--border));
        cursor: pointer;
      }
      .trigger-btn:hover {
        background: hsl(var(--accent));
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
export default class AlertHeadlessDemo {
  alerts = [
    {
      name: 'default',
      variant: 'default' as AlertVariant,
      dismissible: false,
      icon: '💬',
      title: 'Heads up!',
      desc: 'You can add components to your app using the CLI.',
      instance: createAlert({ variant: 'default' }),
    },
    {
      name: 'success',
      variant: 'success' as AlertVariant,
      dismissible: true,
      icon: '✓',
      title: 'Success',
      desc: 'Your changes have been saved successfully.',
      instance: createAlert({ variant: 'success', dismissible: true }),
    },
    {
      name: 'destructive',
      variant: 'destructive' as AlertVariant,
      dismissible: true,
      icon: '✕',
      title: 'Error',
      desc: 'Your session has expired. Please log in again.',
      instance: createAlert({ variant: 'destructive', dismissible: true }),
    },
    {
      name: 'warning',
      variant: 'warning' as AlertVariant,
      dismissible: true,
      icon: '⚠',
      title: 'Warning',
      desc: 'Your account is approaching its storage limit.',
      instance: createAlert({ variant: 'warning', dismissible: true }),
    },
    {
      name: 'info',
      variant: 'info' as AlertVariant,
      dismissible: false,
      icon: 'ℹ',
      title: 'Info',
      desc: 'A new software update is available for download.',
      instance: createAlert({ variant: 'info' }),
    },
  ];

  private _rawAlert = createAlert({ variant: 'warning', dismissible: true });
  rawVisible = signal(this._rawAlert.state.visible);

  dismissAlert(a: (typeof this.alerts)[0]) {
    a.instance.actions.dismiss();
  }

  resetAll() {
    this.alerts.forEach((a) => a.instance.actions.show());
  }

  dismissRaw() {
    this._rawAlert.actions.dismiss();
    this.rawVisible.set(this._rawAlert.state.visible);
  }
  showRaw() {
    this._rawAlert.actions.show();
    this.rawVisible.set(this._rawAlert.state.visible);
  }
}

import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { createAlert, type AlertVariant } from '@andersseen/headless-core';

@Component({
  selector: 'app-alert-headless-demo',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-4xl mx-auto pb-12">
      <header class="mb-10 border-b border-border pb-10">
        <h1 class="text-3xl font-bold tracking-tight text-foreground m-0">
          Alert
        </h1>
        <p class="mt-4 text-lg text-muted-foreground max-w-2xl leading-relaxed">
          Displays a callout for user attention. Manages variants, dismissible
          state, and ARIA alert/status semantics based on urgency.
        </p>
      </header>

      <section class="mb-12">
        <h2 class="text-xl font-semibold tracking-tight text-foreground mb-5">
          Preview
        </h2>
        <div class="rounded-xl border border-border bg-card shadow-sm">
          <div class="p-8">
            <div class="flex flex-col gap-3">
              @for (a of alerts; track a.name) {
                @if (a.instance.state.visible) {
                  <div
                    [class]="
                      'flex items-start gap-3 p-4 rounded-lg border text-sm animate-fade-in ' +
                      getVariantClasses(a.variant)
                    "
                    [attr.role]="
                      a.variant === 'destructive' || a.variant === 'warning'
                        ? 'alert'
                        : 'status'
                    "
                  >
                    <div class="text-lg shrink-0 mt-0.5">{{ a.icon }}</div>
                    <div class="flex-1">
                      <div class="font-semibold mb-1">{{ a.title }}</div>
                      <div class="opacity-90 leading-relaxed">{{ a.desc }}</div>
                    </div>
                    @if (a.dismissible) {
                      <button
                        class="shrink-0 w-6 h-6 flex items-center justify-center border-0 bg-transparent rounded text-inherit opacity-50 cursor-pointer text-xs hover:opacity-100 transition-opacity"
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
                class="inline-flex items-center rounded-md text-sm font-medium h-10 px-4 bg-transparent text-foreground border border-border cursor-pointer hover:bg-accent hover:text-accent-foreground mt-4 w-fit"
                (click)="resetAll()"
              >
                Reset All
              </button>
            </div>
          </div>
        </div>
      </section>

      <section class="mb-12">
        <h2 class="text-xl font-semibold tracking-tight text-foreground mb-5">
          Usage
        </h2>
        <div
          class="rounded-xl bg-primary-950 border border-primary-900 overflow-x-auto shadow-sm"
        >
          <pre
            class="m-0 p-5 font-mono text-[13px] leading-relaxed text-primary-200"
          ><code>import {{ '{' }} createAlert {{ '}' }} from '@andersseen/headless-core';

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
          The headless core manages variant, visibility, and ARIA semantics.
        </p>
        <div
          class="rounded-xl border-2 border-dashed border-border p-8 bg-muted/30"
        >
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
      .animate-fade-in {
        animation: fadeIn 0.2s ease;
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

  getVariantClasses(variant: string): string {
    switch (variant) {
      case 'destructive':
        return 'bg-destructive/10 text-destructive border-destructive/30 dark:bg-destructive/20 dark:text-destructive-foreground dark:border-destructive/40';
      case 'success':
        return 'bg-success/10 text-success border-success/30 dark:bg-success/20 dark:text-success-foreground dark:border-success/40';
      case 'warning':
        return 'bg-warning/10 text-warning border-warning/30 dark:bg-warning/20 dark:text-warning-foreground dark:border-warning/40';
      case 'info':
        return 'bg-info/10 text-info border-info/30 dark:bg-info/20 dark:text-info-foreground dark:border-info/40';
      default:
        return 'bg-card text-foreground border-border';
    }
  }

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

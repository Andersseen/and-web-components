import { DemoCodeBlockComponent } from '../../shared';
import { Component, ViewChild } from '@angular/core';
import { AndButton, AndToast } from '@angular-components/stencil-generated/components';

@Component({
  selector: 'app-toast-demo',
  imports: [AndToast, AndButton, DemoCodeBlockComponent],
  template: `
    <div class="max-w-4xl mx-auto pb-12">
      <!-- Header -->
      <header class="mb-10 border-b border-border pb-10">
        <h1 class="text-3xl font-bold tracking-tight text-foreground m-0">Toast</h1>
        <p class="mt-4 text-lg text-muted-foreground max-w-2xl leading-relaxed">
          Temporary, non-intrusive notification messages. Toasts appear briefly to confirm actions or surface
          information without blocking the user.
        </p>
      </header>

      <!-- Preview Section -->
      <section class="mb-12">
        <h2 class="text-xl font-semibold tracking-tight text-foreground mb-5">Preview</h2>
        <div class="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
          <div class="p-10 flex flex-col items-center justify-center gap-6 min-h-[180px]">
            <p class="text-sm text-muted-foreground m-0">Trigger different toast variants</p>
            <div class="flex flex-wrap gap-3 justify-center">
              <and-button (click)="showToast('default')"> Default </and-button>
              <and-button variant="outline" (click)="showToast('success')"> Success </and-button>
              <and-button variant="destructive" (click)="showToast('error')"> Error </and-button>
            </div>
          </div>
        </div>
      </section>

      <and-toast #toast></and-toast>

      <!-- Variants -->
      <section class="mb-12">
        <h2 class="text-xl font-semibold tracking-tight text-foreground mb-5">Variants</h2>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div class="rounded-xl border border-border bg-card p-5">
            <span
              class="text-[11px] font-medium px-2.5 py-1 rounded-full bg-muted text-muted-foreground border border-border tracking-wide mb-3 inline-block"
              >default</span
            >
            <p class="text-sm text-muted-foreground m-0 leading-relaxed">
              General notifications and informational messages.
            </p>
          </div>
          <div class="rounded-xl border border-border bg-card p-5">
            <span
              class="text-[11px] font-medium px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 tracking-wide mb-3 inline-block"
              >success</span
            >
            <p class="text-sm text-muted-foreground m-0 leading-relaxed">
              Confirm successful operations like saves or updates.
            </p>
          </div>
          <div class="rounded-xl border border-border bg-card p-5">
            <span
              class="text-[11px] font-medium px-2.5 py-1 rounded-full bg-destructive/10 text-destructive border border-destructive/20 tracking-wide mb-3 inline-block"
              >error</span
            >
            <p class="text-sm text-muted-foreground m-0 leading-relaxed">
              Surface errors that don't need full-page handling.
            </p>
          </div>
        </div>
      </section>

      <!-- Usage Code -->
      <section>
        <h2 class="text-xl font-semibold tracking-tight text-foreground mb-5">Usage</h2>
        <demo-code-block label="Template" [code]="templateCode" />
        <demo-code-block label="Component" [code]="componentCode" />
      </section>
    </div>
  `,
})
export default class ToastDemo {
  @ViewChild('toast') toastElement!: AndToast;

  async showToast(type: string = 'default') {
    const messages: Record<string, string> = {
      default: 'This is an informational notification.',
      success: 'Changes saved successfully!',
      error: 'Something went wrong. Please try again.',
    };
    if (this.toastElement) {
      await this.toastElement.present(messages[type] || messages['default'], type as any);
    }
  }

  templateCode = `<and-button (click)="showToast()">Show Toast</and-button>
<and-toast #toast></and-toast>`;
  componentCode = `&#64;ViewChild('toast') toast!: AndToast;

async showToast() {{ '{' }}
  await this.toast.present('Message!', 'success');
{{ '}' }}`;
}

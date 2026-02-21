import { Component, signal } from '@angular/core';
import {
  AndButton,
  AndModal,
} from '@angular-components/stencil-generated/components';

@Component({
  selector: 'app-modal-demo',
  imports: [AndButton, AndModal],
  template: `
    <div class="max-w-4xl mx-auto pb-12">
      <!-- Header -->
      <header class="mb-10 border-b border-border pb-10">
        <h1 class="text-3xl font-bold tracking-tight text-foreground m-0">
          Modal
        </h1>
        <p class="mt-4 text-lg text-muted-foreground max-w-2xl leading-relaxed">
          A dialog overlay that demands user attention. Use modals for
          confirmations, forms, or any content that requires a focused
          interaction.
        </p>
      </header>

      <!-- Preview Section -->
      <section class="mb-12">
        <h2 class="text-xl font-semibold tracking-tight text-foreground mb-5">
          Preview
        </h2>
        <div
          class="rounded-xl border border-border bg-card overflow-hidden shadow-sm"
        >
          <div
            class="p-10 flex flex-col items-center justify-center gap-6 min-h-[180px]"
          >
            <p class="text-sm text-muted-foreground m-0">
              Trigger a modal dialog
            </p>
            <div class="flex gap-3">
              <and-button (click)="openDefault()">Open Modal</and-button>
              <and-button variant="destructive" (click)="openConfirm()">
                Delete Item
              </and-button>
            </div>
          </div>
        </div>
      </section>

      <!-- Default Modal -->
      <and-modal [open]="defaultOpen()" (myClose)="defaultOpen.set(false)">
        <h3 class="mt-0 text-lg font-semibold text-foreground">
          Modal Title
        </h3>
        <p class="text-sm text-muted-foreground leading-relaxed">
          This modal demonstrates the default behavior. It traps focus inside,
          closes on backdrop click, and supports the Escape key.
        </p>
        <div class="flex justify-end gap-2 mt-6">
          <and-button variant="ghost" (click)="defaultOpen.set(false)">
            Cancel
          </and-button>
          <and-button (click)="defaultOpen.set(false)">Continue</and-button>
        </div>
      </and-modal>

      <!-- Confirm Modal -->
      <and-modal [open]="confirmOpen()" (myClose)="confirmOpen.set(false)">
        <h3 class="mt-0 text-lg font-semibold text-foreground">
          Are you sure?
        </h3>
        <p class="text-sm text-muted-foreground leading-relaxed">
          This action cannot be undone. The item will be permanently deleted
          from your account.
        </p>
        <div class="flex justify-end gap-2 mt-6">
          <and-button variant="ghost" (click)="confirmOpen.set(false)">
            Cancel
          </and-button>
          <and-button variant="destructive" (click)="confirmOpen.set(false)">
            Delete
          </and-button>
        </div>
      </and-modal>

      <!-- Use Cases -->
      <section class="mb-12">
        <h2 class="text-xl font-semibold tracking-tight text-foreground mb-5">
          Common Patterns
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div class="rounded-xl border border-border bg-card p-5">
            <h3 class="text-sm font-semibold text-foreground mb-2">
              Confirmation
            </h3>
            <p class="text-sm text-muted-foreground m-0 leading-relaxed">
              Destructive actions, irreversible operations, account changes.
            </p>
          </div>
          <div class="rounded-xl border border-border bg-card p-5">
            <h3 class="text-sm font-semibold text-foreground mb-2">
              Forms
            </h3>
            <p class="text-sm text-muted-foreground m-0 leading-relaxed">
              Quick edits, new item creation, settings within context.
            </p>
          </div>
          <div class="rounded-xl border border-border bg-card p-5">
            <h3 class="text-sm font-semibold text-foreground mb-2">
              Information
            </h3>
            <p class="text-sm text-muted-foreground m-0 leading-relaxed">
              Detail views, previews, contextual help content.
            </p>
          </div>
        </div>
      </section>

      <!-- Usage Code -->
      <section>
        <h2 class="text-xl font-semibold tracking-tight text-foreground mb-5">
          Usage
        </h2>
        <div class="rounded-xl border border-border overflow-x-auto shadow-sm">
          <div class="bg-muted/50 px-5 py-3 border-b border-border">
            <span
              class="text-xs font-medium text-muted-foreground tracking-wide uppercase"
              >Template</span
            >
          </div>
          <pre
            class="m-0 p-5 font-mono text-[13px] leading-relaxed text-foreground/80 bg-muted/20"
          ><code>&lt;and-button (click)="isOpen = true"&gt;Open Modal&lt;/and-button&gt;

&lt;and-modal [open]="isOpen" (myClose)="isOpen = false"&gt;
  &lt;h3&gt;Title&lt;/h3&gt;
  &lt;p&gt;Modal content goes here.&lt;/p&gt;
  &lt;and-button (click)="isOpen = false"&gt;Close&lt;/and-button&gt;
&lt;/and-modal&gt;</code></pre>
        </div>
      </section>
    </div>
  `,
})
export default class ModalDemo {
  defaultOpen = signal(false);
  confirmOpen = signal(false);

  openDefault() {
    this.defaultOpen.set(true);
  }

  openConfirm() {
    this.confirmOpen.set(true);
  }
}

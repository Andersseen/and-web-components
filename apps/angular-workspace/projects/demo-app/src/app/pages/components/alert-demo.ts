import { Component } from '@angular/core';
import {
  AndAlert,
  AndIcon,
} from '@angular-components/stencil-generated/components';

@Component({
  selector: 'app-alert-demo',
  imports: [AndAlert, AndIcon],
  template: `
    <div class="max-w-4xl mx-auto pb-12">
      <!-- Header -->
      <header class="mb-10 border-b border-border pb-10">
        <h1 class="text-3xl font-bold tracking-tight text-foreground m-0">
          Alert
        </h1>
        <p class="mt-4 text-lg text-muted-foreground max-w-2xl leading-relaxed">
          Display important messages, warnings, or contextual feedback to users.
          Supports multiple variants and optional dismiss actions.
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
          <div class="p-8 flex flex-col gap-4">
            <and-alert variant="default">
              <and-icon slot="icon" name="info" size="18"></and-icon>
              <strong>Heads up!</strong> This is a default informational alert.
            </and-alert>

            <and-alert variant="destructive">
              <and-icon slot="icon" name="alert-circle" size="18"></and-icon>
              <strong>Error!</strong> Something went wrong with your request.
            </and-alert>

            <and-alert variant="default" dismissible>
              <and-icon slot="icon" name="info" size="18"></and-icon>
              This alert can be dismissed. Click the close button to hide it.
            </and-alert>
          </div>
        </div>
      </section>

      <!-- Variants -->
      <section class="mb-12">
        <h2 class="text-xl font-semibold tracking-tight text-foreground mb-5">
          Variants
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="rounded-xl border border-border bg-card p-5">
            <span
              class="text-[11px] font-medium px-2.5 py-1 rounded-full bg-muted text-muted-foreground border border-border tracking-wide mb-3 inline-block"
              >default</span
            >
            <p class="text-sm text-muted-foreground m-0 leading-relaxed">
              Standard informational alert for general messages.
            </p>
          </div>
          <div class="rounded-xl border border-border bg-card p-5">
            <span
              class="text-[11px] font-medium px-2.5 py-1 rounded-full bg-destructive/10 text-destructive border border-destructive/20 tracking-wide mb-3 inline-block"
              >destructive</span
            >
            <p class="text-sm text-muted-foreground m-0 leading-relaxed">
              Critical or error messages that require attention.
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
          ><code>&lt;and-alert variant="default"&gt;
  &lt;and-icon slot="icon" name="info" size="18"&gt;&lt;/and-icon&gt;
  This is a default alert message.
&lt;/and-alert&gt;

&lt;and-alert variant="destructive" dismissible&gt;
  &lt;and-icon slot="icon" name="alert-circle" size="18"&gt;&lt;/and-icon&gt;
  This alert can be dismissed.
&lt;/and-alert&gt;</code></pre>
        </div>
      </section>
    </div>
  `,
})
export default class AlertDemo {}

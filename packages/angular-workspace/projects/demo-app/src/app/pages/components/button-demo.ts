import { Component, signal } from '@angular/core';
import { AndButton } from '@angular-components/stencil-generated/components';

@Component({
  selector: 'app-button-demo',
  imports: [AndButton],
  template: `
    <div class="max-w-4xl mx-auto pb-12">
      <!-- Header -->
      <header class="mb-10 border-b border-border pb-10">
        <h1 class="text-3xl font-bold tracking-tight text-foreground m-0">
          Button
        </h1>
        <p class="mt-4 text-lg text-muted-foreground max-w-2xl leading-relaxed">
          Interactive button component with multiple variants, sizes, and
          states. Designed for consistent interactions across your application.
        </p>
      </header>

      <!-- Variants Preview -->
      <section class="mb-12">
        <h2 class="text-xl font-semibold tracking-tight text-foreground mb-5">
          Variants
        </h2>
        <div
          class="rounded-xl border border-border bg-card overflow-hidden shadow-sm"
        >
          <div
            class="p-10 flex flex-wrap items-center justify-center gap-3 min-h-[160px]"
          >
            <and-button variant="default">Default</and-button>
            <and-button variant="destructive">Destructive</and-button>
            <and-button variant="outline">Outline</and-button>
            <and-button variant="secondary">Secondary</and-button>
            <and-button variant="ghost">Ghost</and-button>
            <and-button variant="link">Link</and-button>
          </div>
        </div>
      </section>

      <!-- Sizes Preview -->
      <section class="mb-12">
        <h2 class="text-xl font-semibold tracking-tight text-foreground mb-5">
          Sizes
        </h2>
        <div
          class="rounded-xl border border-border bg-card overflow-hidden shadow-sm"
        >
          <div
            class="p-10 flex flex-wrap items-center justify-center gap-4 min-h-[120px]"
          >
            <and-button size="sm">Small</and-button>
            <and-button size="default">Default</and-button>
            <and-button size="lg">Large</and-button>
            <and-button size="icon">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path
                  d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                />
              </svg>
            </and-button>
          </div>
        </div>
      </section>

      <!-- Interactive -->
      <section class="mb-12">
        <h2 class="text-xl font-semibold tracking-tight text-foreground mb-5">
          Interactive
        </h2>
        <div
          class="rounded-xl border border-border bg-card overflow-hidden shadow-sm"
        >
          <div
            class="p-10 flex flex-col items-center justify-center gap-4 min-h-[140px]"
          >
            <div class="flex gap-3">
              <and-button
                variant="default"
                (click)="handleClick()"
              >
                Click Me
              </and-button>
              <and-button variant="outline" (click)="resetCount()">
                Reset
              </and-button>
            </div>
            @if (clickCount() > 0) {
              <p class="text-sm text-muted-foreground m-0">
                Clicked
                <span class="font-semibold text-foreground">{{
                  clickCount()
                }}</span>
                {{ clickCount() === 1 ? 'time' : 'times' }}
              </p>
            }
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
          ><code>&lt;!-- Variants --&gt;
&lt;and-button variant="default"&gt;Default&lt;/and-button&gt;
&lt;and-button variant="destructive"&gt;Destructive&lt;/and-button&gt;
&lt;and-button variant="outline"&gt;Outline&lt;/and-button&gt;
&lt;and-button variant="secondary"&gt;Secondary&lt;/and-button&gt;
&lt;and-button variant="ghost"&gt;Ghost&lt;/and-button&gt;
&lt;and-button variant="link"&gt;Link&lt;/and-button&gt;

&lt;!-- Sizes --&gt;
&lt;and-button size="sm"&gt;Small&lt;/and-button&gt;
&lt;and-button size="default"&gt;Default&lt;/and-button&gt;
&lt;and-button size="lg"&gt;Large&lt;/and-button&gt;
&lt;and-button size="icon"&gt;🚀&lt;/and-button&gt;</code></pre>
        </div>
      </section>
    </div>
  `,
})
export default class ButtonDemo {
  clickCount = signal(0);

  handleClick() {
    this.clickCount.update((c) => c + 1);
  }

  resetCount() {
    this.clickCount.set(0);
  }
}

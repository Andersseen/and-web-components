import { Component, CUSTOM_ELEMENTS_SCHEMA, signal } from '@angular/core';

@Component({
  selector: 'app-vanilla-button-demo',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <div class="max-w-4xl mx-auto pb-12">
      <header class="mb-10 border-b border-border pb-10">
        <h1 class="text-3xl font-bold tracking-tight text-foreground m-0">Vanilla Button</h1>
        <p class="mt-4 text-lg text-muted-foreground max-w-2xl leading-relaxed">
          Native custom element backed by the headless button state machine.
        </p>
      </header>

      <section class="mb-12">
        <h2 class="text-xl font-semibold tracking-tight text-foreground mb-5">Variants & sizes</h2>
        <div class="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
          <div class="p-10 flex flex-wrap items-center justify-center gap-3 min-h-[160px]">
            <and-vanilla-button variant="default">Default</and-vanilla-button>
            <and-vanilla-button variant="primary">Primary</and-vanilla-button>
            <and-vanilla-button variant="secondary">Secondary</and-vanilla-button>
            <and-vanilla-button variant="ghost">Ghost</and-vanilla-button>
            <and-vanilla-button variant="outline">Outline</and-vanilla-button>
          </div>
        </div>
      </section>

      <section class="mb-12">
        <h2 class="text-xl font-semibold tracking-tight text-foreground mb-5">Animated tap</h2>
        <div class="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
          <div class="p-10 flex flex-col items-center justify-center gap-4 min-h-[140px]">
            <and-vanilla-button animated (click)="increment()">Click me</and-vanilla-button>
            @if (count() > 0) {
              <p class="text-sm text-muted-foreground m-0">
                Clicked <span class="font-semibold text-foreground">{{ count() }}</span>
                {{ count() === 1 ? 'time' : 'times' }}
              </p>
            }
          </div>
        </div>
      </section>

      <section>
        <h2 class="text-xl font-semibold tracking-tight text-foreground mb-5">Usage</h2>
        <div class="rounded-xl border border-border overflow-x-auto shadow-sm">
          <div class="bg-muted/50 px-5 py-3 border-b border-border">
            <span class="text-xs font-medium text-muted-foreground tracking-wide uppercase">Template</span>
          </div>
          <pre
            class="m-0 p-5 font-mono text-[13px] leading-relaxed text-foreground/80 bg-muted/20"
          ><code>&lt;and-vanilla-button variant="primary" size="lg" animated&gt;
  Click me
&lt;/and-vanilla-button&gt;

&lt;and-vanilla-button disabled&gt;Disabled&lt;/and-vanilla-button&gt;</code></pre>
        </div>
      </section>
    </div>
  `,
})
export default class VanillaButtonDemoComponent {
  count = signal(0);

  increment() {
    this.count.update(c => c + 1);
  }
}

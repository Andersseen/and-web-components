import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-vanilla-overview',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <div class="max-w-4xl mx-auto pb-12">
      <header class="mb-10 border-b border-border pb-10">
        <h1 class="text-3xl font-bold tracking-tight text-foreground m-0">Vanilla Components</h1>
        <p class="mt-4 text-lg text-muted-foreground max-w-2xl leading-relaxed">
          Framework-agnostic custom elements with zero production dependencies. Add
          <code class="text-sm bg-muted px-1.5 py-0.5 rounded">@andersseen/motion</code>
          only if you want animations. Use them anywhere HTML runs.
        </p>
      </header>

      <section class="mb-12">
        <h2 class="text-xl font-semibold tracking-tight text-foreground mb-5">Installation</h2>
        <div class="rounded-xl border border-border overflow-x-auto shadow-sm">
          <div class="bg-muted/50 px-5 py-3 border-b border-border">
            <span class="text-xs font-medium text-muted-foreground tracking-wide uppercase">npm</span>
          </div>
          <pre
            class="m-0 p-5 font-mono text-[13px] leading-relaxed text-foreground/80 bg-muted/20"
          ><code>npm install @andersseen/vanilla-components
# optional, for animations:
npm install @andersseen/motion</code></pre>
        </div>
      </section>

      <section class="mb-12">
        <h2 class="text-xl font-semibold tracking-tight text-foreground mb-5">Usage</h2>
        <div class="rounded-xl border border-border overflow-x-auto shadow-sm">
          <div class="bg-muted/50 px-5 py-3 border-b border-border">
            <span class="text-xs font-medium text-muted-foreground tracking-wide uppercase">TypeScript</span>
          </div>
          <pre
            class="m-0 p-5 font-mono text-[13px] leading-relaxed text-foreground/80 bg-muted/20"
          ><code>import '@andersseen/vanilla-components';
import '@andersseen/vanilla-components/style.css';
# optional, for animations:
import '@andersseen/motion/style.css';

&lt;and-vanilla-button variant="default" animated&gt;Click me&lt;/and-vanilla-button&gt;</code></pre>
        </div>
      </section>

      <section>
        <h2 class="text-xl font-semibold tracking-tight text-foreground mb-5">Available components</h2>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          @for (item of items; track item.id) {
            <div class="rounded-xl border border-border bg-card p-5 shadow-sm">
              <h3 class="text-lg font-semibold text-foreground m-0">{{ item.label }}</h3>
              <p class="text-sm text-muted-foreground mt-2 m-0">{{ item.description }}</p>
            </div>
          }
        </div>
      </section>
    </div>
  `,
})
export default class VanillaOverviewComponent {
  readonly items = [
    {
      id: 'button',
      label: 'Button',
      description: 'Accessible button with variants, sizes, disabled state and animated tap feedback.',
    },
    {
      id: 'modal',
      label: 'Modal',
      description: 'Open/close modal with overlay, focus management and optional motion animations.',
    },
    {
      id: 'accordion',
      label: 'Accordion',
      description: 'Single or multi-expand accordion with keyboard support and open/close animations.',
    },
  ];
}

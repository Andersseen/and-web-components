import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-vanilla-accordion-demo',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <div class="max-w-4xl mx-auto pb-12">
      <header class="mb-10 border-b border-border pb-10">
        <h1 class="text-3xl font-bold tracking-tight text-foreground m-0">Vanilla Accordion</h1>
        <p class="mt-4 text-lg text-muted-foreground max-w-2xl leading-relaxed">
          Native custom element accordion with single or multi-expand modes and motion support.
        </p>
      </header>

      <section class="mb-12">
        <h2 class="text-xl font-semibold tracking-tight text-foreground mb-5">Single expand</h2>
        <div class="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
          <div class="p-6">
            <and-vanilla-accordion animated>
              <div title="Is it accessible?" value="a11y">
                Yes. The accordion uses native buttons with proper aria-expanded and aria-controls attributes.
              </div>
              <div title="Can I animate it?" value="motion">
                Yes. Add the <code>animated</code> attribute to fade items in and out as they open/close.
              </div>
              <div title="Is it framework-agnostic?" value="framework">
                Absolutely. It works in Angular, React, Vue, Svelte, or plain HTML.
              </div>
            </and-vanilla-accordion>
          </div>
        </div>
      </section>

      <section class="mb-12">
        <h2 class="text-xl font-semibold tracking-tight text-foreground mb-5">Multiple expand</h2>
        <div class="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
          <div class="p-6">
            <and-vanilla-accordion allow-multiple animated>
              <div title="First item" value="first">Content for the first item.</div>
              <div title="Second item" value="second">Content for the second item.</div>
              <div title="Third item" value="third">Content for the third item.</div>
            </and-vanilla-accordion>
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
          ><code>&lt;and-vanilla-accordion allow-multiple animated&gt;
  &lt;div title="Item 1" value="item-1"&gt;Content 1&lt;/div&gt;
  &lt;div title="Item 2" value="item-2"&gt;Content 2&lt;/div&gt;
&lt;/and-vanilla-accordion&gt;</code></pre>
        </div>
      </section>
    </div>
  `,
})
export default class VanillaAccordionDemoComponent {}

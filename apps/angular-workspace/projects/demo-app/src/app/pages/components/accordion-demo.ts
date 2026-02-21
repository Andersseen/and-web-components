import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  AndAccordion,
  AndAccordionItem,
  AndAccordionTrigger,
  AndAccordionContent,
} from '@angular-components/stencil-generated/components';

@Component({
  selector: 'app-accordion-demo',
  imports: [
    AndAccordion,
    AndAccordionItem,
    AndAccordionTrigger,
    AndAccordionContent,
    FormsModule,
  ],
  template: `
    <div class="max-w-4xl mx-auto pb-12">
      <!-- Header -->
      <header class="mb-10 border-b border-border pb-10">
        <h1 class="text-3xl font-bold tracking-tight text-foreground m-0">
          Accordion
        </h1>
        <p class="mt-4 text-lg text-muted-foreground max-w-2xl leading-relaxed">
          Collapsible content panels for organizing and revealing information
          progressively. Built on the headless core with full keyboard
          navigation and ARIA support.
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
          <div class="border-b border-border bg-muted/50 px-6 py-4 flex gap-6">
            <label
              class="flex items-center gap-2 text-sm text-foreground cursor-pointer select-none"
            >
              <input
                type="checkbox"
                class="accent-primary"
                [ngModel]="allowMultiple()"
                (ngModelChange)="allowMultiple.set($event)"
              />
              Allow Multiple
            </label>
            <label
              class="flex items-center gap-2 text-sm text-foreground cursor-pointer select-none"
            >
              <input
                type="checkbox"
                class="accent-primary"
                [ngModel]="disabled()"
                (ngModelChange)="disabled.set($event)"
              />
              Disabled
            </label>
          </div>

          <div class="p-8">
            <div class="max-w-xl mx-auto">
              <and-accordion
                [allowMultiple]="allowMultiple()"
                [disabled]="disabled()"
              >
                <and-accordion-item value="item-1">
                  <and-accordion-trigger
                    >What is Stencil?</and-accordion-trigger
                  >
                  <and-accordion-content>
                    Stencil is a compiler that generates Web Components
                    (specifically, Custom Elements). It combines the best
                    concepts of the most popular frameworks into a simple
                    build-time tool.
                  </and-accordion-content>
                </and-accordion-item>
                <and-accordion-item value="item-2">
                  <and-accordion-trigger
                    >Why use Web Components?</and-accordion-trigger
                  >
                  <and-accordion-content>
                    Web Components are a set of web platform APIs that allow you
                    to create new custom, reusable, encapsulated HTML tags for
                    use in web pages and web apps. They work across frameworks.
                  </and-accordion-content>
                </and-accordion-item>
                <and-accordion-item value="item-3">
                  <and-accordion-trigger
                    >How does it integrate with Angular?</and-accordion-trigger
                  >
                  <and-accordion-content>
                    Stencil generates Angular-specific wrappers that provide
                    type-safe bindings, proper event handling, and seamless
                    integration with Angular's change detection.
                  </and-accordion-content>
                </and-accordion-item>
              </and-accordion>
            </div>
          </div>
        </div>
      </section>

      <!-- Usage Code -->
      <section class="mb-12">
        <h2 class="text-xl font-semibold tracking-tight text-foreground mb-5">
          Usage
        </h2>
        <div
          class="rounded-xl border border-border overflow-x-auto shadow-sm"
        >
          <div class="bg-muted/50 px-5 py-3 border-b border-border">
            <span
              class="text-xs font-medium text-muted-foreground tracking-wide uppercase"
              >Template</span
            >
          </div>
          <pre
            class="m-0 p-5 font-mono text-[13px] leading-relaxed text-foreground/80 bg-muted/20"
          ><code>&lt;and-accordion [allowMultiple]="true"&gt;
  &lt;and-accordion-item value="item-1"&gt;
    &lt;and-accordion-trigger&gt;Section Title&lt;/and-accordion-trigger&gt;
    &lt;and-accordion-content&gt;
      Content goes here...
    &lt;/and-accordion-content&gt;
  &lt;/and-accordion-item&gt;
&lt;/and-accordion&gt;</code></pre>
        </div>
      </section>

      <!-- Features -->
      <section>
        <h2 class="text-xl font-semibold tracking-tight text-foreground mb-5">
          Features
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div class="rounded-xl border border-border bg-card p-5">
            <h3 class="text-sm font-semibold text-foreground mb-2">
              Multi-expand
            </h3>
            <p class="text-sm text-muted-foreground m-0 leading-relaxed">
              Optionally allow multiple panels to be open simultaneously.
            </p>
          </div>
          <div class="rounded-xl border border-border bg-card p-5">
            <h3 class="text-sm font-semibold text-foreground mb-2">
              Keyboard Nav
            </h3>
            <p class="text-sm text-muted-foreground m-0 leading-relaxed">
              Full arrow key navigation and Home/End key support.
            </p>
          </div>
          <div class="rounded-xl border border-border bg-card p-5">
            <h3 class="text-sm font-semibold text-foreground mb-2">
              Accessible
            </h3>
            <p class="text-sm text-muted-foreground m-0 leading-relaxed">
              WAI-ARIA compliant with proper roles and attributes.
            </p>
          </div>
        </div>
      </section>
    </div>
  `,
})
export default class AccordionDemo {
  allowMultiple = signal(false);
  disabled = signal(false);
}

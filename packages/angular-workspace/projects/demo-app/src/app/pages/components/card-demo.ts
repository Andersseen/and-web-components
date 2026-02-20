import { Component } from '@angular/core';
import { AndCard } from '@angular-components/stencil-generated/components';

@Component({
  selector: 'app-card-demo',
  imports: [AndCard],
  template: `
    <div class="max-w-4xl mx-auto pb-12">
      <!-- Header -->
      <header class="mb-10 border-b border-border pb-10">
        <h1 class="text-3xl font-bold tracking-tight text-foreground m-0">
          Card
        </h1>
        <p class="mt-4 text-lg text-muted-foreground max-w-2xl leading-relaxed">
          Flexible container for grouping related content and actions. Cards
          provide a consistent surface for displaying information blocks.
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
          <div class="p-8">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <and-card>
                <h3 class="mt-0 text-lg font-semibold text-foreground">
                  Default Card
                </h3>
                <p class="text-sm text-muted-foreground leading-relaxed">
                  A standard card with subtle border styling. Ideal for content
                  that sits inline with the page layout.
                </p>
              </and-card>

              <and-card variant="elevated">
                <h3 class="mt-0 text-lg font-semibold text-foreground">
                  Elevated Card
                </h3>
                <p class="text-sm text-muted-foreground leading-relaxed">
                  An elevated card with shadow depth. Use for content that needs
                  visual prominence.
                </p>
              </and-card>
            </div>
          </div>
        </div>
      </section>

      <!-- Real-world Examples -->
      <section class="mb-12">
        <h2 class="text-xl font-semibold tracking-tight text-foreground mb-5">
          Real-world Examples
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <and-card>
            <div class="flex flex-col gap-2">
              <span
                class="text-xs font-medium text-muted-foreground uppercase tracking-wider"
                >Revenue</span
              >
              <span class="text-2xl font-bold text-foreground">$45,231</span>
              <span class="text-xs text-muted-foreground"
                >+20.1% from last month</span
              >
            </div>
          </and-card>
          <and-card>
            <div class="flex flex-col gap-2">
              <span
                class="text-xs font-medium text-muted-foreground uppercase tracking-wider"
                >Users</span
              >
              <span class="text-2xl font-bold text-foreground">+2,350</span>
              <span class="text-xs text-muted-foreground"
                >+180 since yesterday</span
              >
            </div>
          </and-card>
          <and-card>
            <div class="flex flex-col gap-2">
              <span
                class="text-xs font-medium text-muted-foreground uppercase tracking-wider"
                >Uptime</span
              >
              <span class="text-2xl font-bold text-foreground">99.9%</span>
              <span class="text-xs text-muted-foreground"
                >Last 30 days</span
              >
            </div>
          </and-card>
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
          ><code>&lt;and-card&gt;
  &lt;h3&gt;Card Title&lt;/h3&gt;
  &lt;p&gt;Card content goes here.&lt;/p&gt;
&lt;/and-card&gt;

&lt;and-card variant="elevated"&gt;
  &lt;h3&gt;Elevated Card&lt;/h3&gt;
  &lt;p&gt;This card has a shadow effect.&lt;/p&gt;
&lt;/and-card&gt;</code></pre>
        </div>
      </section>
    </div>
  `,
})
export default class CardDemo {}

import { Component } from '@angular/core';
import {
  AndBreadcrumb,
  AndBreadcrumbItem,
} from '@angular-components/stencil-generated/components';

@Component({
  selector: 'app-breadcrumb-demo',
  imports: [AndBreadcrumb, AndBreadcrumbItem],
  template: `
    <div class="max-w-4xl mx-auto pb-12">
      <!-- Header -->
      <header class="mb-10 border-b border-border pb-10">
        <h1 class="text-3xl font-bold tracking-tight text-foreground m-0">
          Breadcrumb
        </h1>
        <p class="mt-4 text-lg text-muted-foreground max-w-2xl leading-relaxed">
          A navigational aid that shows the user's current location within a
          hierarchy. Provides accessible breadcrumb trail with proper ARIA
          semantics and customisable separators.
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
            class="p-10 flex flex-col items-start justify-center gap-6 min-h-[120px]"
          >
            <and-breadcrumb>
              <and-breadcrumb-item href="/" hideSeparator>
                Home
              </and-breadcrumb-item>
              <and-breadcrumb-item href="/components">
                Components
              </and-breadcrumb-item>
              <and-breadcrumb-item current>
                Breadcrumb
              </and-breadcrumb-item>
            </and-breadcrumb>
          </div>
        </div>
      </section>

      <!-- Sizes -->
      <section class="mb-12">
        <h2 class="text-xl font-semibold tracking-tight text-foreground mb-5">
          Sizes
        </h2>
        <div
          class="rounded-xl border border-border bg-card overflow-hidden shadow-sm"
        >
          <div class="p-8 flex flex-col gap-8">
            <!-- SM -->
            <div>
              <p class="text-sm font-medium text-foreground mb-3">Small</p>
              <and-breadcrumb size="sm">
                <and-breadcrumb-item href="/" hideSeparator size="sm">
                  Home
                </and-breadcrumb-item>
                <and-breadcrumb-item href="/docs" size="sm">
                  Docs
                </and-breadcrumb-item>
                <and-breadcrumb-item current size="sm">
                  API
                </and-breadcrumb-item>
              </and-breadcrumb>
            </div>

            <!-- MD -->
            <div>
              <p class="text-sm font-medium text-foreground mb-3">
                Medium (default)
              </p>
              <and-breadcrumb size="md">
                <and-breadcrumb-item href="/" hideSeparator>
                  Home
                </and-breadcrumb-item>
                <and-breadcrumb-item href="/docs">
                  Docs
                </and-breadcrumb-item>
                <and-breadcrumb-item current>
                  API
                </and-breadcrumb-item>
              </and-breadcrumb>
            </div>

            <!-- LG -->
            <div>
              <p class="text-sm font-medium text-foreground mb-3">Large</p>
              <and-breadcrumb size="lg">
                <and-breadcrumb-item href="/" hideSeparator size="lg">
                  Home
                </and-breadcrumb-item>
                <and-breadcrumb-item href="/docs" size="lg">
                  Docs
                </and-breadcrumb-item>
                <and-breadcrumb-item current size="lg">
                  API
                </and-breadcrumb-item>
              </and-breadcrumb>
            </div>
          </div>
        </div>
      </section>

      <!-- Deep Hierarchy -->
      <section class="mb-12">
        <h2 class="text-xl font-semibold tracking-tight text-foreground mb-5">
          Deep Hierarchy
        </h2>
        <div
          class="rounded-xl border border-border bg-card overflow-hidden shadow-sm"
        >
          <div class="p-10 flex flex-col items-start justify-center gap-6">
            <and-breadcrumb>
              <and-breadcrumb-item href="/" hideSeparator>
                Home
              </and-breadcrumb-item>
              <and-breadcrumb-item href="/products">
                Products
              </and-breadcrumb-item>
              <and-breadcrumb-item href="/products/electronics">
                Electronics
              </and-breadcrumb-item>
              <and-breadcrumb-item href="/products/electronics/phones">
                Phones
              </and-breadcrumb-item>
              <and-breadcrumb-item current>
                iPhone 16 Pro
              </and-breadcrumb-item>
            </and-breadcrumb>
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
          ><code>&lt;and-breadcrumb size="md"&gt;
  &lt;and-breadcrumb-item href="/" hideSeparator&gt;Home&lt;/and-breadcrumb-item&gt;
  &lt;and-breadcrumb-item href="/components"&gt;Components&lt;/and-breadcrumb-item&gt;
  &lt;and-breadcrumb-item current&gt;Breadcrumb&lt;/and-breadcrumb-item&gt;
&lt;/and-breadcrumb&gt;</code></pre>
        </div>
      </section>
    </div>
  `,
})
export default class BreadcrumbDemo {}

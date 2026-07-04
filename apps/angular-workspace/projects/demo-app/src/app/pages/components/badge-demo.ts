import { DemoCodeBlockComponent } from '../../shared';
import { Component } from '@angular/core';
import { AndBadge } from '@angular-components/stencil-generated/components';

@Component({
  selector: 'app-badge-demo',
  imports: [AndBadge, DemoCodeBlockComponent],
  template: `
    <div class="max-w-4xl mx-auto pb-12">
      <!-- Header -->
      <header class="mb-10 border-b border-border pb-10">
        <h1 class="text-3xl font-bold tracking-tight text-foreground m-0">Badge</h1>
        <p class="mt-4 text-lg text-muted-foreground max-w-2xl leading-relaxed">
          Small status descriptors for UI elements. Use badges to highlight new items, counts, or categorize content
          with visual labels.
        </p>
      </header>

      <!-- Preview Section -->
      <section class="mb-12">
        <h2 class="text-xl font-semibold tracking-tight text-foreground mb-5">Preview</h2>
        <div class="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
          <div class="p-10 flex flex-wrap items-center justify-center gap-4 min-h-[120px]">
            <and-badge variant="default">Default</and-badge>
            <and-badge variant="secondary">Secondary</and-badge>
            <and-badge variant="destructive">Destructive</and-badge>
            <and-badge variant="outline">Outline</and-badge>
          </div>
        </div>
      </section>

      <!-- Use Cases -->
      <section class="mb-12">
        <h2 class="text-xl font-semibold tracking-tight text-foreground mb-5">Common Patterns</h2>
        <div class="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
          <div class="p-8 flex flex-col gap-6">
            <!-- Status indicators -->
            <div>
              <p class="text-sm font-medium text-foreground mb-3">Status Indicators</p>
              <div class="flex flex-wrap gap-3">
                <and-badge variant="default">Active</and-badge>
                <and-badge variant="secondary">Pending</and-badge>
                <and-badge variant="destructive">Expired</and-badge>
                <and-badge variant="outline">Draft</and-badge>
              </div>
            </div>
            <!-- Labels -->
            <div>
              <p class="text-sm font-medium text-foreground mb-3">Labels</p>
              <div class="flex flex-wrap gap-3">
                <and-badge variant="default">New</and-badge>
                <and-badge variant="secondary">Featured</and-badge>
                <and-badge variant="outline">v2.0</and-badge>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Usage Code -->
      <section>
        <h2 class="text-xl font-semibold tracking-tight text-foreground mb-5">Usage</h2>
        <demo-code-block label="Template" [code]="templateCode" />
      </section>
    </div>
  `,
})
export default class BadgeDemo {
  templateCode = `<and-badge variant="default">Default</and-badge>
<and-badge variant="secondary">Secondary</and-badge>
<and-badge variant="destructive">Destructive</and-badge>
<and-badge variant="outline">Outline</and-badge>`;
}

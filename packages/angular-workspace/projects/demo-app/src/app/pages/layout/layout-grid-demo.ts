import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-layout-grid-demo',
  imports: [CommonModule],
  template: `
    <div class="max-w-4xl mx-auto flex flex-col gap-6">
      <div class="mb-2">
        <h1 class="text-3xl font-extrabold mb-2 tracking-tight">Grid</h1>
        <p class="text-base text-muted-foreground">
          Use
          <code class="text-sm bg-muted px-1.5 py-0.5 rounded font-mono">and-layout="grid"</code>
          to activate CSS Grid, then add column, span, and gap tokens.
        </p>
      </div>

      <!-- Basic Columns -->
      <section class="border border-border rounded-xl p-6 bg-card transition-shadow hover:shadow-lg duration-200">
        <div class="mb-5">
          <span class="inline-block text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-1 rounded-full mb-2">Columns</span>
          <h2 class="text-xl font-bold mb-1">Grid Columns</h2>
          <p class="text-sm text-muted-foreground">
            Set columns with <code class="text-xs bg-muted px-1 py-0.5 rounded font-mono">cols:1</code> through <code class="text-xs bg-muted px-1 py-0.5 rounded font-mono">cols:12</code>.
          </p>
        </div>

        <div class="flex flex-col gap-4 border border-dashed border-border rounded-lg bg-muted/50 p-4 mb-3">
          @for (cols of [2, 3, 4]; track cols) {
            <div>
              <p class="text-xs text-muted-foreground font-mono mb-1">cols:{{ cols }} gap:sm</p>
              <div [attr.and-layout]="'grid cols:' + cols + ' gap:sm'">
                @for (i of getArray(cols); track i) {
                  <div class="flex items-center justify-center h-12 rounded-lg bg-primary text-primary-foreground text-sm font-semibold shadow">{{ i }}</div>
                }
              </div>
            </div>
          }
        </div>

        <div class="bg-muted border border-border rounded-lg p-3 overflow-x-auto">
          <code class="text-xs font-mono whitespace-pre">&lt;div and-layout="grid cols:3 gap:sm"&gt;
  &lt;div&gt;1&lt;/div&gt;
  &lt;div&gt;2&lt;/div&gt;
  &lt;div&gt;3&lt;/div&gt;
&lt;/div&gt;</code>
        </div>
      </section>

      <!-- Column Span -->
      <section class="border border-border rounded-xl p-6 bg-card transition-shadow hover:shadow-lg duration-200">
        <div class="mb-5">
          <span class="inline-block text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-1 rounded-full mb-2">Span</span>
          <h2 class="text-xl font-bold mb-1">Column Spanning</h2>
          <p class="text-sm text-muted-foreground">
            Use <code class="text-xs bg-muted px-1 py-0.5 rounded font-mono">and-layout="span:N"</code> on children to span multiple columns. Use <code class="text-xs bg-muted px-1 py-0.5 rounded font-mono">span:full</code> for full width.
          </p>
        </div>

        <div class="border border-dashed border-border rounded-lg bg-muted/50 p-4 mb-3">
          <p class="text-xs text-muted-foreground font-mono mb-2">grid cols:4 gap:sm</p>
          <div and-layout="grid cols:4 gap:sm">
            <div and-layout="span:2" class="flex items-center justify-center h-14 rounded-lg bg-primary text-primary-foreground text-sm font-semibold shadow">span:2</div>
            <div class="flex items-center justify-center h-14 rounded-lg bg-secondary text-secondary-foreground text-sm font-semibold shadow">1</div>
            <div class="flex items-center justify-center h-14 rounded-lg bg-secondary text-secondary-foreground text-sm font-semibold shadow">1</div>
            <div class="flex items-center justify-center h-14 rounded-lg bg-secondary text-secondary-foreground text-sm font-semibold shadow">1</div>
            <div and-layout="span:3" class="flex items-center justify-center h-14 rounded-lg bg-accent text-accent-foreground text-sm font-semibold shadow border border-border">span:3</div>
            <div and-layout="span:full" class="flex items-center justify-center h-14 rounded-lg bg-muted text-foreground text-sm font-semibold shadow border border-border">span:full</div>
          </div>
        </div>

        <div class="bg-muted border border-border rounded-lg p-3 overflow-x-auto">
          <code class="text-xs font-mono whitespace-pre">&lt;div and-layout="grid cols:4 gap:sm"&gt;
  &lt;div and-layout="span:2"&gt;Wide&lt;/div&gt;
  &lt;div&gt;Normal&lt;/div&gt;
  &lt;div&gt;Normal&lt;/div&gt;
  &lt;div and-layout="span:full"&gt;Full width&lt;/div&gt;
&lt;/div&gt;</code>
        </div>
      </section>

      <!-- Column Start / End -->
      <section class="border border-border rounded-xl p-6 bg-card transition-shadow hover:shadow-lg duration-200">
        <div class="mb-5">
          <span class="inline-block text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-1 rounded-full mb-2">Position</span>
          <h2 class="text-xl font-bold mb-1">Column Start &amp; End</h2>
          <p class="text-sm text-muted-foreground">
            Place items precisely with <code class="text-xs bg-muted px-1 py-0.5 rounded font-mono">col-start:N</code> and <code class="text-xs bg-muted px-1 py-0.5 rounded font-mono">col-end:N</code>.
          </p>
        </div>

        <div class="border border-dashed border-border rounded-lg bg-muted/50 p-4 mb-3">
          <p class="text-xs text-muted-foreground font-mono mb-2">grid cols:6 gap:sm</p>
          <div and-layout="grid cols:6 gap:sm">
            <div and-layout="col-start:1 col-end:3" class="flex items-center justify-center h-14 rounded-lg bg-primary text-primary-foreground text-sm font-semibold shadow">1 → 3</div>
            <div and-layout="col-start:3 col-end:7" class="flex items-center justify-center h-14 rounded-lg bg-secondary text-secondary-foreground text-sm font-semibold shadow">3 → 7</div>
            <div and-layout="col-start:2 col-end:6" class="flex items-center justify-center h-14 rounded-lg bg-accent text-accent-foreground text-sm font-semibold shadow border border-border">2 → 6</div>
          </div>
        </div>

        <div class="bg-muted border border-border rounded-lg p-3 overflow-x-auto">
          <code class="text-xs font-mono whitespace-pre">&lt;div and-layout="grid cols:6 gap:sm"&gt;
  &lt;div and-layout="col-start:1 col-end:3"&gt;1 → 3&lt;/div&gt;
  &lt;div and-layout="col-start:3 col-end:7"&gt;3 → 7&lt;/div&gt;
&lt;/div&gt;</code>
        </div>
      </section>
    </div>
  `,
})
export default class LayoutGridDemoComponent {
  getArray(n: number): number[] {
    return Array.from({ length: n }, (_, i) => i + 1);
  }
}

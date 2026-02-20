import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-layout-flex-demo',
  imports: [CommonModule],
  template: `
    <div class="max-w-4xl mx-auto flex flex-col gap-6">
      <div class="mb-2">
        <h1 class="text-3xl font-extrabold mb-2 tracking-tight">Flexbox</h1>
        <p class="text-base text-muted-foreground">
          Use
          <code class="text-sm bg-muted px-1.5 py-0.5 rounded font-mono">and-layout="horizontal"</code>
          or
          <code class="text-sm bg-muted px-1.5 py-0.5 rounded font-mono">and-layout="vertical"</code>
          to activate flex, then add alignment, gap, and wrap tokens.
        </p>
      </div>

      <!-- Horizontal -->
      <section class="border border-border rounded-xl p-6 bg-card transition-shadow hover:shadow-lg duration-200">
        <div class="mb-5">
          <span class="inline-block text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-1 rounded-full mb-2">Direction</span>
          <h2 class="text-xl font-bold mb-1">Horizontal &amp; Vertical</h2>
          <p class="text-sm text-muted-foreground">
            The base direction tokens set <code class="text-xs bg-muted px-1 py-0.5 rounded font-mono">display:flex</code> and <code class="text-xs bg-muted px-1 py-0.5 rounded font-mono">flex-direction</code>.
          </p>
        </div>

        <div class="min-h-[120px] flex flex-col gap-4 border border-dashed border-border rounded-lg bg-muted/50 p-4 mb-3">
          <p class="text-xs text-muted-foreground font-semibold">horizontal</p>
          <div and-layout="horizontal gap:sm">
            @for (i of [1,2,3]; track i) {
              <div class="flex items-center justify-center w-20 h-12 rounded-lg bg-primary text-primary-foreground text-sm font-semibold shadow">{{ i }}</div>
            }
          </div>
          <p class="text-xs text-muted-foreground font-semibold mt-2">vertical</p>
          <div and-layout="vertical gap:sm">
            @for (i of [1,2,3]; track i) {
              <div class="flex items-center justify-center w-20 h-12 rounded-lg bg-secondary text-secondary-foreground text-sm font-semibold shadow">{{ i }}</div>
            }
          </div>
        </div>

        <div class="bg-muted border border-border rounded-lg p-3 overflow-x-auto">
          <code class="text-xs font-mono whitespace-pre">&lt;div and-layout="horizontal gap:sm"&gt;…&lt;/div&gt;
&lt;div and-layout="vertical gap:sm"&gt;…&lt;/div&gt;</code>
        </div>
      </section>

      <!-- Alignment -->
      <section class="border border-border rounded-xl p-6 bg-card transition-shadow hover:shadow-lg duration-200">
        <div class="mb-5">
          <span class="inline-block text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-1 rounded-full mb-2">Alignment</span>
          <h2 class="text-xl font-bold mb-1">Justify &amp; Align</h2>
          <p class="text-sm text-muted-foreground">
            Control main-axis and cross-axis alignment with <code class="text-xs bg-muted px-1 py-0.5 rounded font-mono">justify:*</code> and <code class="text-xs bg-muted px-1 py-0.5 rounded font-mono">align:*</code>.
          </p>
        </div>

        <div class="flex flex-col gap-4 border border-dashed border-border rounded-lg bg-muted/50 p-4 mb-3">
          <p class="text-xs text-muted-foreground font-semibold">justify:center align:center</p>
          <div and-layout="horizontal justify:center align:center gap:sm" class="min-h-[80px] border border-border rounded-lg bg-background p-2">
            <div class="flex items-center justify-center w-16 h-10 rounded bg-primary text-primary-foreground text-xs font-semibold">A</div>
            <div class="flex items-center justify-center w-16 h-10 rounded bg-primary text-primary-foreground text-xs font-semibold">B</div>
          </div>

          <p class="text-xs text-muted-foreground font-semibold">justify:between</p>
          <div and-layout="horizontal justify:between align:center" class="min-h-[60px] border border-border rounded-lg bg-background p-2">
            <div class="flex items-center justify-center w-16 h-10 rounded bg-secondary text-secondary-foreground text-xs font-semibold">Left</div>
            <div class="flex items-center justify-center w-16 h-10 rounded bg-secondary text-secondary-foreground text-xs font-semibold">Right</div>
          </div>

          <p class="text-xs text-muted-foreground font-semibold">justify:evenly</p>
          <div and-layout="horizontal justify:evenly align:center" class="min-h-[60px] border border-border rounded-lg bg-background p-2">
            @for (i of [1,2,3]; track i) {
              <div class="flex items-center justify-center w-14 h-10 rounded bg-accent text-accent-foreground text-xs font-semibold">{{ i }}</div>
            }
          </div>
        </div>

        <div class="bg-muted border border-border rounded-lg p-3 overflow-x-auto">
          <code class="text-xs font-mono whitespace-pre">&lt;div and-layout="horizontal justify:center align:center gap:sm"&gt;…&lt;/div&gt;
&lt;div and-layout="horizontal justify:between align:center"&gt;…&lt;/div&gt;
&lt;div and-layout="horizontal justify:evenly align:center"&gt;…&lt;/div&gt;</code>
        </div>
      </section>

      <!-- Wrap & Gap -->
      <section class="border border-border rounded-xl p-6 bg-card transition-shadow hover:shadow-lg duration-200">
        <div class="mb-5">
          <span class="inline-block text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-1 rounded-full mb-2">Wrap &amp; Gap</span>
          <h2 class="text-xl font-bold mb-1">Flex Wrap &amp; Gap</h2>
          <p class="text-sm text-muted-foreground">
            Use <code class="text-xs bg-muted px-1 py-0.5 rounded font-mono">wrap:wrap</code> and the gap scale (none, xxxs, xxs, xs, sm, md, lg, xl, xxl, xxxl).
          </p>
        </div>

        <div class="border border-dashed border-border rounded-lg bg-muted/50 p-4 mb-3">
          <p class="text-xs text-muted-foreground font-semibold mb-2">wrap:wrap gap:md</p>
          <div and-layout="horizontal wrap:wrap gap:md">
            @for (i of [1,2,3,4,5,6,7,8]; track i) {
              <div class="flex items-center justify-center w-24 h-12 rounded-lg bg-primary text-primary-foreground text-sm font-semibold shadow">Item {{ i }}</div>
            }
          </div>
        </div>

        <div class="bg-muted border border-border rounded-lg p-3 overflow-x-auto">
          <code class="text-xs font-mono whitespace-pre">&lt;div and-layout="horizontal wrap:wrap gap:md"&gt;
  &lt;div&gt;Item 1&lt;/div&gt;
  …
&lt;/div&gt;</code>
        </div>
      </section>

      <!-- Gap scale -->
      <section class="border border-border rounded-xl p-6 bg-card transition-shadow hover:shadow-lg duration-200">
        <div class="mb-5">
          <span class="inline-block text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-1 rounded-full mb-2">Scale</span>
          <h2 class="text-xl font-bold mb-1">Gap Scale</h2>
          <p class="text-sm text-muted-foreground">All spacing tokens visualized.</p>
        </div>

        <div class="flex flex-col gap-3 border border-dashed border-border rounded-lg bg-muted/50 p-4 mb-3">
          @for (size of gapSizes; track size) {
            <div>
              <p class="text-xs text-muted-foreground font-mono mb-1">gap:{{ size }}</p>
              <div [attr.and-layout]="'horizontal gap:' + size">
                <div class="w-10 h-8 rounded bg-primary text-primary-foreground text-xs flex items-center justify-center font-semibold">A</div>
                <div class="w-10 h-8 rounded bg-primary text-primary-foreground text-xs flex items-center justify-center font-semibold">B</div>
                <div class="w-10 h-8 rounded bg-primary text-primary-foreground text-xs flex items-center justify-center font-semibold">C</div>
              </div>
            </div>
          }
        </div>
      </section>
    </div>
  `,
})
export default class LayoutFlexDemoComponent {
  gapSizes = ['none', 'xxxs', 'xxs', 'xs', 'sm', 'md', 'lg', 'xl', 'xxl', 'xxxl'];
}

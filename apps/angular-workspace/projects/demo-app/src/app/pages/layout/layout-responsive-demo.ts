import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-layout-responsive-demo',
  imports: [CommonModule],
  template: `
    <div class="max-w-4xl mx-auto flex flex-col gap-6">
      <div class="mb-2">
        <h1 class="text-3xl font-extrabold mb-2 tracking-tight">Responsive</h1>
        <p class="text-base text-muted-foreground">
          Every token supports responsive breakpoints using the
          <code class="text-sm bg-muted px-1.5 py-0.5 rounded font-mono">&#64;breakpoint</code>
          syntax. Resize your browser to see the changes.
        </p>
      </div>

      <!-- Breakpoints reference -->
      <section class="border border-border rounded-xl p-6 bg-card">
        <h2 class="text-xl font-bold mb-4">Breakpoints</h2>
        <div class="overflow-x-auto">
          <table class="w-full text-sm text-left">
            <thead>
              <tr class="border-b border-border">
                <th class="py-2 px-3 font-semibold">Modifier</th>
                <th class="py-2 px-3 font-semibold">Min Width</th>
              </tr>
            </thead>
            <tbody class="text-muted-foreground">
              <tr class="border-b border-border/50"><td class="py-2 px-3 font-mono text-xs">&#64;sm</td><td class="py-2 px-3">640px</td></tr>
              <tr class="border-b border-border/50"><td class="py-2 px-3 font-mono text-xs">&#64;md</td><td class="py-2 px-3">768px</td></tr>
              <tr class="border-b border-border/50"><td class="py-2 px-3 font-mono text-xs">&#64;lg</td><td class="py-2 px-3">1024px</td></tr>
              <tr class="border-b border-border/50"><td class="py-2 px-3 font-mono text-xs">&#64;xl</td><td class="py-2 px-3">1280px</td></tr>
              <tr><td class="py-2 px-3 font-mono text-xs">&#64;2xl</td><td class="py-2 px-3">1536px</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- Responsive Grid -->
      <section class="border border-border rounded-xl p-6 bg-card transition-shadow hover:shadow-lg duration-200">
        <div class="mb-5">
          <span class="inline-block text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-1 rounded-full mb-2">Grid</span>
          <h2 class="text-xl font-bold mb-1">Responsive Grid Columns</h2>
          <p class="text-sm text-muted-foreground">
            Columns change with viewport size. Try resizing your browser!
          </p>
        </div>

        <div class="border border-dashed border-border rounded-lg bg-muted/50 p-4 mb-3">
          <p class="text-xs text-muted-foreground font-mono mb-2">cols:1 cols&#64;sm:2 cols&#64;md:3 cols&#64;lg:4 gap:sm</p>
          <div and-layout="grid cols:1 cols@sm:2 cols@md:3 cols@lg:4 gap:sm">
            @for (i of [1,2,3,4,5,6,7,8]; track i) {
              <div class="flex items-center justify-center h-16 rounded-lg bg-primary text-primary-foreground text-sm font-semibold shadow">
                {{ i }}
              </div>
            }
          </div>
        </div>

        <div class="bg-muted border border-border rounded-lg p-3 overflow-x-auto">
          <code class="text-xs font-mono whitespace-pre">&lt;div and-layout="grid cols:1 cols&#64;sm:2 cols&#64;md:3 cols&#64;lg:4 gap:sm"&gt;
  &lt;div&gt;1&lt;/div&gt;
  &lt;div&gt;2&lt;/div&gt;
  …
&lt;/div&gt;</code>
        </div>
      </section>

      <!-- Responsive Gap -->
      <section class="border border-border rounded-xl p-6 bg-card transition-shadow hover:shadow-lg duration-200">
        <div class="mb-5">
          <span class="inline-block text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-1 rounded-full mb-2">Gap</span>
          <h2 class="text-xl font-bold mb-1">Responsive Gap</h2>
          <p class="text-sm text-muted-foreground">
            Gap increases at larger breakpoints.
          </p>
        </div>

        <div class="border border-dashed border-border rounded-lg bg-muted/50 p-4 mb-3">
          <p class="text-xs text-muted-foreground font-mono mb-2">horizontal gap:xs gap&#64;md:md gap&#64;lg:xl wrap:wrap</p>
          <div and-layout="horizontal gap:xs gap@md:md gap@lg:xl wrap:wrap">
            @for (i of [1,2,3,4,5,6]; track i) {
              <div class="flex items-center justify-center w-20 h-12 rounded-lg bg-secondary text-secondary-foreground text-sm font-semibold shadow">{{ i }}</div>
            }
          </div>
        </div>

        <div class="bg-muted border border-border rounded-lg p-3 overflow-x-auto">
          <code class="text-xs font-mono whitespace-pre">&lt;div and-layout="horizontal gap:xs gap&#64;md:md gap&#64;lg:xl wrap:wrap"&gt;…&lt;/div&gt;</code>
        </div>
      </section>

      <!-- Responsive Padding -->
      <section class="border border-border rounded-xl p-6 bg-card transition-shadow hover:shadow-lg duration-200">
        <div class="mb-5">
          <span class="inline-block text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-1 rounded-full mb-2">Spacing</span>
          <h2 class="text-xl font-bold mb-1">Responsive Padding</h2>
          <p class="text-sm text-muted-foreground">
            Padding scales up at wider viewports.
          </p>
        </div>

        <div class="border border-dashed border-border rounded-lg bg-muted/50 p-4 mb-3">
          <p class="text-xs text-muted-foreground font-mono mb-2">p:sm p&#64;md:lg p&#64;lg:xxl</p>
          <div class="border-2 border-dashed border-primary/30 rounded-lg inline-block">
            <div and-layout="p:sm p@md:lg p@lg:xxl" class="bg-primary/15 rounded-lg">
              <div class="bg-primary text-primary-foreground text-sm font-semibold px-3 py-2 rounded">
                Resize to see padding change
              </div>
            </div>
          </div>
        </div>

        <div class="bg-muted border border-border rounded-lg p-3 overflow-x-auto">
          <code class="text-xs font-mono whitespace-pre">&lt;div and-layout="p:sm p&#64;md:lg p&#64;lg:xxl"&gt;…&lt;/div&gt;</code>
        </div>
      </section>

      <!-- Responsive Typography -->
      <section class="border border-border rounded-xl p-6 bg-card transition-shadow hover:shadow-lg duration-200">
        <div class="mb-5">
          <span class="inline-block text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-1 rounded-full mb-2">Typography</span>
          <h2 class="text-xl font-bold mb-1">Responsive Text Alignment</h2>
          <p class="text-sm text-muted-foreground">
            Change text alignment based on viewport.
          </p>
        </div>

        <div class="border border-dashed border-border rounded-lg bg-muted/50 p-4 mb-3">
          <p class="text-xs text-muted-foreground font-mono mb-2">and-text: p align:center align&#64;md:left</p>
          <div and-text="p align:center align@md:left" class="border border-border rounded-lg bg-background p-3">
            This text is centered on small screens and left-aligned from the md breakpoint (768px) up. Resize your browser to see the change.
          </div>
        </div>

        <div class="bg-muted border border-border rounded-lg p-3 overflow-x-auto">
          <code class="text-xs font-mono whitespace-pre">&lt;div and-text="p align:center align&#64;md:left"&gt;…&lt;/div&gt;</code>
        </div>
      </section>

      <!-- Full responsive layout example -->
      <section class="border border-border rounded-xl p-6 bg-card transition-shadow hover:shadow-lg duration-200">
        <div class="mb-5">
          <span class="inline-block text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-1 rounded-full mb-2">Full Example</span>
          <h2 class="text-xl font-bold mb-1">Responsive Card Layout</h2>
          <p class="text-sm text-muted-foreground">
            A complete responsive layout combining multiple token types.
          </p>
        </div>

        <div class="border border-dashed border-border rounded-lg bg-muted/50 p-4 mb-3">
          <div and-layout="grid cols:1 cols@sm:2 cols@lg:3 gap:sm gap@md:md">
            @for (card of cards; track card.title) {
              <div and-layout="vertical p:md gap:xs" class="border border-border rounded-xl bg-card shadow-sm">
                <div class="w-full h-24 rounded-lg bg-gradient-to-br" [ngClass]="card.gradient"></div>
                <div and-text="h6 weight:bold">{{ card.title }}</div>
                <div and-text="p-sm" class="text-muted-foreground">{{ card.desc }}</div>
              </div>
            }
          </div>
        </div>

        <div class="bg-muted border border-border rounded-lg p-3 overflow-x-auto">
          <code class="text-xs font-mono whitespace-pre">&lt;div and-layout="grid cols:1 cols&#64;sm:2 cols&#64;lg:3 gap:sm gap&#64;md:md"&gt;
  &lt;div and-layout="vertical p:md gap:xs"&gt;
    &lt;div and-text="h6 weight:bold"&gt;Title&lt;/div&gt;
    &lt;div and-text="p-sm"&gt;Description&lt;/div&gt;
  &lt;/div&gt;
&lt;/div&gt;</code>
        </div>
      </section>
    </div>
  `,
})
export default class LayoutResponsiveDemoComponent {
  cards = [
    { title: 'Flexbox', desc: 'Horizontal & vertical layouts', gradient: 'from-blue-500 to-indigo-600' },
    { title: 'Grid', desc: 'Powerful column-based layouts', gradient: 'from-emerald-500 to-teal-600' },
    { title: 'Spacing', desc: 'Padding & margin utilities', gradient: 'from-orange-500 to-red-600' },
    { title: 'Typography', desc: 'Headings, text & alignment', gradient: 'from-purple-500 to-pink-600' },
    { title: 'Responsive', desc: 'Breakpoint-driven tokens', gradient: 'from-cyan-500 to-blue-600' },
    { title: 'Zero JS', desc: 'Pure CSS attribute selectors', gradient: 'from-amber-500 to-orange-600' },
  ];
}

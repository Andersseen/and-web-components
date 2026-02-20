import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-layout-overview-demo',
  imports: [CommonModule],
  template: `
    <div class="max-w-4xl mx-auto flex flex-col gap-6">
      <div class="mb-2">
        <h1 class="text-3xl font-extrabold mb-2 tracking-tight">
          And Layout
        </h1>
        <p class="text-base text-muted-foreground">
          A pure CSS layout &amp; typography library driven entirely by HTML
          attributes. No classes, no JavaScript — just the
          <code class="text-sm bg-muted px-1.5 py-0.5 rounded font-mono">and-layout</code>
          and
          <code class="text-sm bg-muted px-1.5 py-0.5 rounded font-mono">and-text</code>
          attributes.
        </p>
      </div>

      <!-- How it works -->
      <section class="border border-border rounded-xl p-6 bg-card">
        <h2 class="text-xl font-bold mb-4">How It Works</h2>
        <p class="text-sm text-muted-foreground mb-4">
          Instead of utility classes, you declare layout through space-separated
          tokens inside a single attribute:
        </p>
        <div class="bg-muted border border-border rounded-lg p-4 overflow-x-auto mb-4">
          <code class="text-xs font-mono whitespace-pre">&lt;div and-layout="horizontal justify:center align:center gap:md"&gt;
  &lt;div&gt;Item 1&lt;/div&gt;
  &lt;div&gt;Item 2&lt;/div&gt;
&lt;/div&gt;</code>
        </div>
        <p class="text-sm text-muted-foreground">
          Each token maps to a CSS rule through attribute selectors. Responsive
          modifiers use the
          <code class="text-sm bg-muted px-1.5 py-0.5 rounded font-mono">&#64;breakpoint</code>
          syntax, e.g.
          <code class="text-sm bg-muted px-1.5 py-0.5 rounded font-mono">cols&#64;md:3</code>.
        </p>
      </section>

      <!-- Feature grid -->
      <section class="border border-border rounded-xl p-6 bg-card">
        <h2 class="text-xl font-bold mb-4">Features</h2>
        <div and-layout="grid cols:2 gap:md cols@md:3">
          <div class="border border-border rounded-lg p-4 bg-muted/50">
            <h3 class="font-semibold mb-1">Flexbox</h3>
            <p class="text-xs text-muted-foreground">
              horizontal / vertical, align, justify, wrap, gap
            </p>
          </div>
          <div class="border border-border rounded-lg p-4 bg-muted/50">
            <h3 class="font-semibold mb-1">Grid</h3>
            <p class="text-xs text-muted-foreground">
              cols, span, col-start, col-end, gap
            </p>
          </div>
          <div class="border border-border rounded-lg p-4 bg-muted/50">
            <h3 class="font-semibold mb-1">Spacing</h3>
            <p class="text-xs text-muted-foreground">
              padding, margin with directional and axis modifiers
            </p>
          </div>
          <div class="border border-border rounded-lg p-4 bg-muted/50">
            <h3 class="font-semibold mb-1">Typography</h3>
            <p class="text-xs text-muted-foreground">
              Headings, paragraphs, alignment, weight, color via and-text
            </p>
          </div>
          <div class="border border-border rounded-lg p-4 bg-muted/50">
            <h3 class="font-semibold mb-1">Responsive</h3>
            <p class="text-xs text-muted-foreground">
              All tokens support &#64;sm, &#64;md, &#64;lg, &#64;xl, &#64;2xl breakpoints
            </p>
          </div>
          <div class="border border-border rounded-lg p-4 bg-muted/50">
            <h3 class="font-semibold mb-1">Zero JS</h3>
            <p class="text-xs text-muted-foreground">
              Pure CSS attribute selectors — works with any framework
            </p>
          </div>
        </div>
      </section>

      <!-- Quick reference -->
      <section class="border border-border rounded-xl p-6 bg-card">
        <h2 class="text-xl font-bold mb-4">Quick Reference</h2>
        <div class="overflow-x-auto">
          <table class="w-full text-sm text-left">
            <thead>
              <tr class="border-b border-border">
                <th class="py-2 px-3 font-semibold">Attribute</th>
                <th class="py-2 px-3 font-semibold">Example Token</th>
                <th class="py-2 px-3 font-semibold">CSS Result</th>
              </tr>
            </thead>
            <tbody class="text-muted-foreground">
              <tr class="border-b border-border/50">
                <td class="py-2 px-3 font-mono text-xs">and-layout</td>
                <td class="py-2 px-3 font-mono text-xs">horizontal</td>
                <td class="py-2 px-3 font-mono text-xs">display:flex; flex-direction:row</td>
              </tr>
              <tr class="border-b border-border/50">
                <td class="py-2 px-3 font-mono text-xs">and-layout</td>
                <td class="py-2 px-3 font-mono text-xs">grid cols:3 gap:md</td>
                <td class="py-2 px-3 font-mono text-xs">display:grid; grid-template-columns:repeat(3,…); gap:1rem</td>
              </tr>
              <tr class="border-b border-border/50">
                <td class="py-2 px-3 font-mono text-xs">and-layout</td>
                <td class="py-2 px-3 font-mono text-xs">p:lg m-t:md</td>
                <td class="py-2 px-3 font-mono text-xs">padding:1.5rem; margin-top:1rem</td>
              </tr>
              <tr class="border-b border-border/50">
                <td class="py-2 px-3 font-mono text-xs">and-text</td>
                <td class="py-2 px-3 font-mono text-xs">h2 align:center weight:bold</td>
                <td class="py-2 px-3 font-mono text-xs">font-size:3rem; text-align:center; font-weight:700</td>
              </tr>
              <tr>
                <td class="py-2 px-3 font-mono text-xs">and-layout</td>
                <td class="py-2 px-3 font-mono text-xs">cols&#64;md:2 cols&#64;lg:4</td>
                <td class="py-2 px-3 font-mono text-xs">Responsive grid columns at breakpoints</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  `,
})
export default class LayoutOverviewDemoComponent {}

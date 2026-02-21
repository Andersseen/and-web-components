import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-layout-typography-demo',
  imports: [CommonModule],
  template: `
    <div class="max-w-4xl mx-auto flex flex-col gap-6">
      <div class="mb-2">
        <h1 class="text-3xl font-extrabold mb-2 tracking-tight">Typography</h1>
        <p class="text-base text-muted-foreground">
          Use the
          <code class="text-sm bg-muted px-1.5 py-0.5 rounded font-mono">and-text</code>
          attribute for headings, paragraphs, alignment, weight, and color control.
        </p>
      </div>

      <!-- Headings -->
      <section class="border border-border rounded-xl p-6 bg-card transition-shadow hover:shadow-lg duration-200">
        <div class="mb-5">
          <span class="inline-block text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-1 rounded-full mb-2">Headings</span>
          <h2 class="text-xl font-bold mb-1">Heading Scale</h2>
          <p class="text-sm text-muted-foreground">
            Tokens <code class="text-xs bg-muted px-1 py-0.5 rounded font-mono">h1</code> through <code class="text-xs bg-muted px-1 py-0.5 rounded font-mono">h6</code> apply font-size, font-weight, and line-height.
          </p>
        </div>

        <div class="border border-dashed border-border rounded-lg bg-muted/50 p-6 mb-3 flex flex-col gap-3">
          <div and-text="h1">Heading 1 — 3.75rem / bold</div>
          <div and-text="h2">Heading 2 — 3rem / bold</div>
          <div and-text="h3">Heading 3 — 2.25rem / semibold</div>
          <div and-text="h4">Heading 4 — 1.875rem / semibold</div>
          <div and-text="h5">Heading 5 — 1.5rem / medium</div>
          <div and-text="h6">Heading 6 — 1.25rem / medium</div>
        </div>

        <div class="bg-muted border border-border rounded-lg p-3 overflow-x-auto">
          <code class="text-xs font-mono whitespace-pre">&lt;div and-text="h1"&gt;Heading 1&lt;/div&gt;
&lt;div and-text="h2"&gt;Heading 2&lt;/div&gt;
&lt;div and-text="h3"&gt;Heading 3&lt;/div&gt;</code>
        </div>
      </section>

      <!-- Paragraphs -->
      <section class="border border-border rounded-xl p-6 bg-card transition-shadow hover:shadow-lg duration-200">
        <div class="mb-5">
          <span class="inline-block text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-1 rounded-full mb-2">Body Text</span>
          <h2 class="text-xl font-bold mb-1">Paragraphs &amp; Caption</h2>
          <p class="text-sm text-muted-foreground">
            Use <code class="text-xs bg-muted px-1 py-0.5 rounded font-mono">p</code>,
            <code class="text-xs bg-muted px-1 py-0.5 rounded font-mono">p-sm</code>,
            <code class="text-xs bg-muted px-1 py-0.5 rounded font-mono">p-xs</code>, and
            <code class="text-xs bg-muted px-1 py-0.5 rounded font-mono">caption</code>.
          </p>
        </div>

        <div class="border border-dashed border-border rounded-lg bg-muted/50 p-6 mb-3 flex flex-col gap-4">
          <div>
            <p class="text-xs text-muted-foreground font-mono mb-1">and-text="p"</p>
            <div and-text="p">This is a regular paragraph at 1rem (16px). Lorem ipsum dolor sit amet, consectetur adipiscing elit.</div>
          </div>
          <div>
            <p class="text-xs text-muted-foreground font-mono mb-1">and-text="p-sm"</p>
            <div and-text="p-sm">Small paragraph at 0.875rem (14px). Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</div>
          </div>
          <div>
            <p class="text-xs text-muted-foreground font-mono mb-1">and-text="p-xs"</p>
            <div and-text="p-xs">Extra-small paragraph at 0.75rem (12px). Ut enim ad minim veniam, quis nostrud exercitation.</div>
          </div>
          <div>
            <p class="text-xs text-muted-foreground font-mono mb-1">and-text="caption"</p>
            <div and-text="caption">Caption text — small and muted, perfect for supplementary info.</div>
          </div>
        </div>

        <div class="bg-muted border border-border rounded-lg p-3 overflow-x-auto">
          <code class="text-xs font-mono whitespace-pre">&lt;div and-text="p"&gt;Regular paragraph&lt;/div&gt;
&lt;div and-text="p-sm"&gt;Small text&lt;/div&gt;
&lt;div and-text="caption"&gt;Caption text&lt;/div&gt;</code>
        </div>
      </section>

      <!-- Alignment -->
      <section class="border border-border rounded-xl p-6 bg-card transition-shadow hover:shadow-lg duration-200">
        <div class="mb-5">
          <span class="inline-block text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-1 rounded-full mb-2">Alignment</span>
          <h2 class="text-xl font-bold mb-1">Text Alignment</h2>
          <p class="text-sm text-muted-foreground">
            Tokens: <code class="text-xs bg-muted px-1 py-0.5 rounded font-mono">align:left</code>,
            <code class="text-xs bg-muted px-1 py-0.5 rounded font-mono">align:center</code>,
            <code class="text-xs bg-muted px-1 py-0.5 rounded font-mono">align:right</code>,
            <code class="text-xs bg-muted px-1 py-0.5 rounded font-mono">align:justify</code>
          </p>
        </div>

        <div class="border border-dashed border-border rounded-lg bg-muted/50 p-4 mb-3 flex flex-col gap-3">
          @for (align of ['left', 'center', 'right', 'justify']; track align) {
            <div class="border border-border rounded-lg p-3 bg-background">
              <p class="text-xs text-muted-foreground font-mono mb-1">align:{{ align }}</p>
              <div [attr.and-text]="'p align:' + align">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </div>
            </div>
          }
        </div>

        <div class="bg-muted border border-border rounded-lg p-3 overflow-x-auto">
          <code class="text-xs font-mono whitespace-pre">&lt;div and-text="p align:center"&gt;Centered text&lt;/div&gt;
&lt;div and-text="h3 align:right"&gt;Right-aligned heading&lt;/div&gt;</code>
        </div>
      </section>

      <!-- Weight -->
      <section class="border border-border rounded-xl p-6 bg-card transition-shadow hover:shadow-lg duration-200">
        <div class="mb-5">
          <span class="inline-block text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-1 rounded-full mb-2">Weight</span>
          <h2 class="text-xl font-bold mb-1">Font Weight</h2>
          <p class="text-sm text-muted-foreground">
            Override font-weight with <code class="text-xs bg-muted px-1 py-0.5 rounded font-mono">weight:thin</code> through <code class="text-xs bg-muted px-1 py-0.5 rounded font-mono">weight:black</code>.
          </p>
        </div>

        <div class="border border-dashed border-border rounded-lg bg-muted/50 p-4 mb-3 flex flex-col gap-2">
          @for (w of weights; track w.name) {
            <div [attr.and-text]="'p weight:' + w.name" class="text-lg">
              weight:{{ w.name }} — {{ w.value }}
            </div>
          }
        </div>

        <div class="bg-muted border border-border rounded-lg p-3 overflow-x-auto">
          <code class="text-xs font-mono whitespace-pre">&lt;div and-text="h3 weight:extrabold"&gt;Extra bold heading&lt;/div&gt;
&lt;div and-text="p weight:light"&gt;Light paragraph&lt;/div&gt;</code>
        </div>
      </section>

      <!-- Combined -->
      <section class="border border-border rounded-xl p-6 bg-card transition-shadow hover:shadow-lg duration-200">
        <div class="mb-5">
          <span class="inline-block text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-1 rounded-full mb-2">Combined</span>
          <h2 class="text-xl font-bold mb-1">Combined Tokens</h2>
          <p class="text-sm text-muted-foreground">
            Mix any tokens together in a single attribute.
          </p>
        </div>

        <div class="border border-dashed border-border rounded-lg bg-muted/50 p-6 mb-3 flex flex-col gap-4">
          <div and-text="h2 align:center weight:extrabold">
            Centered Bold Heading
          </div>
          <div and-text="p-sm align:right weight:light">
            A light, right-aligned small paragraph for supplementary information.
          </div>
          <div and-text="h5 weight:thin align:center">
            Thin centered sub-heading
          </div>
        </div>

        <div class="bg-muted border border-border rounded-lg p-3 overflow-x-auto">
          <code class="text-xs font-mono whitespace-pre">&lt;div and-text="h2 align:center weight:extrabold"&gt;…&lt;/div&gt;
&lt;div and-text="p-sm align:right weight:light"&gt;…&lt;/div&gt;</code>
        </div>
      </section>
    </div>
  `,
})
export default class LayoutTypographyDemoComponent {
  weights = [
    { name: 'thin', value: 100 },
    { name: 'light', value: 300 },
    { name: 'normal', value: 400 },
    { name: 'medium', value: 500 },
    { name: 'semibold', value: 600 },
    { name: 'bold', value: 700 },
    { name: 'extrabold', value: 800 },
    { name: 'black', value: 900 },
  ];
}

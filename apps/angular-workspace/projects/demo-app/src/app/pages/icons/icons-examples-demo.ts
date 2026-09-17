import { AndIcon } from '@andersseen/angular-components';
import { Component } from '@angular/core';

@Component({
  selector: 'app-icons-examples-demo',
  imports: [AndIcon],
  template: `
    <div class="max-w-4xl mx-auto pb-12">
      <!-- Header -->
      <header class="mb-10 border-b border-border pb-10">
        <h1 class="text-3xl font-bold tracking-tight text-foreground m-0">Examples</h1>
        <p class="mt-4 text-lg text-muted-foreground max-w-2xl leading-relaxed">
          Two ways to use the same 86-icon catalog. Both read from the exact same source — nothing is duplicated between
          them.
        </p>
      </header>

      <!-- CSS-only -->
      <section class="mb-12">
        <div class="flex items-center gap-2 mb-2">
          <h2 class="text-xl font-semibold tracking-tight text-foreground m-0">CSS-only — zero JavaScript</h2>
          <span
            class="inline-flex items-center rounded-full bg-success/10 px-2.5 py-0.5 text-xs font-medium text-success"
            >New</span
          >
        </div>
        <p class="text-sm text-muted-foreground mb-5 max-w-2xl leading-relaxed">
          The <code class="text-xs bg-muted px-1.5 py-0.5 rounded">and-icon</code> HTML attribute + CSS
          <code class="text-xs bg-muted px-1.5 py-0.5 rounded">mask-image</code>. No Custom Element registration, no
          <code class="text-xs bg-muted px-1.5 py-0.5 rounded">registerIcons()</code> call — every element below is a
          plain <code class="text-xs bg-muted px-1.5 py-0.5 rounded">&lt;span&gt;</code>/<code
            class="text-xs bg-muted px-1.5 py-0.5 rounded"
            >&lt;i&gt;</code
          >/<code class="text-xs bg-muted px-1.5 py-0.5 rounded">&lt;div&gt;</code> styled by
          <code class="text-xs bg-muted px-1.5 py-0.5 rounded">@andersseen/icon/icons.css</code>, already imported by
          this app's global stylesheet.
        </p>
        <div class="rounded-xl border border-border bg-card overflow-hidden shadow-sm mb-4">
          <div class="p-8 flex flex-wrap items-center justify-center gap-8">
            <span and-icon="home" aria-hidden="true" class="text-foreground" style="font-size: 32px"></span>
            <i and-icon="search" aria-hidden="true" class="text-primary" style="font-size: 28px"></i>
            <div and-icon="heart" aria-hidden="true" class="text-destructive" style="font-size: 32px"></div>
            <span and-icon="star" aria-hidden="true" class="text-warning" style="font-size: 24px"></span>
            <span and-icon="check" aria-hidden="true" class="text-success" style="font-size: 20px"></span>
          </div>
          <div class="border-t border-border bg-muted/30 px-5 py-3">
            <p class="text-xs text-muted-foreground m-0">
              Size and color are plain CSS — <code class="text-xs">font-size</code> controls the box (the icon is always
              <code class="text-xs">1em</code>), <code class="text-xs">color</code> controls the fill via
              <code class="text-xs">currentColor</code>. No <code class="text-xs">and-icon-size</code>/<code
                class="text-xs"
                >and-icon-color</code
              >
              attributes needed.
            </p>
          </div>
        </div>
        <div class="rounded-xl border border-border overflow-x-auto shadow-sm">
          <div class="bg-muted/50 px-5 py-3 border-b border-border">
            <span class="text-xs font-medium text-muted-foreground tracking-wide uppercase">CSS + HTML</span>
          </div>
          <pre
            class="m-0 p-5 font-mono text-[13px] leading-relaxed text-foreground/80 bg-muted/20"
          ><code>&#64;import '&#64;andersseen/icon/icons.css';</code></pre>
          <pre
            class="m-0 p-5 pt-0 font-mono text-[13px] leading-relaxed text-foreground/80 bg-muted/20"
          ><code>&lt;span and-icon="home" aria-hidden="true"&gt;&lt;/span&gt;
&lt;i and-icon="search" aria-hidden="true"&gt;&lt;/i&gt;
&lt;div and-icon="heart" aria-hidden="true"&gt;&lt;/div&gt;</code></pre>
        </div>
      </section>

      <!-- Web Component -->
      <section class="mb-12">
        <h2 class="text-xl font-semibold tracking-tight text-foreground mb-2">
          Web Component — <code class="text-lg bg-muted px-1.5 py-0.5 rounded">&lt;and-icon&gt;</code>
        </h2>
        <p class="text-sm text-muted-foreground mb-5 max-w-2xl leading-relaxed">
          Renders a real <code class="text-xs bg-muted px-1.5 py-0.5 rounded">&lt;svg&gt;</code> from the registry
          (<code class="text-xs bg-muted px-1.5 py-0.5 rounded">registerAllIcons()</code>, called once at bootstrap in
          this app). Useful when you need a runtime
          <code class="text-xs bg-muted px-1.5 py-0.5 rounded">stroke-width</code> prop or per-instance sizing without
          touching CSS.
        </p>
        <div class="rounded-xl border border-border bg-card overflow-hidden shadow-sm mb-4">
          <div class="p-8 flex items-end justify-center gap-8">
            @for (size of sizes; track size) {
              <div class="flex flex-col items-center gap-2">
                <and-icon name="star" [size]="size"></and-icon>
                <span class="text-xs text-muted-foreground">{{ size }}px</span>
              </div>
            }
          </div>
          <div class="border-t border-border p-8 flex items-center justify-center gap-6">
            <and-icon name="heart" size="28" class="text-destructive"></and-icon>
            <and-icon name="check" size="28" class="text-primary"></and-icon>
            <and-icon name="star" size="28" class="text-warning"></and-icon>
            <and-icon name="settings" size="28" stroke-width="1"></and-icon>
          </div>
        </div>
        <div class="rounded-xl border border-border overflow-x-auto shadow-sm">
          <div class="bg-muted/50 px-5 py-3 border-b border-border">
            <span class="text-xs font-medium text-muted-foreground tracking-wide uppercase">Template</span>
          </div>
          <pre
            class="m-0 p-5 font-mono text-[13px] leading-relaxed text-foreground/80 bg-muted/20"
          ><code>&lt;and-icon name="star" size="24"&gt;&lt;/and-icon&gt;
&lt;and-icon name="heart" size="28" class="text-destructive"&gt;&lt;/and-icon&gt;
&lt;and-icon name="settings" size="28" stroke-width="1"&gt;&lt;/and-icon&gt;</code></pre>
        </div>
      </section>

      <!-- Accessibility note -->
      <section>
        <div class="rounded-xl border border-border bg-muted/30 p-5">
          <div class="flex items-center gap-2 mb-1.5">
            <and-icon name="accessibility" size="16" class="text-primary"></and-icon>
            <h3 class="text-sm font-semibold text-foreground m-0">Accessibility, either way</h3>
          </div>
          <p class="text-sm text-muted-foreground m-0 leading-relaxed">
            Icons are decorative by default in both APIs — pair with <code class="text-xs">aria-hidden="true"</code>
            and put the accessible name on the surrounding control (e.g.
            <code class="text-xs">aria-label</code> on a button), never on the icon itself.
          </p>
        </div>
      </section>
    </div>
  `,
})
export default class IconsExamplesDemo {
  sizes = [16, 20, 24, 32, 40];
}

import { AndIcon } from '@angular-components/stencil-generated/components';
import { Component } from '@angular/core';
import { ALL_ICONS } from '@andersseen/icon-library';

@Component({
  selector: 'app-icons-demo',
  imports: [AndIcon],
  template: `
    <div class="max-w-4xl mx-auto pb-12">
      <!-- Header -->
      <header class="mb-10 border-b border-border pb-10">
        <h1 class="text-3xl font-bold tracking-tight text-foreground m-0">
          Icons
        </h1>
        <p
          class="mt-4 text-lg text-muted-foreground max-w-2xl leading-relaxed"
        >
          A standalone, tree-shakable SVG icon library. Register only the icons
          you need for optimized bundles, or use
          <code class="text-sm bg-muted px-1.5 py-0.5 rounded">registerAllIcons()</code>
          for rapid prototyping.
        </p>
        <div class="mt-4 flex items-center gap-2">
          <span
            class="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
          >
            {{ allIcons.length }} icons
          </span>
          <span
            class="inline-flex items-center rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground"
          >
            &#64;andersseen/icon-library
          </span>
        </div>
      </header>

      <!-- Search -->
      <section class="mb-8">
        <input
          type="text"
          placeholder="Search icons…"
          [value]="searchQuery"
          (input)="onSearch($event)"
          class="w-full rounded-lg border border-border bg-card px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </section>

      <!-- All Icons Grid -->
      <section class="mb-12">
        <h2 class="text-xl font-semibold tracking-tight text-foreground mb-5">
          All Icons
        </h2>
        <div
          class="rounded-xl border border-border bg-card overflow-hidden shadow-sm"
        >
          <div class="p-6">
            <div
              class="grid gap-3"
              style="grid-template-columns: repeat(auto-fill, minmax(110px, 1fr))"
            >
              @for (icon of filteredIcons; track icon) {
                <button
                  class="flex flex-col items-center gap-2 rounded-lg border border-border p-3 transition-all hover:border-primary/40 hover:bg-accent cursor-pointer bg-transparent"
                  (click)="copyName(icon)"
                  [title]="'Copy: ' + icon"
                >
                  <and-icon [name]="icon" size="22"></and-icon>
                  <span
                    class="text-[11px] text-muted-foreground text-center leading-tight truncate w-full"
                    >{{ icon }}</span
                  >
                </button>
              }
            </div>
            @if (filteredIcons.length === 0) {
              <p class="text-center text-muted-foreground py-8">
                No icons match "{{ searchQuery }}"
              </p>
            }
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
          <div class="p-8 flex items-end justify-center gap-8">
            @for (size of sizes; track size) {
              <div class="flex flex-col items-center gap-2">
                <and-icon name="star" [size]="size"></and-icon>
                <span class="text-xs text-muted-foreground">{{ size }}px</span>
              </div>
            }
          </div>
        </div>
      </section>

      <!-- Colors via CSS -->
      <section class="mb-12">
        <h2 class="text-xl font-semibold tracking-tight text-foreground mb-5">
          Color Inheritance
        </h2>
        <div
          class="rounded-xl border border-border bg-card overflow-hidden shadow-sm"
        >
          <div class="p-8 flex items-center justify-center gap-6">
            <and-icon name="heart" size="28" class="text-destructive"></and-icon>
            <and-icon name="check" size="28" class="text-primary"></and-icon>
            <and-icon name="star" size="28" class="text-warning"></and-icon>
            <and-icon
              name="info"
              size="28"
              class="text-muted-foreground"
            ></and-icon>
          </div>
          <div class="border-t border-border bg-muted/30 px-5 py-3">
            <p class="text-xs text-muted-foreground m-0">
              Icons inherit <code class="text-xs">color</code> from their
              parent via <code class="text-xs">currentColor</code>. Apply any
              text color utility to tint them.
            </p>
          </div>
        </div>
      </section>

      <!-- Usage Code -->
      <section class="mb-12">
        <h2 class="text-xl font-semibold tracking-tight text-foreground mb-5">
          Usage
        </h2>

        <!-- Registration -->
        <div
          class="rounded-xl border border-border overflow-x-auto shadow-sm mb-4"
        >
          <div class="bg-muted/50 px-5 py-3 border-b border-border">
            <span
              class="text-xs font-medium text-muted-foreground tracking-wide uppercase"
              >Registration (main.ts)</span
            >
          </div>
          <pre
            class="m-0 p-5 font-mono text-[13px] leading-relaxed text-foreground/80 bg-muted/20"
          ><code>// Production — tree-shakable, register only what you need
import {{ '{' }} registerIcons, CLOSE, HOME, CHEVRON_DOWN {{ '}' }} from '&#64;andersseen/icon-library';

registerIcons({{ '{' }}
  close: CLOSE,
  home: HOME,
  'chevron-down': CHEVRON_DOWN,
{{ '}' }});

// Or register all icons used internally by stencil components
import {{ '{' }} registerIcons, COMPONENT_ICONS {{ '}' }} from '&#64;andersseen/icon-library';
registerIcons(COMPONENT_ICONS);</code></pre>
        </div>

        <!-- Template -->
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
          ><code>&lt;and-icon name="home" size="24"&gt;&lt;/and-icon&gt;
&lt;and-icon name="star" size="20" class="text-warning"&gt;&lt;/and-icon&gt;
&lt;and-icon name="close" size="16"&gt;&lt;/and-icon&gt;</code></pre>
        </div>
      </section>

      <!-- Features -->
      <section>
        <h2 class="text-xl font-semibold tracking-tight text-foreground mb-5">
          Features
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          @for (feature of features; track feature.title) {
            <div class="rounded-xl border border-border bg-card p-5 shadow-sm">
              <div class="flex items-center gap-3 mb-2">
                <and-icon
                  [name]="feature.icon"
                  size="18"
                  class="text-primary"
                ></and-icon>
                <h3 class="text-sm font-semibold text-foreground m-0">
                  {{ feature.title }}
                </h3>
              </div>
              <p class="text-sm text-muted-foreground m-0 leading-relaxed">
                {{ feature.description }}
              </p>
            </div>
          }
        </div>
      </section>
    </div>
  `,
})
export default class IconsDemoPage {
  searchQuery = '';
  allIcons = Object.keys(ALL_ICONS).sort();
  filteredIcons = this.allIcons;
  sizes = [14, 18, 22, 28, 36, 48];

  features = [
    {
      icon: 'layers',
      title: 'Tree-Shakable',
      description:
        'Import only the icons you use. Each icon is an individual export — unused icons are eliminated at build time.',
    },
    {
      icon: 'box',
      title: 'Standalone Package',
      description:
        'Install @andersseen/icon-library independently. No dependency on stencil or any framework.',
    },
    {
      icon: 'sliders',
      title: 'Registry Pattern',
      description:
        'Register icons once at bootstrap. Components resolve them at render time via a global registry.',
    },
    {
      icon: 'code',
      title: 'Pure SVG Paths',
      description:
        'Icons are lightweight SVG path strings — no font files, no external requests, no FOUC.',
    },
  ];

  onSearch(event: Event) {
    const value = (event.target as HTMLInputElement).value.toLowerCase();
    this.searchQuery = value;
    this.filteredIcons = value
      ? this.allIcons.filter((name) => name.includes(value))
      : this.allIcons;
  }

  copyName(name: string) {
    navigator.clipboard?.writeText(name);
  }
}

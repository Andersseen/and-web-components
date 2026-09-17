import { AndIcon } from '@andersseen/angular-components';
import { Component } from '@angular/core';

@Component({
  selector: 'app-icons-usage-demo',
  imports: [AndIcon],
  template: `
    <div class="max-w-4xl mx-auto pb-12">
      <!-- Header -->
      <header class="mb-10 border-b border-border pb-10">
        <h1 class="text-3xl font-bold tracking-tight text-foreground m-0">Usage &amp; API</h1>
        <p class="mt-4 text-lg text-muted-foreground max-w-2xl leading-relaxed">
          Install once, then pick a registration strategy for the Web Component path, or skip registration entirely with
          the CSS-only path.
        </p>
      </header>

      <!-- Install -->
      <section class="mb-12">
        <h2 class="text-xl font-semibold tracking-tight text-foreground mb-5">Install</h2>
        <div class="rounded-xl border border-border overflow-x-auto shadow-sm">
          <pre
            class="m-0 p-5 font-mono text-[13px] leading-relaxed text-foreground/80 bg-muted/20"
          ><code>npm install &#64;andersseen/icon</code></pre>
        </div>
      </section>

      <!-- Registration -->
      <section class="mb-12">
        <h2 class="text-xl font-semibold tracking-tight text-foreground mb-5">
          Registering icons (Web Component path)
        </h2>
        <div class="rounded-xl border border-border overflow-x-auto shadow-sm">
          <div class="bg-muted/50 px-5 py-3 border-b border-border">
            <span class="text-xs font-medium text-muted-foreground tracking-wide uppercase">main.ts</span>
          </div>
          <pre
            class="m-0 p-5 font-mono text-[13px] leading-relaxed text-foreground/80 bg-muted/20"
          ><code>// Production — tree-shakable, register only what you need
import {{ '{' }} registerIcons, CLOSE, HOME, CHEVRON_DOWN {{ '}' }} from '&#64;andersseen/icon';

registerIcons({{ '{' }}
  close: CLOSE,
  home: HOME,
  'chevron-down': CHEVRON_DOWN,
{{ '}' }});

// This app registers everything at bootstrap instead (src/app/app-icons.ts):
import {{ '{' }} registerAllIcons {{ '}' }} from '&#64;andersseen/icon';
registerAllIcons();</code></pre>
        </div>
      </section>

      <!-- CDN -->
      <section class="mb-12">
        <h2 class="text-xl font-semibold tracking-tight text-foreground mb-5">CDN (no npm)</h2>
        <p class="text-sm text-muted-foreground mb-4 max-w-2xl leading-relaxed">
          Both APIs are also available straight from jsDelivr/unpkg — no bundler required.
        </p>
        <div class="rounded-xl border border-border overflow-x-auto shadow-sm mb-4">
          <div class="bg-muted/50 px-5 py-3 border-b border-border">
            <span class="text-xs font-medium text-muted-foreground tracking-wide uppercase"
              >CSS-only, zero JavaScript</span
            >
          </div>
          <pre
            class="m-0 p-5 font-mono text-[13px] leading-relaxed text-foreground/80 bg-muted/20"
          ><code>&lt;link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/&#64;andersseen/icon&#64;&lt;version&gt;/dist/icons.css" /&gt;
&lt;span and-icon="home" aria-hidden="true"&gt;&lt;/span&gt;</code></pre>
        </div>
        <div class="rounded-xl border border-border overflow-x-auto shadow-sm">
          <div class="bg-muted/50 px-5 py-3 border-b border-border">
            <span class="text-xs font-medium text-muted-foreground tracking-wide uppercase"
              >&lt;and-icon&gt; via CDN</span
            >
          </div>
          <pre
            class="m-0 p-5 font-mono text-[13px] leading-relaxed text-foreground/80 bg-muted/20"
          ><code>&lt;script type="module" src="https://cdn.jsdelivr.net/npm/&#64;andersseen/icon&#64;&lt;version&gt;/dist/browser.js"&gt;&lt;/script&gt;
&lt;script type="module" src="https://cdn.jsdelivr.net/npm/&#64;andersseen/web-components&#64;&lt;version&gt;/dist/web-components/web-components.esm.js"&gt;&lt;/script&gt;

&lt;and-icon name="home"&gt;&lt;/and-icon&gt;</code></pre>
        </div>
      </section>

      <!-- Features -->
      <section>
        <h2 class="text-xl font-semibold tracking-tight text-foreground mb-5">Features</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          @for (feature of features; track feature.title) {
            <div class="rounded-xl border border-border bg-card p-5 shadow-sm">
              <div class="flex items-center gap-3 mb-2">
                <and-icon [name]="feature.icon" size="18" class="text-primary"></and-icon>
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
export default class IconsUsageDemo {
  features = [
    {
      icon: 'zap',
      title: 'Zero-JS Option',
      description:
        'The and-icon="name" attribute + CSS mask-image needs no registration and no Custom Element — import icons.css and go.',
    },
    {
      icon: 'layers',
      title: 'Tree-Shakable',
      description:
        'Import only the icons you use. Each icon is an individual export — unused icons are eliminated at build time.',
    },
    {
      icon: 'box',
      title: 'Standalone Package',
      description: 'Install @andersseen/icon independently. No dependency on Stencil or any framework.',
    },
    {
      icon: 'sliders',
      title: 'Registry Pattern',
      description: 'Register icons once at bootstrap. Components resolve them at render time via a global registry.',
    },
    {
      icon: 'code',
      title: 'Pure SVG Paths',
      description: 'Icons are lightweight SVG path strings — no font files, no external requests, no FOUC.',
    },
  ];
}

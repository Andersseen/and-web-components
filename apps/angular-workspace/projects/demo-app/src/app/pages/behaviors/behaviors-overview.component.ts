import { Component } from '@angular/core';

@Component({
  selector: 'app-behaviors-overview',
  template: `
    <div class="max-w-4xl mx-auto pb-12">
      <header class="mb-10 border-b border-border pb-10">
        <h1 class="text-3xl font-bold tracking-tight text-foreground m-0">Behaviors</h1>
        <p class="mt-4 text-lg text-muted-foreground max-w-2xl leading-relaxed">
          Framework-agnostic DOM behaviors driven by
          <code class="text-sm bg-muted px-1.5 py-0.5 rounded">and-*</code> attributes. Progressive enhancement for any
          HTML — no framework runtime required. Attach interaction patterns onto markup you already have.
        </p>
      </header>

      <section class="mb-12">
        <h2 class="text-xl font-semibold tracking-tight text-foreground mb-5">How it differs</h2>
        <p class="text-muted-foreground leading-relaxed mb-4">
          Unlike
          <code class="text-sm bg-muted px-1.5 py-0.5 rounded">&#64;andersseen/headless-components</code>
          (pure state machines with no DOM), behaviors wire interaction
          <em>directly onto existing elements</em>. Call
          <code class="text-sm bg-muted px-1.5 py-0.5 rounded">defineBehaviors()</code> once to scan the DOM, or use the
          imperative <code class="text-sm bg-muted px-1.5 py-0.5 rounded">create*</code>
          factories for fine-grained control.
        </p>
      </section>

      <section class="mb-12">
        <h2 class="text-xl font-semibold tracking-tight text-foreground mb-5">Installation</h2>
        <div class="rounded-xl border border-border overflow-x-auto shadow-sm">
          <div class="bg-muted/50 px-5 py-3 border-b border-border">
            <span class="text-xs font-medium text-muted-foreground tracking-wide uppercase">npm</span>
          </div>
          <pre
            class="m-0 p-5 font-mono text-[13px] leading-relaxed text-foreground/80 bg-muted/20"
          ><code>npm install &#64;andersseen/behaviors</code></pre>
        </div>
      </section>

      <section class="mb-12">
        <h2 class="text-xl font-semibold tracking-tight text-foreground mb-5">Declarative usage</h2>
        <div class="rounded-xl border border-border overflow-x-auto shadow-sm">
          <div class="bg-muted/50 px-5 py-3 border-b border-border">
            <span class="text-xs font-medium text-muted-foreground tracking-wide uppercase">HTML</span>
          </div>
          <pre
            class="m-0 p-5 font-mono text-[13px] leading-relaxed text-foreground/80 bg-muted/20"
          ><code>&lt;button and-tooltip="Save changes" and-tooltip-placement="top"&gt;Save&lt;/button&gt;

&lt;script type="module"&gt;
  import {{ '{' }} defineBehaviors {{ '}' }} from '&#64;andersseen/behaviors';
  const cleanup = defineBehaviors({{ '{' }} observe: true {{ '}' }});
&lt;/script&gt;</code></pre>
        </div>
      </section>

      <section>
        <h2 class="text-xl font-semibold tracking-tight text-foreground mb-5">Available behaviors</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          @for (item of items; track item.id) {
            <div class="rounded-xl border border-border bg-card p-5 shadow-sm">
              <div class="flex items-center justify-between gap-3">
                <h3 class="text-lg font-semibold text-foreground m-0">{{ item.label }}</h3>
                <code class="text-xs bg-muted px-1.5 py-0.5 rounded">{{ item.attr }}</code>
              </div>
              <p class="text-sm text-muted-foreground mt-2 m-0">{{ item.description }}</p>
            </div>
          }
        </div>
      </section>
    </div>
  `,
})
export default class BehaviorsOverviewComponent {
  readonly items = [
    {
      id: 'splitter',
      label: 'Splitter',
      attr: 'and-splitter',
      description: 'Resizable panel container with mouse, touch and keyboard support (arrows / Home / End).',
    },
    {
      id: 'drag-drop',
      label: 'Drag & Drop',
      attr: 'and-draggable',
      description: 'HTML5 drag sources and drop zones with optional sorting and type-based accept rules.',
    },
    {
      id: 'tooltip',
      label: 'Tooltip',
      attr: 'and-tooltip',
      description: 'Hover / focus tooltip with flip positioning, delays and Escape-to-dismiss (WCAG 1.4.13).',
    },
    {
      id: 'dialog',
      label: 'Dialog',
      attr: 'and-dialog-trigger',
      description: 'Modal/drawer dialog with backdrop, focus trap, body scroll lock and focus restoration.',
    },
  ];
}

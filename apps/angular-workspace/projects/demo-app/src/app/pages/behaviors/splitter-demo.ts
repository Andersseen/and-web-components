import { AfterViewInit, Component, ElementRef, OnDestroy, inject } from '@angular/core';
import { defineBehaviors } from '@andersseen/behaviors';

@Component({
  selector: 'app-splitter-demo',
  template: `
    <div class="max-w-4xl mx-auto pb-12">
      <header class="mb-8 sm:mb-10 border-b border-border pb-8 sm:pb-10">
        <h1 class="text-3xl font-bold tracking-tight text-foreground m-0">Splitter</h1>
        <p class="mt-4 text-lg text-muted-foreground max-w-2xl leading-relaxed">
          Resizable panel container. Drag the handle with the mouse or touch, or focus it and use the arrow keys,
          <code class="text-sm bg-muted px-1 rounded">Home</code> and
          <code class="text-sm bg-muted px-1 rounded">End</code>.
        </p>
      </header>

      <section class="mb-12">
        <h2 class="text-xl font-semibold tracking-tight text-foreground mb-5">Horizontal</h2>
        <div class="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
          <div class="p-6">
            <div class="h-64 rounded-lg border border-border overflow-hidden">
              <div and-splitter="horizontal" and-splitter-default-position="40">
                <div and-splitter-panel="primary" class="flex items-center justify-center bg-muted/40">
                  <span class="text-sm font-medium text-foreground">Primary</span>
                </div>
                <div and-splitter-handle class="w-1.5 bg-border transition-colors hover:bg-primary/60"></div>
                <div and-splitter-panel="secondary" class="flex items-center justify-center bg-muted/20">
                  <span class="text-sm font-medium text-foreground">Secondary</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="mb-12">
        <h2 class="text-xl font-semibold tracking-tight text-foreground mb-5">Vertical</h2>
        <div class="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
          <div class="p-6">
            <div class="h-72 rounded-lg border border-border overflow-hidden">
              <div
                and-splitter="vertical"
                and-splitter-default-position="50"
                and-splitter-min="20"
                and-splitter-max="80"
              >
                <div and-splitter-panel="primary" class="flex items-center justify-center bg-muted/40">
                  <span class="text-sm font-medium text-foreground">Top</span>
                </div>
                <div and-splitter-handle class="h-1.5 bg-border transition-colors hover:bg-primary/60"></div>
                <div and-splitter-panel="secondary" class="flex items-center justify-center bg-muted/20">
                  <span class="text-sm font-medium text-foreground">Bottom</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 class="text-xl font-semibold tracking-tight text-foreground mb-5">Usage</h2>
        <div class="rounded-xl border border-border overflow-x-auto shadow-sm">
          <div class="bg-muted/50 px-5 py-3 border-b border-border">
            <span class="text-xs font-medium text-muted-foreground tracking-wide uppercase">Template</span>
          </div>
          <pre
            class="m-0 p-5 font-mono text-[13px] leading-relaxed text-foreground/80 bg-muted/20"
          ><code>&lt;div and-splitter="horizontal" and-splitter-default-position="40"&gt;
  &lt;div and-splitter-panel="primary"&gt;Left&lt;/div&gt;
  &lt;div and-splitter-handle&gt;&lt;/div&gt;
  &lt;div and-splitter-panel="secondary"&gt;Right&lt;/div&gt;
&lt;/div&gt;

&lt;script type="module"&gt;
  import {{ '{' }} defineBehaviors {{ '}' }} from '&#64;andersseen/behaviors';
  defineBehaviors();
&lt;/script&gt;</code></pre>
        </div>
      </section>
    </div>
  `,
})
export default class SplitterDemo implements AfterViewInit, OnDestroy {
  private readonly host = inject(ElementRef<HTMLElement>);
  private cleanup?: () => void;

  ngAfterViewInit(): void {
    this.cleanup = defineBehaviors({ root: this.host.nativeElement });
  }

  ngOnDestroy(): void {
    this.cleanup?.();
  }
}

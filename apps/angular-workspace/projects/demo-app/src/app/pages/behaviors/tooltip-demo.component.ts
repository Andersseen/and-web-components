import { AfterViewInit, Component, ElementRef, OnDestroy, inject } from '@angular/core';
import { defineBehaviors } from '@andersseen/behaviors';

@Component({
  selector: 'app-tooltip-demo',
  template: `
    <div class="max-w-4xl mx-auto pb-12">
      <header class="mb-10 border-b border-border pb-10">
        <h1 class="text-3xl font-bold tracking-tight text-foreground m-0">Tooltip</h1>
        <p class="mt-4 text-lg text-muted-foreground max-w-2xl leading-relaxed">
          Hover or focus a trigger to reveal its tooltip. Positions flip to stay in the viewport, and
          <code class="text-sm bg-muted px-1 rounded">Escape</code> dismisses without moving the pointer (WCAG 1.4.13).
        </p>
      </header>

      <section class="mb-12">
        <h2 class="text-xl font-semibold tracking-tight text-foreground mb-5">Placements</h2>
        <div class="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
          <div class="p-12 flex flex-wrap items-center justify-center gap-4">
            <button
              and-tooltip="Appears above"
              and-tooltip-placement="top"
              class="inline-flex h-10 items-center rounded-md border border-border bg-transparent px-4 text-sm font-medium text-foreground transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2"
            >
              Top
            </button>
            <button
              and-tooltip="Appears below"
              and-tooltip-placement="bottom"
              class="inline-flex h-10 items-center rounded-md border border-border bg-transparent px-4 text-sm font-medium text-foreground transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2"
            >
              Bottom
            </button>
            <button
              and-tooltip="Appears to the left"
              and-tooltip-placement="left"
              class="inline-flex h-10 items-center rounded-md border border-border bg-transparent px-4 text-sm font-medium text-foreground transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2"
            >
              Left
            </button>
            <button
              and-tooltip="Appears to the right"
              and-tooltip-placement="right"
              class="inline-flex h-10 items-center rounded-md border border-border bg-transparent px-4 text-sm font-medium text-foreground transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2"
            >
              Right
            </button>
          </div>
        </div>
      </section>

      <section>
        <h2 class="text-xl font-semibold tracking-tight text-foreground mb-5">Usage</h2>
        <div class="rounded-xl border border-border overflow-x-auto shadow-sm">
          <div class="bg-muted/50 px-5 py-3 border-b border-border">
            <span class="text-xs font-medium text-muted-foreground tracking-wide uppercase">Template</span>
          </div>
          <pre class="m-0 p-5 font-mono text-[13px] leading-relaxed text-foreground/80 bg-muted/20"><code>&lt;button
  and-tooltip="Save changes"
  and-tooltip-placement="top"
  and-tooltip-delay="200"
&gt;Save&lt;/button&gt;</code></pre>
        </div>
        <p class="mt-4 text-sm text-muted-foreground leading-relaxed">
          Tune with <code class="text-xs bg-muted px-1 rounded">and-tooltip-delay</code>,
          <code class="text-xs bg-muted px-1 rounded">and-tooltip-hide-delay</code>,
          <code class="text-xs bg-muted px-1 rounded">and-tooltip-offset</code>,
          <code class="text-xs bg-muted px-1 rounded">and-tooltip-interactive</code> and
          <code class="text-xs bg-muted px-1 rounded">and-tooltip-disabled</code>.
        </p>
      </section>
    </div>
  `,
})
export default class TooltipDemoComponent implements AfterViewInit, OnDestroy {
  private readonly host = inject(ElementRef<HTMLElement>);
  private cleanup?: () => void;

  ngAfterViewInit(): void {
    this.cleanup = defineBehaviors({ root: this.host.nativeElement });
  }

  ngOnDestroy(): void {
    this.cleanup?.();
  }
}

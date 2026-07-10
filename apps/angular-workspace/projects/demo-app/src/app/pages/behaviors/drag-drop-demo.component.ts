import { AfterViewInit, Component, ElementRef, OnDestroy, inject } from '@angular/core';
import { defineBehaviors } from '@andersseen/behaviors';

@Component({
  selector: 'app-drag-drop-demo',
  template: `
    <div class="max-w-4xl mx-auto pb-12">
      <header class="mb-10 border-b border-border pb-10">
        <h1 class="text-3xl font-bold tracking-tight text-foreground m-0">Drag &amp; Drop</h1>
        <p class="mt-4 text-lg text-muted-foreground max-w-2xl leading-relaxed">
          HTML5 drag sources and drop zones. A sortable zone auto-reorders its children on drop — no extra wiring
          needed.
        </p>
      </header>

      <section class="mb-12">
        <h2 class="text-xl font-semibold tracking-tight text-foreground mb-5">Sortable list</h2>
        <div class="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
          <div class="p-6">
            <div
              and-drop-zone
              and-drop-zone-sortable
              class="flex flex-col gap-2 rounded-lg border border-dashed border-border p-3 [&.and-drag-over]:border-primary [&.and-drag-over]:bg-primary/5"
            >
              @for (task of tasks; track task) {
                <div
                  and-draggable
                  class="flex items-center gap-3 rounded-md border border-border bg-background px-4 py-3 text-sm font-medium text-foreground shadow-sm [&.and-dragging]:opacity-50"
                >
                  <span class="text-muted-foreground">⠿</span>
                  {{ task }}
                </div>
              }
            </div>
            <p class="mt-3 text-xs text-muted-foreground">Drag rows to reorder them.</p>
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
          ><code>&lt;div and-drop-zone and-drop-zone-sortable&gt;
  &lt;div and-draggable&gt;Item 1&lt;/div&gt;
  &lt;div and-draggable&gt;Item 2&lt;/div&gt;
  &lt;div and-draggable&gt;Item 3&lt;/div&gt;
&lt;/div&gt;</code></pre>
        </div>
        <p class="mt-4 text-sm text-muted-foreground leading-relaxed">
          Draggables emit <code class="text-xs bg-muted px-1 rounded">and-dragstart</code> /
          <code class="text-xs bg-muted px-1 rounded">and-dragend</code>; drop zones emit
          <code class="text-xs bg-muted px-1 rounded">and-dragenter</code>,
          <code class="text-xs bg-muted px-1 rounded">and-dragover</code>,
          <code class="text-xs bg-muted px-1 rounded">and-dragleave</code> and
          <code class="text-xs bg-muted px-1 rounded">and-drop</code>. Restrict targets with
          <code class="text-xs bg-muted px-1 rounded">and-draggable-type</code> +
          <code class="text-xs bg-muted px-1 rounded">and-drop-zone-accept</code>.
        </p>
      </section>
    </div>
  `,
})
export default class DragDropDemoComponent implements AfterViewInit, OnDestroy {
  private readonly host = inject(ElementRef<HTMLElement>);
  private cleanup?: () => void;

  readonly tasks = ['Design review', 'Write tests', 'Ship release', 'Update docs'];

  ngAfterViewInit(): void {
    this.cleanup = defineBehaviors({ root: this.host.nativeElement });
  }

  ngOnDestroy(): void {
    this.cleanup?.();
  }
}

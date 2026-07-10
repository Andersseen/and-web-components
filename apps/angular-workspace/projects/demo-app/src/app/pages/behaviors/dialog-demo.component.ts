import { AfterViewInit, Component, ElementRef, OnDestroy, inject } from '@angular/core';
import { defineBehaviors } from '@andersseen/behaviors';

@Component({
  selector: 'app-dialog-demo',
  template: `
    <div class="max-w-4xl mx-auto pb-12">
      <header class="mb-10 border-b border-border pb-10">
        <h1 class="text-3xl font-bold tracking-tight text-foreground m-0">Dialog</h1>
        <p class="mt-4 text-lg text-muted-foreground max-w-2xl leading-relaxed">
          A trigger opens a modal dialog with a backdrop. Focus is trapped inside, body scroll is locked, and
          <code class="text-sm bg-muted px-1 rounded">Escape</code> or a backdrop click closes it — restoring focus to
          the trigger.
        </p>
      </header>

      <section class="mb-12">
        <h2 class="text-xl font-semibold tracking-tight text-foreground mb-5">Preview</h2>
        <div class="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
          <div class="p-12 flex flex-wrap items-center justify-center gap-4">
            <button
              and-dialog-trigger="behaviors-dialog-center"
              class="inline-flex h-10 items-center rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2"
            >
              Open centered dialog
            </button>
            <button
              and-dialog-trigger="behaviors-dialog-right"
              and-dialog-position="right"
              class="inline-flex h-10 items-center rounded-md border border-border bg-transparent px-4 text-sm font-medium text-foreground transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2"
            >
              Open side drawer
            </button>
          </div>
        </div>

        <!-- Dialog targets: hidden in the page, reparented into the dialog on open -->
        <div
          id="behaviors-dialog-center"
          class="hidden w-[min(90vw,28rem)] rounded-xl border border-border bg-card p-6 shadow-xl"
        >
          <h3 class="m-0 text-lg font-semibold text-foreground">Centered dialog</h3>
          <p class="mt-2 text-sm text-muted-foreground">
            This panel was hidden in the page and reparented into a focus-trapped modal on open.
          </p>
          <div class="mt-6 flex justify-end gap-3">
            <button
              and-dialog-close
              class="inline-flex h-9 items-center rounded-md border border-border bg-transparent px-3 text-sm font-medium text-foreground transition-colors hover:bg-accent"
            >
              Cancel
            </button>
            <button
              and-dialog-close
              class="inline-flex h-9 items-center rounded-md bg-primary px-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Confirm
            </button>
          </div>
        </div>

        <div
          id="behaviors-dialog-right"
          class="hidden h-full w-[min(90vw,22rem)] border-l border-border bg-card p-6 shadow-xl"
        >
          <h3 class="m-0 text-lg font-semibold text-foreground">Side drawer</h3>
          <p class="mt-2 text-sm text-muted-foreground">The same dialog behavior, positioned against the right edge.</p>
          <button
            and-dialog-close
            class="mt-6 inline-flex h-9 items-center rounded-md border border-border bg-transparent px-3 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Close
          </button>
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
          ><code>&lt;button and-dialog-trigger="my-dialog"&gt;Open&lt;/button&gt;

&lt;div id="my-dialog" class="hidden" and-dialog-position="center"&gt;
  &lt;h3&gt;Hello&lt;/h3&gt;
  &lt;button and-dialog-close&gt;Close&lt;/button&gt;
&lt;/div&gt;</code></pre>
        </div>
      </section>
    </div>
  `,
})
export default class DialogDemoComponent implements AfterViewInit, OnDestroy {
  private readonly host = inject(ElementRef<HTMLElement>);
  private cleanup?: () => void;

  ngAfterViewInit(): void {
    this.cleanup = defineBehaviors({ root: this.host.nativeElement });
  }

  ngOnDestroy(): void {
    this.cleanup?.();
  }
}

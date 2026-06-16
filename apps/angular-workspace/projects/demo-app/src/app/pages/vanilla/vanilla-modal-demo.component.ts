import { Component, CUSTOM_ELEMENTS_SCHEMA, signal, viewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-vanilla-modal-demo',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <div class="max-w-4xl mx-auto pb-12">
      <header class="mb-10 border-b border-border pb-10">
        <h1 class="text-3xl font-bold tracking-tight text-foreground m-0">Vanilla Modal</h1>
        <p class="mt-4 text-lg text-muted-foreground max-w-2xl leading-relaxed">
          Native custom element modal with imperative open/close and optional motion animations.
        </p>
      </header>

      <section class="mb-12">
        <h2 class="text-xl font-semibold tracking-tight text-foreground mb-5">Interactive</h2>
        <div class="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
          <div class="p-10 flex flex-col items-center justify-center gap-4 min-h-[200px]">
            <and-vanilla-button (click)="openModal()">Open modal</and-vanilla-button>

            <and-vanilla-modal #modal animated (andClose)="onClose()">
              <h2 class="text-xl font-semibold m-0">Vanilla Modal</h2>
              <p class="text-muted-foreground mt-2">
                This modal is a native custom element. It uses
                <code class="text-sm bg-muted px-1.5 py-0.5 rounded">createModal</code>
                for state and
                <code class="text-sm bg-muted px-1.5 py-0.5 rounded">createMotionPlayer</code>
                for animations.
              </p>
              <div class="mt-4 flex justify-end gap-2">
                <and-vanilla-button variant="ghost" (click)="closeModal()">Cancel</and-vanilla-button>
                <and-vanilla-button (click)="closeModal()">Confirm</and-vanilla-button>
              </div>
            </and-vanilla-modal>

            @if (lastEvent()) {
              <p class="text-sm text-muted-foreground m-0">Last event: {{ lastEvent() }}</p>
            }
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
          ><code>&lt;and-vanilla-modal open animated (andClose)="handleClose()"&gt;
  &lt;h2&gt;Title&lt;/h2&gt;
  &lt;p&gt;Content&lt;/p&gt;
&lt;/and-vanilla-modal&gt;</code></pre>
        </div>
      </section>
    </div>
  `,
})
export default class VanillaModalDemoComponent {
  private modalRef = viewChild.required<ElementRef<HTMLElement>>('modal');
  lastEvent = signal<string | null>(null);

  openModal() {
    this.modalRef().nativeElement.setAttribute('open', '');
  }

  closeModal() {
    this.modalRef().nativeElement.removeAttribute('open');
  }

  onClose() {
    this.lastEvent.set('closed');
  }
}

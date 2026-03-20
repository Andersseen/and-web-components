import { Component, input, signal } from '@angular/core';

@Component({
  selector: 'demo-code-block',
  host: { class: 'block w-full min-w-0 max-w-full' },
  template: `
    <div
      class="w-full min-w-0 max-w-full overflow-x-hidden rounded-xl border border-border bg-card shadow-sm"
    >
      <div
        class="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-border bg-card px-4 py-3 sm:px-5"
      >
        <span
          class="text-xs font-medium text-muted-foreground tracking-wide uppercase"
          >{{ label() }}</span
        >
        @if (copyable()) {
          <button
            type="button"
            class="h-7 shrink-0 rounded-md border border-border bg-background px-2.5 text-[11px] font-semibold text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            (click)="copyCode()"
          >
            {{ copied() ? 'Copied' : 'Copy' }}
          </button>
        }
      </div>
      <pre
        class="m-0 max-w-full overflow-x-auto bg-background p-4 font-mono text-[13px] leading-relaxed text-foreground whitespace-pre-wrap break-words sm:p-5 sm:whitespace-pre sm:break-normal"
      ><code class="block w-full">{{ code() }}</code></pre>
    </div>
  `,
  styles: [
    `
      :host + :host {
        margin-top: 1rem;
      }
    `,
  ],
})
export class DemoCodeBlockComponent {
  label = input<string>('Template');
  code = input.required<string>();
  copyable = input<boolean>(false);
  copyText = input<string | null>(null);
  readonly copied = signal(false);

  copyCode() {
    const text = this.copyText() ?? this.code();
    navigator.clipboard?.writeText(text);
    this.copied.set(true);
    setTimeout(() => this.copied.set(false), 1200);
  }
}

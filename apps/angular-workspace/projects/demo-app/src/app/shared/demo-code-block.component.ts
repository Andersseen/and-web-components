import { Component, input } from '@angular/core';

@Component({
  selector: 'demo-code-block',
  host: { class: 'block' },
  template: `
    <div class="rounded-xl border border-border overflow-x-auto shadow-sm">
      <div class="bg-muted/50 px-5 py-3 border-b border-border">
        <span
          class="text-xs font-medium text-muted-foreground tracking-wide uppercase"
        >{{ label() }}</span>
      </div>
      <pre
        class="m-0 p-5 font-mono text-[13px] leading-relaxed text-foreground/80 bg-muted/20"
      ><code>{{ code() }}</code></pre>
    </div>
  `,
  styles: [`:host + :host { margin-top: 1rem; }`],
})
export class DemoCodeBlockComponent {
  label = input<string>('Template');
  code = input.required<string>();
}

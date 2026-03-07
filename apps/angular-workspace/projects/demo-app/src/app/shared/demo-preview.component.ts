import { Component } from '@angular/core';

@Component({
  selector: 'demo-preview',
  template: `
    <div class="rounded-xl border border-border bg-card overflow-visible shadow-sm">
      <div class="p-10 flex flex-wrap items-center justify-center gap-6 min-h-[200px]">
        <ng-content />
      </div>
    </div>
  `,
})
export class DemoPreviewComponent {}

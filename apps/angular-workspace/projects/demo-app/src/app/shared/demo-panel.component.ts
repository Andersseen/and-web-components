import { Component, input } from '@angular/core';

@Component({
  selector: 'demo-panel',
  host: { class: 'block w-full min-w-0 max-w-full' },
  template: `
    <section
      class="w-full min-w-0 max-w-full overflow-hidden rounded-xl border border-border shadow-sm"
      [class.bg-card]="tone() === 'card'"
      [class.bg-muted]="tone() === 'muted'"
      [class.p-4]="padding() === 'md'"
      [class.p-5]="padding() === 'lg'"
    >
      @if (title() || description()) {
        <header
          class="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"
        >
          <div class="min-w-0">
            @if (title()) {
              <h3
                class="m-0 text-sm font-semibold tracking-tight text-foreground"
              >
                {{ title() }}
              </h3>
            }
            @if (description()) {
              <p class="m-0 mt-1 text-sm leading-relaxed text-muted-foreground">
                {{ description() }}
              </p>
            }
          </div>
          <div class="w-full shrink-0 empty:hidden sm:w-auto">
            <ng-content select="[panelAction]" />
          </div>
        </header>
      }
      <ng-content />
    </section>
  `,
})
export class DemoPanelComponent {
  title = input<string>('');
  description = input<string>('');
  tone = input<'card' | 'muted'>('card');
  padding = input<'md' | 'lg'>('lg');
}

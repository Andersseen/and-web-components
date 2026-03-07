import { Component, input } from '@angular/core';

@Component({
  selector: 'demo-section',
  template: `
    <section class="mb-12">
      <h2 class="text-xl font-semibold tracking-tight text-foreground mb-5">
        {{ title() }}
      </h2>
      <ng-content />
    </section>
  `,
})
export class DemoSectionComponent {
  title = input.required<string>();
}

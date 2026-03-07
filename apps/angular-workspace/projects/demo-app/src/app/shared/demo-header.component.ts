import { Component, input } from '@angular/core';

@Component({
  selector: 'demo-header',
  template: `
    <header class="mb-10 border-b border-border pb-10">
      <h1 class="text-3xl font-bold tracking-tight text-foreground m-0">
        {{ title() }}
      </h1>
      <p class="mt-4 text-lg text-muted-foreground max-w-2xl leading-relaxed">
        {{ description() }}
      </p>
    </header>
  `,
})
export class DemoHeaderComponent {
  title = input.required<string>();
  description = input.required<string>();
}

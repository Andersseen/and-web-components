import { DemoCodeBlockComponent } from '../../shared';
import { Component } from '@angular/core';
import { AndSelect, AndControl } from '@andersseen/angular-components';

@Component({
  selector: 'app-select-demo',
  imports: [AndSelect, AndControl, DemoCodeBlockComponent],
  template: `
    <div class="max-w-4xl mx-auto pb-12">
      <header class="mb-10 border-b border-border pb-10">
        <h1 class="text-3xl font-bold tracking-tight text-foreground m-0">Select</h1>
        <p class="mt-4 text-lg text-muted-foreground max-w-2xl leading-relaxed">
          Form select input for choosing one option from a list, with support for placeholder, disabled options, and
          error state. Renders in light DOM (not Shadow DOM) via a hidden mirror input, so it's a real descendant of
          whatever <code class="text-sm bg-muted px-1.5 py-0.5 rounded">&lt;form&gt;</code> wraps it and shows up in
          <code class="text-sm bg-muted px-1.5 py-0.5 rounded">FormData</code>.
        </p>
      </header>

      <section class="mb-12">
        <h2 class="text-xl font-semibold tracking-tight text-foreground mb-5">Preview</h2>
        <div class="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
          <div class="p-8">
            <div class="max-w-md mx-auto flex flex-col gap-5">
              <and-control label="Framework">
                <and-select name="framework" [options]="frameworkOptions" placeholder="Choose a framework"></and-select>
              </and-control>
              <and-control label="Plan">
                <and-select name="plan" [options]="planOptions" value="pro"></and-select>
              </and-control>
              <and-control label="Disabled">
                <and-select [options]="frameworkOptions" value="angular" [disabled]="true"></and-select>
              </and-control>
            </div>
          </div>
        </div>
      </section>

      <section class="mb-12">
        <h2 class="text-xl font-semibold tracking-tight text-foreground mb-5">Validation Example</h2>
        <div class="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
          <div class="p-8">
            <div class="max-w-md mx-auto">
              <and-control label="Country" error="Please select a country.">
                <and-select
                  name="country"
                  [options]="countryOptions"
                  [hasError]="true"
                  placeholder="Select your country"
                ></and-select>
              </and-control>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 class="text-xl font-semibold tracking-tight text-foreground mb-5">Usage</h2>
        <demo-code-block label="Template" [code]="templateCode" />
      </section>
    </div>
  `,
})
export default class SelectDemo {
  readonly frameworkOptions = [
    { text: 'Angular', value: 'angular' },
    { text: 'React', value: 'react' },
    { text: 'Vue', value: 'vue' },
    { text: 'Svelte', value: 'svelte', disabled: true },
  ];

  readonly planOptions = [
    { text: 'Free', value: 'free' },
    { text: 'Pro', value: 'pro' },
    { text: 'Enterprise', value: 'enterprise' },
  ];

  readonly countryOptions = [
    { text: 'United States', value: 'us' },
    { text: 'Canada', value: 'ca' },
    { text: 'Spain', value: 'es' },
    { text: 'Germany', value: 'de' },
  ];

  templateCode = `<and-control label="Framework">
  <and-select name="framework" [options]="frameworkOptions" placeholder="Choose framework"></and-select>
</and-control>`;
}

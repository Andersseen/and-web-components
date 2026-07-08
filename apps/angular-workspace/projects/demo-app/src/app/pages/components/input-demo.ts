import { DemoCodeBlockComponent } from '../../shared';
import { Component, signal } from '@angular/core';
import { AndInput, AndControl } from '@andersseen/angular-components';

@Component({
  selector: 'app-input-demo',
  imports: [AndInput, AndControl, DemoCodeBlockComponent],
  template: `
    <div class="max-w-4xl mx-auto pb-12">
      <!-- Header -->
      <header class="mb-10 border-b border-border pb-10">
        <h1 class="text-3xl font-bold tracking-tight text-foreground m-0">Input</h1>
        <p class="mt-4 text-lg text-muted-foreground max-w-2xl leading-relaxed">
          Form input fields for collecting user data. Renders in light DOM (not Shadow DOM), so it's a real descendant
          of whatever <code class="text-sm bg-muted px-1.5 py-0.5 rounded">&lt;form&gt;</code> wraps it —
          <code class="text-sm bg-muted px-1.5 py-0.5 rounded">FormData</code>, native validation, and autofill all
          work. Pair it with <code class="text-sm bg-muted px-1.5 py-0.5 rounded">and-control</code> for label + hint
          wiring.
        </p>
      </header>

      <!-- Preview Section -->
      <section class="mb-12">
        <h2 class="text-xl font-semibold tracking-tight text-foreground mb-5">Preview</h2>
        <div class="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
          <div class="p-8">
            <div class="max-w-md mx-auto flex flex-col gap-5">
              <and-control label="Name">
                <and-input name="name" placeholder="Enter your name" type="text"></and-input>
              </and-control>
              <and-control label="Email">
                <and-input name="email" placeholder="you@example.com" type="email"></and-input>
              </and-control>
              <and-control label="Password">
                <and-input name="password" placeholder="Enter password" type="password"></and-input>
              </and-control>
              <and-control label="Disabled">
                <and-input placeholder="Not editable" disabled="true"></and-input>
              </and-control>
            </div>
          </div>
        </div>
      </section>

      <!-- Real form example -->
      <section class="mb-12">
        <h2 class="text-xl font-semibold tracking-tight text-foreground mb-5">Real &lt;form&gt; Submission</h2>
        <p class="text-sm text-muted-foreground mb-5 max-w-2xl leading-relaxed">
          This is an actual <code class="text-xs bg-muted px-1.5 py-0.5 rounded">&lt;form&gt;</code> element. Submitting
          it reads the values via <code class="text-xs bg-muted px-1.5 py-0.5 rounded">FormData</code> — no manual
          value-collection code needed.
        </p>
        <div class="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
          <div class="p-8">
            <form class="max-w-md mx-auto flex flex-col gap-5" (submit)="onSubmit($event)">
              <div class="grid grid-cols-2 gap-4">
                <and-control label="First name">
                  <and-input name="firstName" placeholder="John" type="text"></and-input>
                </and-control>
                <and-control label="Last name">
                  <and-input name="lastName" placeholder="Doe" type="text"></and-input>
                </and-control>
              </div>
              <and-control label="Company email" hint="We'll use this for account recovery.">
                <and-input name="companyEmail" placeholder="john@company.com" type="email" required="true"></and-input>
              </and-control>
              <button
                type="submit"
                class="self-start rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium"
              >
                Submit
              </button>
            </form>
            @if (submittedData()) {
              <p class="mt-4 text-sm text-muted-foreground m-0">
                FormData: <span class="font-mono text-foreground">{{ submittedData() }}</span>
              </p>
            }
          </div>
        </div>
      </section>

      <!-- Usage Code -->
      <section>
        <h2 class="text-xl font-semibold tracking-tight text-foreground mb-5">Usage</h2>
        <demo-code-block label="Template" [code]="templateCode" />
      </section>
    </div>
  `,
})
export default class InputDemo {
  submittedData = signal<string | null>(null);

  onSubmit(event: SubmitEvent) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const data = new FormData(form);
    this.submittedData.set(JSON.stringify(Object.fromEntries(data.entries())));
  }

  templateCode = `<and-control label="Email">
  <and-input name="email" placeholder="you@example.com" type="email"></and-input>
</and-control>

<form (submit)="onSubmit($event)">
  <and-control label="Name">
    <and-input name="name" placeholder="John" type="text"></and-input>
  </and-control>
  <button type="submit">Submit</button>
</form>

<!-- and-input renders in light DOM, so this just works: -->
<!-- const data = new FormData(form); data.get('name') -->`;
}

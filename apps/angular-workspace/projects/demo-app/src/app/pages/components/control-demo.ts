import { DemoCodeBlockComponent } from '../../shared';
import { Component } from '@angular/core';
import { AndControl } from '@andersseen/angular-components';

@Component({
  selector: 'app-control-demo',
  imports: [AndControl, DemoCodeBlockComponent],
  template: `
    <div class="max-w-4xl mx-auto pb-12">
      <!-- Header -->
      <header class="mb-10 border-b border-border pb-10">
        <h1 class="text-3xl font-bold tracking-tight text-foreground m-0">Control</h1>
        <p class="mt-4 text-lg text-muted-foreground max-w-2xl leading-relaxed">
          Generic form-field wrapper for the cases
          <code class="text-sm bg-muted px-1.5 py-0.5 rounded">and-input</code> and
          <code class="text-sm bg-muted px-1.5 py-0.5 rounded">and-select</code> don't cover. It never renders a control
          itself — you slot in a native <code class="text-sm bg-muted px-1.5 py-0.5 rounded">&lt;textarea&gt;</code>, a
          native <code class="text-sm bg-muted px-1.5 py-0.5 rounded">&lt;select&gt;</code>, a third-party widget, or
          even <code class="text-sm bg-muted px-1.5 py-0.5 rounded">and-input</code> itself — and
          <code class="text-sm bg-muted px-1.5 py-0.5 rounded">and-control</code> wires up the label (<code
            class="text-sm bg-muted px-1.5 py-0.5 rounded"
            >for</code
          >/<code class="text-sm bg-muted px-1.5 py-0.5 rounded">id</code>) and the hint/error message (<code
            class="text-sm bg-muted px-1.5 py-0.5 rounded"
            >aria-describedby</code
          >) around it automatically.
        </p>
      </header>

      <!-- Native textarea -->
      <section class="mb-12">
        <h2 class="text-xl font-semibold tracking-tight text-foreground mb-5">Native textarea</h2>
        <div class="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
          <div class="p-8">
            <div class="max-w-md mx-auto">
              <and-control label="Bio" hint="Max 200 characters">
                <textarea
                  name="bio"
                  maxlength="200"
                  rows="3"
                  class="w-full box-border rounded-md border border-input bg-background px-3 py-2 text-sm font-sans shadow-sm"
                ></textarea>
              </and-control>
            </div>
          </div>
        </div>
      </section>

      <!-- Native select -->
      <section class="mb-12">
        <h2 class="text-xl font-semibold tracking-tight text-foreground mb-5">Native select</h2>
        <p class="text-sm text-muted-foreground mb-5 max-w-2xl leading-relaxed">
          Unlike <code class="text-xs bg-muted px-1.5 py-0.5 rounded">and-select</code>'s fully custom dropdown, a
          native <code class="text-xs bg-muted px-1.5 py-0.5 rounded">&lt;select&gt;</code> here means you can't restyle
          the options popup — but you get the OS-native picker (and its accessibility) for free.
        </p>
        <div class="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
          <div class="p-8">
            <div class="max-w-md mx-auto">
              <and-control label="Country" required="true" error="Please choose a country.">
                <select
                  name="country"
                  required
                  class="w-full box-border rounded-md border border-input bg-background px-3 py-2 text-sm font-sans shadow-sm"
                >
                  <option value="">Choose a country</option>
                  <option value="us">United States</option>
                  <option value="es">Spain</option>
                </select>
              </and-control>
            </div>
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
export default class ControlDemo {
  templateCode = `<and-control label="Bio" hint="Max 200 characters">
  <textarea name="bio" maxlength="200"></textarea>
</and-control>

<and-control label="Country" required="true" error="Please choose a country.">
  <select name="country" required>
    <option value="">Choose a country</option>
    <option value="us">United States</option>
  </select>
</and-control>

<!-- and-control reads the first slotted element, gives it an id if it
     doesn't have one, and wires the label's "for" + the message's
     "aria-describedby" to it — no manual id/for bookkeeping needed. -->`;
}

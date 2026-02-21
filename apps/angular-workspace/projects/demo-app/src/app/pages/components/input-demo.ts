import { Component } from '@angular/core';
import { AndInput } from '@angular-components/stencil-generated/components';

@Component({
  selector: 'app-input-demo',
  imports: [AndInput],
  template: `
    <div class="max-w-4xl mx-auto pb-12">
      <!-- Header -->
      <header class="mb-10 border-b border-border pb-10">
        <h1 class="text-3xl font-bold tracking-tight text-foreground m-0">
          Input
        </h1>
        <p class="mt-4 text-lg text-muted-foreground max-w-2xl leading-relaxed">
          Form input fields for collecting user data. Supports multiple types,
          placeholder text, and disabled states.
        </p>
      </header>

      <!-- Preview Section -->
      <section class="mb-12">
        <h2 class="text-xl font-semibold tracking-tight text-foreground mb-5">
          Preview
        </h2>
        <div
          class="rounded-xl border border-border bg-card overflow-hidden shadow-sm"
        >
          <div class="p-8">
            <div class="max-w-md mx-auto flex flex-col gap-5">
              <div class="flex flex-col gap-2">
                <label class="text-sm font-medium text-foreground">Name</label>
                <and-input placeholder="Enter your name" type="text"></and-input>
              </div>
              <div class="flex flex-col gap-2">
                <label class="text-sm font-medium text-foreground">Email</label>
                <and-input
                  placeholder="you@example.com"
                  type="email"
                ></and-input>
              </div>
              <div class="flex flex-col gap-2">
                <label class="text-sm font-medium text-foreground"
                  >Password</label
                >
                <and-input
                  placeholder="Enter password"
                  type="password"
                ></and-input>
              </div>
              <div class="flex flex-col gap-2">
                <label class="text-sm font-medium text-muted-foreground"
                  >Disabled</label
                >
                <and-input
                  placeholder="Not editable"
                  disabled="true"
                ></and-input>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Form Example -->
      <section class="mb-12">
        <h2 class="text-xl font-semibold tracking-tight text-foreground mb-5">
          Form Example
        </h2>
        <div
          class="rounded-xl border border-border bg-card overflow-hidden shadow-sm"
        >
          <div class="p-8">
            <div class="max-w-md mx-auto flex flex-col gap-5">
              <div class="grid grid-cols-2 gap-4">
                <div class="flex flex-col gap-2">
                  <label class="text-sm font-medium text-foreground"
                    >First Name</label
                  >
                  <and-input placeholder="John" type="text"></and-input>
                </div>
                <div class="flex flex-col gap-2">
                  <label class="text-sm font-medium text-foreground"
                    >Last Name</label
                  >
                  <and-input placeholder="Doe" type="text"></and-input>
                </div>
              </div>
              <div class="flex flex-col gap-2">
                <label class="text-sm font-medium text-foreground"
                  >Company Email</label
                >
                <and-input
                  placeholder="john@company.com"
                  type="email"
                ></and-input>
                <span class="text-xs text-muted-foreground"
                  >We'll use this for account recovery.</span
                >
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Usage Code -->
      <section>
        <h2 class="text-xl font-semibold tracking-tight text-foreground mb-5">
          Usage
        </h2>
        <div class="rounded-xl border border-border overflow-x-auto shadow-sm">
          <div class="bg-muted/50 px-5 py-3 border-b border-border">
            <span
              class="text-xs font-medium text-muted-foreground tracking-wide uppercase"
              >Template</span
            >
          </div>
          <pre
            class="m-0 p-5 font-mono text-[13px] leading-relaxed text-foreground/80 bg-muted/20"
          ><code>&lt;and-input placeholder="Default Input" type="text"&gt;&lt;/and-input&gt;
&lt;and-input placeholder="Email" type="email"&gt;&lt;/and-input&gt;
&lt;and-input placeholder="Password" type="password"&gt;&lt;/and-input&gt;
&lt;and-input placeholder="Disabled" disabled="true"&gt;&lt;/and-input&gt;</code></pre>
        </div>
      </section>
    </div>
  `,
})
export default class InputDemo {}

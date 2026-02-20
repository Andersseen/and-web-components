import { Component } from '@angular/core';
import {
  AndButton,
  AndNavbar,
  AndIcon,
} from '@angular-components/stencil-generated/components';

@Component({
  selector: 'app-navbar-demo',
  imports: [AndButton, AndIcon, AndNavbar],
  template: `
    <div class="max-w-4xl mx-auto pb-12">
      <!-- Header -->
      <header class="mb-10 border-b border-border pb-10">
        <h1 class="text-3xl font-bold tracking-tight text-foreground m-0">
          Navbar
        </h1>
        <p class="mt-4 text-lg text-muted-foreground max-w-2xl leading-relaxed">
          Top navigation bar with brand, navigation links, and action slots.
          Responsive by default with a mobile hamburger menu.
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
          <div class="p-6">
            <and-navbar class="border border-border rounded-lg overflow-hidden">
              <div slot="brand" class="flex items-center gap-2">
                <and-icon name="box"></and-icon>
                <span class="font-bold text-foreground">Brand</span>
              </div>
              <div slot="actions" class="flex items-center gap-2">
                <and-button variant="ghost" size="sm">Log In</and-button>
                <and-button size="sm">Sign Up</and-button>
              </div>
            </and-navbar>
          </div>

          <div class="border-t border-border bg-muted/30 px-6 py-4">
            <p class="text-sm text-muted-foreground m-0 leading-relaxed">
              Resize your browser to see the responsive hamburger menu. The
              navbar you see at the top of this app is also an
              <code class="text-xs bg-muted px-1.5 py-0.5 rounded font-mono"
                >and-navbar</code
              >
              component.
            </p>
          </div>
        </div>
      </section>

      <!-- Structure -->
      <section class="mb-12">
        <h2 class="text-xl font-semibold tracking-tight text-foreground mb-5">
          Anatomy
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div class="rounded-xl border border-border bg-card p-5">
            <h3 class="text-sm font-semibold text-foreground mb-2">
              Brand Slot
            </h3>
            <p class="text-sm text-muted-foreground m-0 leading-relaxed">
              Logo and application name displayed on the left.
            </p>
          </div>
          <div class="rounded-xl border border-border bg-card p-5">
            <h3 class="text-sm font-semibold text-foreground mb-2">
              Nav Items
            </h3>
            <p class="text-sm text-muted-foreground m-0 leading-relaxed">
              Configurable array of navigation links with active state.
            </p>
          </div>
          <div class="rounded-xl border border-border bg-card p-5">
            <h3 class="text-sm font-semibold text-foreground mb-2">
              Actions Slot
            </h3>
            <p class="text-sm text-muted-foreground m-0 leading-relaxed">
              Right side slot for buttons, dropdowns, or user avatars.
            </p>
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
          ><code>&lt;and-navbar [items]="navItems" [activeItem]="active"&gt;
  &lt;span slot="brand"&gt;My App&lt;/span&gt;
  &lt;div slot="actions"&gt;
    &lt;and-button size="sm"&gt;Sign Up&lt;/and-button&gt;
  &lt;/div&gt;
&lt;/and-navbar&gt;</code></pre>
        </div>
      </section>
    </div>
  `,
})
export default class NavbarDemo {}

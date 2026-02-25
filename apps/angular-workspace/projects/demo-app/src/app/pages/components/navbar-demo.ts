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
          Features progressive responsive collapse and multiple visual variants.
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
              <div slot="start" class="flex items-center gap-2">
                <and-icon name="box"></and-icon>
                <span class="font-bold text-foreground">Brand</span>
              </div>
              <div slot="end" class="flex items-center gap-2">
                <and-button variant="ghost" size="sm">Log In</and-button>
                <and-button size="sm">Sign Up</and-button>
              </div>
            </and-navbar>
          </div>

          <div class="border-t border-border bg-muted/30 px-6 py-4">
            <p class="text-sm text-muted-foreground m-0 leading-relaxed">
              Resize your browser to see the <strong>progressive responsive
              collapse</strong> in action: end section compacts first, then
              nav links hide, then full hamburger.
            </p>
          </div>
        </div>
      </section>

      <!-- Variants Section -->
      <section class="mb-12">
        <h2 class="text-xl font-semibold tracking-tight text-foreground mb-5">
          Variants
        </h2>
        <div class="grid grid-cols-1 gap-6">
          @for (v of variants; track v.name) {
            <div>
              <p class="text-sm font-medium text-muted-foreground mb-2">{{ v.name }}</p>
              <and-navbar [variant]="v.value" class="border border-border rounded-lg overflow-hidden">
                <div slot="start" class="flex items-center gap-2">
                  <and-icon name="box"></and-icon>
                  <span class="font-bold">Brand</span>
                </div>
                <div slot="end" class="flex items-center gap-2">
                  <and-button variant="ghost" size="icon">
                    <and-icon name="bell"></and-icon>
                  </and-button>
                  <and-button size="sm">Action</and-button>
                </div>
              </and-navbar>
            </div>
          }
        </div>
      </section>

      <!-- Progressive Collapse -->
      <section class="mb-12">
        <h2 class="text-xl font-semibold tracking-tight text-foreground mb-5">
          Progressive Responsive Collapse
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="rounded-xl border border-border bg-card p-5">
            <h3 class="text-sm font-semibold text-foreground mb-2">
              Full (> 1024px)
            </h3>
            <p class="text-sm text-muted-foreground m-0 leading-relaxed">
              All sections visible: start, centered main navigation, and full end section.
            </p>
          </div>
          <div class="rounded-xl border border-border bg-card p-5">
            <h3 class="text-sm font-semibold text-foreground mb-2">
              Compact (768–1024px)
            </h3>
            <p class="text-sm text-muted-foreground m-0 leading-relaxed">
              End section enters compact mode (icon-only). Main navigation still visible.
            </p>
          </div>
          <div class="rounded-xl border border-border bg-card p-5">
            <h3 class="text-sm font-semibold text-foreground mb-2">
              Minimal (640–768px)
            </h3>
            <p class="text-sm text-muted-foreground m-0 leading-relaxed">
              Main section hidden. Only start + compact end + hamburger visible. Nav links move to drawer.
            </p>
          </div>
          <div class="rounded-xl border border-border bg-card p-5">
            <h3 class="text-sm font-semibold text-foreground mb-2">
              Mobile (&lt; 640px)
            </h3>
            <p class="text-sm text-muted-foreground m-0 leading-relaxed">
              Only start + hamburger. Everything in a drawer.
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
              Start Slot
            </h3>
            <p class="text-sm text-muted-foreground m-0 leading-relaxed">
              Logo and application name displayed on the left via
              <code class="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">slot="start"</code>.
            </p>
          </div>
          <div class="rounded-xl border border-border bg-card p-5">
            <h3 class="text-sm font-semibold text-foreground mb-2">
              Main Slot / Nav Items
            </h3>
            <p class="text-sm text-muted-foreground m-0 leading-relaxed">
              Center area for navigation links. Use the <code class="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">items</code> prop or
              <code class="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">slot="main"</code> for custom content.
            </p>
          </div>
          <div class="rounded-xl border border-border bg-card p-5">
            <h3 class="text-sm font-semibold text-foreground mb-2">
              End Slot
            </h3>
            <p class="text-sm text-muted-foreground m-0 leading-relaxed">
              Right side area for buttons, dropdowns, or user avatars via
              <code class="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">slot="end"</code>.
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
          ><code>&lt;and-navbar
  [items]="navItems"
  [activeItem]="active"
  variant="default"
  [compactBreakpoint]="1024"
  [minimalBreakpoint]="768"
  [mobileBreakpoint]="640"
&gt;
  &lt;span slot="start"&gt;My App&lt;/span&gt;
  &lt;div slot="end"&gt;
    &lt;and-button size="sm"&gt;Sign Up&lt;/and-button&gt;
  &lt;/div&gt;
&lt;/and-navbar&gt;</code></pre>
        </div>
      </section>
    </div>
  `,
})
export default class NavbarDemo {
  variants = [
    { name: 'Default', value: 'default' },
    { name: 'Ghost', value: 'ghost' },
    { name: 'Filled', value: 'filled' },
    { name: 'Elevated', value: 'elevated' },
    { name: 'Bordered', value: 'bordered' },
    { name: 'Floating', value: 'floating' },
    { name: 'Glass', value: 'glass' },
    { name: 'Minimal', value: 'minimal' },
  ];
}

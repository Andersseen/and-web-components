import { Component } from '@angular/core';
import {
  AndButton,
  AndNavbar,
  AndIcon,
  AndTabs,
  AndTabsList,
  AndTabsTrigger,
  AndTabsContent,
} from '@angular-components/stencil-generated/components';

@Component({
  selector: 'app-navbar-demo',
  imports: [
    AndButton,
    AndIcon,
    AndNavbar,
    AndTabs,
    AndTabsList,
    AndTabsTrigger,
    AndTabsContent,
  ],
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
        <div class="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
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
        </div>
      </section>

      <!-- Usage Examples with Tabs -->
      <section class="mb-12">
        <h2 class="text-xl font-semibold tracking-tight text-foreground mb-5">
          Usage Examples
        </h2>
        <and-tabs value="route">
          <and-tabs-list>
            <and-tabs-trigger value="route">Route Active</and-tabs-trigger>
            <and-tabs-trigger value="hash">Hash Active</and-tabs-trigger>
            <and-tabs-trigger value="scroll">ScrollSpy</and-tabs-trigger>
            <and-tabs-trigger value="manual">Manual Active</and-tabs-trigger>
            <and-tabs-trigger value="slots">Slot Priority</and-tabs-trigger>
            <and-tabs-trigger value="mobile">Mobile Drawer</and-tabs-trigger>
          </and-tabs-list>

          <!-- Route Active Example -->
          <and-tabs-content value="route" class="mt-4 p-0 border-none">
            <div class="mb-4">
              <and-navbar
                [items]="routeItemsJson"
                activeMode="route"
                routeMatchMode="prefix"
                activeItem="components"
                class="border border-border rounded-lg overflow-hidden"
              >
                <div slot="start" class="flex items-center gap-2">
                  <and-icon name="compass"></and-icon>
                  <span class="font-bold">Route Active</span>
                </div>
                <div slot="end" class="flex items-center gap-2">
                  <and-button variant="ghost" size="sm">Help</and-button>
                </div>
              </and-navbar>
            </div>
            <div class="rounded-xl border border-border overflow-x-auto shadow-sm">
              <pre class="m-0 p-5 font-mono text-[13px] leading-relaxed text-foreground/80 bg-muted/20"><code>&lt;and-navbar
  [items]="routeItemsJson"
  activeMode="route"
  routeMatchMode="prefix"
  activeItem="components"
&gt;
  &lt;div slot="start" class="flex items-center gap-2"&gt;
    &lt;and-icon name="compass"&gt;&lt;/and-icon&gt;
    &lt;span class="font-bold"&gt;Route Active&lt;/span&gt;
  &lt;/div&gt;
  &lt;div slot="end" class="flex items-center gap-2"&gt;
    &lt;and-button variant="ghost" size="sm"&gt;Help&lt;/and-button&gt;
  &lt;/div&gt;
&lt;/and-navbar&gt;</code></pre>
            </div>
          </and-tabs-content>

          <!-- Hash Active Example -->
          <and-tabs-content value="hash" class="mt-4 p-0 border-none">
            <div class="mb-4">
              <and-navbar
                [items]="hashItemsJson"
                activeMode="hash"
                class="border border-border rounded-lg overflow-hidden"
              >
                <div slot="start" class="flex items-center gap-2">
                  <and-icon name="hash"></and-icon>
                  <span class="font-bold">Hash Active</span>
                </div>
              </and-navbar>
            </div>
            <div class="rounded-xl border border-border overflow-x-auto shadow-sm">
              <pre class="m-0 p-5 font-mono text-[13px] leading-relaxed text-foreground/80 bg-muted/20"><code>&lt;and-navbar
  [items]="hashItemsJson"
  activeMode="hash"
&gt;
  &lt;div slot="start" class="flex items-center gap-2"&gt;
    &lt;and-icon name="hash"&gt;&lt;/and-icon&gt;
    &lt;span class="font-bold"&gt;Hash Active&lt;/span&gt;
  &lt;/div&gt;
&lt;/and-navbar&gt;</code></pre>
            </div>
          </and-tabs-content>

          <!-- ScrollSpy Example -->
          <and-tabs-content value="scroll" class="mt-4 p-0 border-none">
            <div class="mb-4">
              <and-navbar
                [items]="hashItemsJson"
                activeMode="scroll"
                scrollSpy="true"
                scrollSpyOffset="110"
                class="border border-border rounded-lg overflow-hidden"
              >
                <div slot="start" class="flex items-center gap-2">
                  <and-icon name="hash"></and-icon>
                  <span class="font-bold">ScrollSpy</span>
                </div>
              </and-navbar>
            </div>
            <div class="rounded-xl border border-border overflow-x-auto shadow-sm">
              <pre class="m-0 p-5 font-mono text-[13px] leading-relaxed text-foreground/80 bg-muted/20"><code>&lt;and-navbar
  [items]="hashItemsJson"
  activeMode="scroll"
  scrollSpy="true"
  scrollSpyOffset="110"
&gt;
  &lt;div slot="start" class="flex items-center gap-2"&gt;
    &lt;and-icon name="hash"&gt;&lt;/and-icon&gt;
    &lt;span class="font-bold"&gt;ScrollSpy&lt;/span&gt;
  &lt;/div&gt;
&lt;/and-navbar&gt;</code></pre>
            </div>
          </and-tabs-content>

          <!-- Manual Active Example -->
          <and-tabs-content value="manual" class="mt-4 p-0 border-none">
            <div class="mb-4">
              <and-navbar
                [items]="navItemsJson"
                activeMode="manual"
                activeItem="home"
                class="border border-border rounded-lg overflow-hidden"
              >
                <div slot="start" class="flex items-center gap-2">
                  <and-icon name="compass"></and-icon>
                  <span class="font-bold">Manual Active</span>
                </div>
              </and-navbar>
            </div>
            <div class="rounded-xl border border-border overflow-x-auto shadow-sm">
              <pre class="m-0 p-5 font-mono text-[13px] leading-relaxed text-foreground/80 bg-muted/20"><code>&lt;and-navbar
  [items]="navItemsJson"
  activeMode="manual"
  activeItem="home"
&gt;
  &lt;div slot="start" class="flex items-center gap-2"&gt;
    &lt;and-icon name="compass"&gt;&lt;/and-icon&gt;
    &lt;span class="font-bold"&gt;Manual Active&lt;/span&gt;
  &lt;/div&gt;
&lt;/and-navbar&gt;</code></pre>
            </div>
          </and-tabs-content>

          <!-- Slot Priority Example -->
          <and-tabs-content value="slots" class="mt-4 p-0 border-none">
            <div class="mb-4">
              <and-navbar
                [items]="slotPriorityItemsJson"
                activeMode="manual"
                class="border border-border rounded-lg overflow-hidden"
              >
                <div slot="start" class="flex items-center gap-2">
                  <and-icon name="layers"></and-icon>
                  <span class="font-bold">Slots First</span>
                </div>
                <nav slot="nav" class="flex items-center gap-1">
                  <a href="/" class="px-3 py-2 rounded text-sm no-underline text-foreground hover:bg-accent font-medium">Custom Home</a>
                  <a href="/demo" class="px-3 py-2 rounded text-sm no-underline text-foreground hover:bg-accent font-medium">Custom Demo</a>
                  <a href="/docs" class="px-3 py-2 rounded text-sm no-underline text-foreground hover:bg-accent font-medium">Custom Docs</a>
                </nav>
              </and-navbar>
            </div>
            <div class="rounded-xl border border-border overflow-x-auto shadow-sm">
              <pre class="m-0 p-5 font-mono text-[13px] leading-relaxed text-foreground/80 bg-muted/20"><code>&lt;and-navbar
  [items]="slotPriorityItemsJson"
&gt;
  &lt;div slot="start" class="flex items-center gap-2"&gt;
    &lt;and-icon name="layers"&gt;&lt;/and-icon&gt;
    &lt;span class="font-bold"&gt;Slots First&lt;/span&gt;
  &lt;/div&gt;
  &lt;nav slot="nav" class="flex items-center gap-1"&gt;
    &lt;a href="/" class="px-3 py-2 rounded text-sm no-underline text-foreground hover:bg-accent font-medium"&gt;Custom Home&lt;/a&gt;
    &lt;a href="/demo" class="px-3 py-2 rounded text-sm no-underline text-foreground hover:bg-accent font-medium"&gt;Custom Demo&lt;/a&gt;
    &lt;a href="/docs" class="px-3 py-2 rounded text-sm no-underline text-foreground hover:bg-accent font-medium"&gt;Custom Docs&lt;/a&gt;
  &lt;/nav&gt;
&lt;/and-navbar&gt;</code></pre>
            </div>
          </and-tabs-content>

          <!-- Mobile Drawer Example -->
          <and-tabs-content value="mobile" class="mt-4 p-0 border-none">
            <div class="mb-4">
              <and-navbar
                [items]="mobileItemsJson"
                mobileBreakpoint="1200"
                class="border border-border rounded-lg overflow-hidden"
              >
                <div slot="start" class="flex items-center gap-2">
                  <and-icon name="menu"></and-icon>
                  <span class="font-bold">Drawer via Items</span>
                </div>
              </and-navbar>
            </div>
            <div class="rounded-xl border border-border overflow-x-auto shadow-sm">
              <pre class="m-0 p-5 font-mono text-[13px] leading-relaxed text-foreground/80 bg-muted/20"><code>&lt;and-navbar
  [items]="mobileItemsJson"
  mobileBreakpoint="1200"
&gt;
  &lt;div slot="start" class="flex items-center gap-2"&gt;
    &lt;and-icon name="menu"&gt;&lt;/and-icon&gt;
    &lt;span class="font-bold"&gt;Drawer via Items&lt;/span&gt;
  &lt;/div&gt;
&lt;/and-navbar&gt;</code></pre>
            </div>
          </and-tabs-content>
        </and-tabs>
      </section>

      <!-- Nav Link Item Variants -->
      <section class="mb-12">
        <h2 class="text-xl font-semibold tracking-tight text-foreground mb-5">
          Nav Link Styles (itemVariant)
        </h2>
        <p class="text-sm text-muted-foreground mb-6 leading-relaxed">
          Each <code class="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">itemVariant</code>
          changes how the individual nav links look—independently of the container variant.
        </p>
        <div class="grid grid-cols-1 gap-6">
          @for (iv of itemVariants; track iv.name) {
            <div>
              <p class="text-sm font-medium text-muted-foreground mb-2">{{ iv.name }}</p>
              <and-navbar
                [items]="navItemsJson"
                activeItem="home"
                [itemVariant]="iv.value"
                class="border border-border rounded-lg overflow-hidden"
              >
                <div slot="start" class="flex items-center gap-2">
                  <and-icon name="box"></and-icon>
                  <span class="font-bold">Brand</span>
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
  itemVariant="underline"
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
    { name: 'Filled', value: 'filled' },
    { name: 'Floating', value: 'floating' },
    { name: 'Glass', value: 'glass' },
  ];

  itemVariants = [
    { name: 'Default — subtle bg', value: 'default' },
    { name: 'Underline — bottom border', value: 'underline' },
    { name: 'Filled — solid primary bg', value: 'filled' },
  ];

  navItemsJson = JSON.stringify([
    { id: 'home', label: 'Home' },
    { id: 'products', label: 'Products' },
    { id: 'pricing', label: 'Pricing' },
    { id: 'about', label: 'About' },
    { id: 'contact', label: 'Contact' },
  ]);

  routeItemsJson = JSON.stringify([
    { id: 'home', label: 'Home', href: '/' },
    { id: 'components', label: 'Components', href: '/components' },
    { id: 'docs', label: 'Docs', href: '/docs' },
  ]);

  hashItemsJson = JSON.stringify([
    { id: 'section-1', label: 'Section 1', href: '#section-1' },
    { id: 'section-2', label: 'Section 2', href: '#section-2' },
    { id: 'section-3', label: 'Section 3', href: '#section-3' },
  ]);

  slotPriorityItemsJson = JSON.stringify([
    { id: 'hidden', label: 'This should be hidden' },
  ]);

  mobileItemsJson = JSON.stringify([
    { id: 'm1', label: 'Mobile Item 1' },
    { id: 'm2', label: 'Mobile Item 2' },
    { id: 'm3', label: 'Mobile Item 3' },
  ]);
}

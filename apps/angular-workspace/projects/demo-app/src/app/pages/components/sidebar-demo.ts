import { Component } from '@angular/core';
import {
  AndSidebar,
} from '@angular-components/stencil-generated/components';

@Component({
  selector: 'app-sidebar-demo',
  imports: [AndSidebar],
  template: `
    <div class="max-w-4xl mx-auto pb-12">
      <!-- Header -->
      <header class="mb-10 border-b border-border pb-10">
        <h1 class="text-3xl font-bold tracking-tight text-foreground m-0">
          Sidebar
        </h1>
        <p class="mt-4 text-lg text-muted-foreground max-w-2xl leading-relaxed">
          Side navigation panel for organizing app sections. Supports active
          states, icons, collapsible behavior, bottom sections, and multiple
          visual variants.
        </p>
      </header>

      <!-- Variants Section -->
      <section class="mb-12">
        <h2 class="text-xl font-semibold tracking-tight text-foreground mb-5">
          Variants
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          @for (v of variants; track v.name) {
            <div>
              <p class="text-sm font-medium text-muted-foreground mb-2">{{ v.name }}</p>
              <div class="h-64 border border-border rounded-xl overflow-hidden">
                <and-sidebar
                  [variant]="v.value"
                  [items]="sidebarItemsJson"
                  activeItem="dashboard"
                  expandedWidth="100%"
                >
                </and-sidebar>
              </div>
            </div>
          }
        </div>
      </section>

      <!-- Item Variants Section -->
      <section class="mb-12">
        <h2 class="text-xl font-semibold tracking-tight text-foreground mb-5">
          Item Styles (itemVariant)
        </h2>
        <p class="text-sm text-muted-foreground mb-6 leading-relaxed">
          Each <code class="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">itemVariant</code>
          changes how the individual sidebar items look\u2014independently of the container variant.
        </p>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (iv of itemVariants; track iv.name) {
            <div>
              <p class="text-sm font-medium text-muted-foreground mb-2">{{ iv.name }}</p>
              <div class="h-56 border border-border rounded-xl overflow-hidden">
                <and-sidebar
                  [items]="sidebarItemsJson"
                  activeItem="dashboard"
                  expandedWidth="100%"
                  [itemVariant]="iv.value"
                >
                </and-sidebar>
              </div>
            </div>
          }
        </div>
      </section>

      <!-- Preview Section -->
      <section class="mb-12">
        <h2 class="text-xl font-semibold tracking-tight text-foreground mb-5">
          Live Example
        </h2>
        <div
          class="rounded-xl border border-border bg-card overflow-hidden shadow-sm"
        >
          <div class="p-8">
            <div
              class="rounded-xl border-2 border-dashed border-border p-6 bg-muted/20 flex items-start gap-6"
            >
              <!-- Simulated sidebar -->
              <div
                class="w-48 shrink-0 rounded-lg border border-border bg-card p-4 flex flex-col gap-1"
              >
                @for (item of sidebarItems; track item.id) {
                  <div
                    class="px-3 py-2 rounded-md text-sm cursor-pointer transition-colors"
                    [class]="
                      item.active
                        ? 'bg-primary/10 text-primary font-medium'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    "
                  >
                    {{ item.label }}
                  </div>
                }
              </div>
              <!-- Simulated content -->
              <div class="flex-1">
                <div
                  class="h-32 rounded-lg border border-border bg-muted/30 flex items-center justify-center"
                >
                  <span class="text-sm text-muted-foreground"
                    >Page Content Area</span
                  >
                </div>
              </div>
            </div>
          </div>

          <div class="border-t border-border bg-muted/30 px-6 py-4">
            <p class="text-sm text-muted-foreground m-0 leading-relaxed">
              The sidebar on the left of this app is an
              <code class="text-xs bg-muted px-1.5 py-0.5 rounded font-mono"
                >and-sidebar</code
              >
              component. It updates the active item based on the current route.
            </p>
          </div>
        </div>
      </section>

      <!-- Features -->
      <section class="mb-12">
        <h2 class="text-xl font-semibold tracking-tight text-foreground mb-5">
          Features
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div class="rounded-xl border border-border bg-card p-5">
            <h3 class="text-sm font-semibold text-foreground mb-2">
              Icon Support
            </h3>
            <p class="text-sm text-muted-foreground m-0 leading-relaxed">
              Each item can display an icon for quick visual recognition.
            </p>
          </div>
          <div class="rounded-xl border border-border bg-card p-5">
            <h3 class="text-sm font-semibold text-foreground mb-2">
              Active State
            </h3>
            <p class="text-sm text-muted-foreground m-0 leading-relaxed">
              Automatically highlights the current section based on navigation.
            </p>
          </div>
          <div class="rounded-xl border border-border bg-card p-5">
            <h3 class="text-sm font-semibold text-foreground mb-2">
              Mobile Auto-Collapse
            </h3>
            <p class="text-sm text-muted-foreground m-0 leading-relaxed">
              Automatically collapses to icon-only mode on smaller viewports.
              Controlled via <code class="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">mobileCollapse</code> prop.
            </p>
          </div>
          <div class="rounded-xl border border-border bg-card p-5">
            <h3 class="text-sm font-semibold text-foreground mb-2">
              Bottom Section
            </h3>
            <p class="text-sm text-muted-foreground m-0 leading-relaxed">
              Items with <code class="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">section: 'bottom'</code>
              render in a separated footer area (e.g. Settings, Profile).
            </p>
          </div>
          <div class="rounded-xl border border-border bg-card p-5">
            <h3 class="text-sm font-semibold text-foreground mb-2">
              Multiple Variants
            </h3>
            <p class="text-sm text-muted-foreground m-0 leading-relaxed">
              8 visual variants: default, ghost, filled, elevated, bordered,
              floating, glass, and minimal.
            </p>
          </div>
          <div class="rounded-xl border border-border bg-card p-5">
            <h3 class="text-sm font-semibold text-foreground mb-2">
              Keyboard Navigation
            </h3>
            <p class="text-sm text-muted-foreground m-0 leading-relaxed">
              Arrow keys (Up/Down), Home, End for accessible keyboard navigation.
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
          ><code>&lt;and-sidebar
  [items]="sidebarItems"
  [activeItem]="activeItem"
  variant="default"
  [mobileCollapse]="true"
  [mobileBreakpoint]="768"
  (andSidebarItemClick)="onItemClick($event)"
&gt;
  &lt;div slot="footer"&gt;
    &lt;!-- Custom footer content --&gt;
  &lt;/div&gt;
&lt;/and-sidebar&gt;</code></pre>
        </div>
        <div
          class="rounded-xl border border-border overflow-x-auto shadow-sm mt-4"
        >
          <div class="bg-muted/50 px-5 py-3 border-b border-border">
            <span
              class="text-xs font-medium text-muted-foreground tracking-wide uppercase"
              >Component</span
            >
          </div>
          <pre
            class="m-0 p-5 font-mono text-[13px] leading-relaxed text-foreground/80 bg-muted/20"
          ><code>sidebarItems = [
  {{ '{' }} id: 'dashboard', label: 'Dashboard', icon: 'layout' {{ '}' }},
  {{ '{' }} id: 'analytics', label: 'Analytics', icon: 'bar-chart' {{ '}' }},
  {{ '{' }} id: 'users', label: 'Users', icon: 'users' {{ '}' }},
  // Bottom section items
  {{ '{' }} id: 'settings', label: 'Settings', icon: 'sliders', section: 'bottom' {{ '}' }},
  {{ '{' }} id: 'profile', label: 'Profile', icon: 'user', section: 'bottom' {{ '}' }},
];</code></pre>
        </div>
      </section>
    </div>
  `,
})
export default class SidebarDemo {
  sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', active: true },
    { id: 'analytics', label: 'Analytics', active: false },
    { id: 'settings', label: 'Settings', active: false },
    { id: 'users', label: 'Users', active: false },
    { id: 'billing', label: 'Billing', active: false },
  ];

  sidebarItemsJson = JSON.stringify([
    { id: 'dashboard', label: 'Dashboard', icon: 'layout' },
    { id: 'analytics', label: 'Analytics', icon: 'bar-chart' },
    { id: 'users', label: 'Users', icon: 'users' },
    { id: 'settings', label: 'Settings', icon: 'sliders', section: 'bottom' },
  ]);

  variants = [
    { name: 'Default', value: 'default' },
    { name: 'Filled', value: 'filled' },
    { name: 'Floating', value: 'floating' },
    { name: 'Glass', value: 'glass' },
  ];

  itemVariants = [
    { name: 'Default — subtle bg', value: 'default' },
    { name: 'Underline — left accent bar', value: 'underline' },
    { name: 'Filled — solid primary bg', value: 'filled' },
  ];
}

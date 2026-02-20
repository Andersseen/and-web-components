import { Component, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { createSidebar, SidebarReturn } from '@andersseen/headless-core';

@Component({
  selector: 'app-sidebar-headless-demo',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-4xl mx-auto pb-12">
      <!-- Header -->
      <header class="mb-10 border-b border-border pb-10">
        <h1 class="text-3xl font-bold tracking-tight text-foreground m-0">
          Sidebar
        </h1>
        <p class="mt-4 text-lg text-muted-foreground max-w-2xl leading-relaxed">
          A collapsible side navigation panel with support for active items and
          expand/collapse states.
        </p>
      </header>

      <!-- Preview Section -->
      <section class="mb-12">
        <h2 class="text-xl font-semibold tracking-tight text-foreground mb-5">
          Preview
        </h2>
        <div
          class="rounded-xl border border-border bg-card overflow-hidden shadow-sm p-8"
        >
          <div
            class="border rounded-md bg-background flex h-96 overflow-hidden"
          >
            <!-- Sidebar -->
            <aside
              class="border-r border-border flex flex-col transition-all duration-300 bg-muted/20"
              [class.w-64]="!collapsed()"
              [class.w-16]="collapsed()"
              [attr.data-collapsed]="sidebar.queries.isCollapsed()"
            >
              <div
                class="h-16 flex items-center justify-between px-4 border-b border-border"
              >
                @if (!collapsed()) {
                  <span class="font-bold truncate">My App</span>
                }
                <button
                  class="p-1 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground"
                  (click)="toggleCollapse()"
                  [attr.aria-label]="sidebar.getToggleProps()['aria-label']"
                  [attr.aria-expanded]="
                    sidebar.getToggleProps()['aria-expanded']
                  "
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    @if (collapsed()) {
                      <path d="m9 18 6-6-6-6" />
                    } @else {
                      <path d="m15 18-6-6 6-6" />
                    }
                  </svg>
                </button>
              </div>

              <nav class="flex-1 p-2 flex flex-col gap-1">
                @for (item of items; track item.id) {
                  <button
                    class="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors"
                    [class.justify-center]="collapsed()"
                    [class.bg-accent]="sidebar.queries.isActive(item.id)"
                    [class.text-accent-foreground]="
                      sidebar.queries.isActive(item.id)
                    "
                    [class.text-muted-foreground]="
                      !sidebar.queries.isActive(item.id)
                    "
                    [class.hover:bg-accent]="!sidebar.queries.isActive(item.id)"
                    [class.hover:text-accent-foreground]="
                      !sidebar.queries.isActive(item.id)
                    "
                    (click)="setActiveItem(item.id)"
                    [attr.title]="collapsed() ? item.label : null"
                  >
                    <span class="shrink-0">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <rect width="7" height="7" x="3" y="3" rx="1" />
                        <rect width="7" height="7" x="14" y="3" rx="1" />
                        <rect width="7" height="7" x="14" y="14" rx="1" />
                        <rect width="7" height="7" x="3" y="14" rx="1" />
                      </svg>
                    </span>
                    @if (!collapsed()) {
                      <span class="truncate">{{ item.label }}</span>
                    }
                  </button>
                }
              </nav>

              <div class="p-4 border-t border-border">
                @if (!collapsed()) {
                  <div class="flex items-center gap-3">
                    <div class="h-8 w-8 rounded-full bg-accent"></div>
                    <div class="text-xs">
                      <div class="font-medium">User Name</div>
                      <div class="text-muted-foreground">
                        user&#64;example.com
                      </div>
                    </div>
                  </div>
                } @else {
                  <div class="h-8 w-8 rounded-full bg-accent mx-auto"></div>
                }
              </div>
            </aside>

            <!-- Main Content -->
            <main class="flex-1 p-8 overflow-auto">
              <h2 class="text-2xl font-bold mb-4">
                {{ getActiveLabel() }}
              </h2>
              <div class="grid gap-4">
                <div
                  class="h-32 rounded-md bg-muted/20 border-2 border-dashed border-muted"
                ></div>
                <div
                  class="h-64 rounded-md bg-muted/20 border-2 border-dashed border-muted"
                ></div>
              </div>
            </main>
          </div>
        </div>
      </section>

      <!-- Usage Code -->
      <section class="mb-12">
        <h2 class="text-xl font-semibold tracking-tight text-foreground mb-5">
          Usage
        </h2>
        <div
          class="rounded-xl bg-primary-950 border border-primary-900 overflow-x-auto shadow-sm"
        >
          <pre
            class="m-0 p-5 font-mono text-[13px] leading-relaxed text-primary-200"
          ><code>import {{ '{' }} createSidebar {{ '}' }} from '@andersseen/headless-core';

// Initialize
const sidebar = createSidebar({{ '{' }}
  defaultActiveItem: 'dashboard',
  defaultCollapsed: false,
  onCollapsedChange: (collapsed) => console.log('Collapsed:', collapsed)
{{ '}' }});

// Bind element props
const containerProps = sidebar.getContainerProps();
const itemProps = sidebar.getItemProps('dashboard');
const toggleProps = sidebar.getToggleProps();</code></pre>
        </div>
      </section>
    </div>
  `,
})
export default class SidebarHeadlessDemo {
  items = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'settings', label: 'Settings' },
    { id: 'projects', label: 'Projects' },
  ];

  collapsed: WritableSignal<boolean> = signal(false);
  activeItem: WritableSignal<string> = signal('dashboard');

  sidebar: SidebarReturn;

  constructor() {
    this.sidebar = createSidebar({
      defaultActiveItem: this.activeItem(),
      onActiveItemChange: (id) => this.activeItem.set(id),
      defaultCollapsed: this.collapsed(),
      onCollapsedChange: (val) => this.collapsed.set(val),
    });
  }

  setActiveItem(id: string) {
    this.sidebar.actions.setActiveItem(id);
  }

  toggleCollapse() {
    this.sidebar.actions.toggleCollapse();
  }

  getActiveLabel() {
    return (
      this.items.find((i) => i.id === this.activeItem())?.label || 'Unknown'
    );
  }
}

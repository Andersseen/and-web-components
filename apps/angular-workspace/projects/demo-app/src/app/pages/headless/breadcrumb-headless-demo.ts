import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { createBreadcrumb } from '@andersseen/headless-components';

@Component({
  selector: 'app-breadcrumb-headless-demo',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-4xl mx-auto pb-12">
      <!-- Header -->
      <header class="mb-10 border-b border-border pb-10">
        <h1 class="text-3xl font-bold tracking-tight text-foreground m-0">
          Breadcrumb
        </h1>
        <p
          class="mt-4 text-lg text-muted-foreground max-w-2xl leading-relaxed"
        >
          A navigation component that shows the user's current location within a
          hierarchy. Manages ARIA semantics and current-page tracking.
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
          <div class="p-10 flex flex-col items-center gap-8 min-h-[160px]">
            <!-- Default breadcrumb -->
            <nav aria-label="Breadcrumb" class="w-full max-w-lg">
              <ol class="flex items-center gap-1.5 text-sm flex-wrap list-none m-0 p-0">
                @for (item of items; track item.id; let last = $last) {
                  <li class="inline-flex items-center gap-1.5">
                    @if (!last) {
                      <a
                        class="text-muted-foreground hover:text-foreground transition-colors cursor-pointer no-underline"
                        (click)="navigate(item)"
                      >
                        {{ item.label }}
                      </a>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="text-muted-foreground"
                      >
                        <path d="m9 18 6-6-6-6" />
                      </svg>
                    } @else {
                      <span
                        class="font-medium text-foreground"
                        aria-current="page"
                      >
                        {{ item.label }}
                      </span>
                    }
                  </li>
                }
              </ol>
            </nav>

            <!-- With icons -->
            <nav aria-label="Breadcrumb with icons" class="w-full max-w-lg">
              <ol class="flex items-center gap-1.5 text-sm flex-wrap list-none m-0 p-0">
                <li class="inline-flex items-center gap-1.5">
                  <a
                    class="text-muted-foreground hover:text-foreground transition-colors cursor-pointer no-underline inline-flex items-center gap-1"
                    (click)="navigate(items[0])"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                    Home
                  </a>
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-muted-foreground"><path d="m9 18 6-6-6-6"/></svg>
                </li>
                <li class="inline-flex items-center gap-1.5">
                  <a
                    class="text-muted-foreground hover:text-foreground transition-colors cursor-pointer no-underline"
                    (click)="navigate(items[1])"
                  >
                    Components
                  </a>
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-muted-foreground"><path d="m9 18 6-6-6-6"/></svg>
                </li>
                <li class="inline-flex items-center gap-1.5">
                  <span class="font-medium text-foreground" aria-current="page">Breadcrumb</span>
                </li>
              </ol>
            </nav>
          </div>

          <!-- Controls -->
          <div class="border-t border-border bg-muted px-6 py-4 flex justify-center gap-4">
            <button
              class="inline-flex items-center gap-2 rounded-md text-sm font-medium h-8 px-3 border border-border bg-transparent text-foreground cursor-pointer transition-colors hover:bg-accent hover:text-accent-foreground"
              (click)="addItem()"
            >
              Add Level
            </button>
            <button
              class="inline-flex items-center gap-2 rounded-md text-sm font-medium h-8 px-3 border border-border bg-transparent text-foreground cursor-pointer transition-colors hover:bg-accent hover:text-accent-foreground"
              (click)="removeItem()"
              [disabled]="items.length <= 1"
            >
              Remove Level
            </button>
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
          ><code>import {{ '{' }} createBreadcrumb {{ '}' }} from '@andersseen/headless-components';

const breadcrumb = createBreadcrumb({{ '{' }}
  ariaLabel: 'Page breadcrumb',
  items: [
    {{ '{' }} id: 'home', label: 'Home', href: '/' {{ '}' }},
    {{ '{' }} id: 'docs', label: 'Docs', href: '/docs' {{ '}' }},
    {{ '{' }} id: 'api', label: 'API', current: true {{ '}' }},
  ],
  onNavigate: (item) => console.log('Navigate:', item),
{{ '}' }});

// Get element props
const navProps  = breadcrumb.getNavProps();
const listProps = breadcrumb.getListProps();
const itemProps = breadcrumb.getItemProps(item);
const linkProps = breadcrumb.getLinkProps(item);

// Update items
breadcrumb.actions.setItems(newItems);
breadcrumb.actions.setCurrentItem('api');</code></pre>
        </div>
      </section>

      <!-- Headless Implementation -->
      <section class="mb-12">
        <div class="flex items-center justify-between mb-2">
          <h2 class="text-xl font-semibold tracking-tight text-foreground m-0">
            Headless Implementation
          </h2>
          <span
            class="text-[11px] font-medium px-3 py-1 rounded-full bg-muted text-muted-foreground border border-border tracking-wide"
            >Zero Styles</span
          >
        </div>

        <p
          class="mt-4 text-lg text-muted-foreground max-w-2xl leading-relaxed mb-6"
        >
          The headless core handles ARIA attributes, current-page semantics, and
          keyboard navigation — you supply the markup.
        </p>

        <div
          class="rounded-xl border-2 border-dashed border-border p-8 bg-muted/30"
        >
          <nav>
            <ol style="list-style: none; padding: 0; margin: 0; display: flex; gap: 6px;">
              @for (item of headlessItems(); track item.id; let last = $last) {
                <li style="display: inline-flex; align-items: center; gap: 6px;">
                  @if (!last) {
                    <a
                      style="cursor: pointer;"
                      (click)="headlessNavigate(item)"
                    >
                      {{ item.label }}
                    </a>
                    <span>/</span>
                  } @else {
                    <span><strong>{{ item.label }}</strong> (current)</span>
                  }
                </li>
              }
            </ol>
          </nav>

          <div style="margin-top: 12px;">
            <button (click)="headlessAddItem()">Add Level</button>
            <button (click)="headlessRemoveItem()">Remove Level</button>
          </div>
        </div>
      </section>
    </div>
  `,
})
export default class BreadcrumbHeadlessDemo {
  private _breadcrumb = createBreadcrumb({
    ariaLabel: 'Demo breadcrumb',
    items: [
      { id: 'home', label: 'Home', href: '/' },
      { id: 'docs', label: 'Docs', href: '/docs' },
      { id: 'components', label: 'Components', href: '/components' },
      { id: 'breadcrumb', label: 'Breadcrumb', current: true },
    ],
    onNavigate: (item) => console.log('Navigate:', item.label),
  });

  items = [...this._breadcrumb.state.items];

  // Headless section state
  headlessItems = signal([...this._breadcrumb.state.items]);

  private nextId = 1;

  navigate(item: { id: string; label: string }) {
    console.log('Navigate to:', item.label);
  }

  addItem() {
    const id = `level-${this.nextId++}`;
    const newItem = { id, label: `Level ${this.items.length + 1}` };
    // Mark old last item as non-current
    this.items = this.items.map((i) => ({ ...i, current: false }));
    this.items = [...this.items, { ...newItem, current: true }];
  }

  removeItem() {
    if (this.items.length <= 1) return;
    this.items = this.items.slice(0, -1);
    this.items = this.items.map((i, idx) => ({
      ...i,
      current: idx === this.items.length - 1,
    }));
  }

  headlessNavigate(item: { id: string; label: string }) {
    console.log('Headless navigate to:', item.label);
  }

  headlessAddItem() {
    const id = `hl-${this.nextId++}`;
    const current = this.headlessItems();
    const updated = current.map((i) => ({ ...i, current: false }));
    this.headlessItems.set([
      ...updated,
      { id, label: `Level ${current.length + 1}`, current: true },
    ]);
  }

  headlessRemoveItem() {
    const current = this.headlessItems();
    if (current.length <= 1) return;
    const trimmed = current.slice(0, -1);
    this.headlessItems.set(
      trimmed.map((i, idx) => ({
        ...i,
        current: idx === trimmed.length - 1,
      })),
    );
  }
}

import { Component, signal, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { createDropdown } from '@andersseen/headless-core';

@Component({
  selector: 'app-dropdown-headless-demo',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-4xl mx-auto pb-12">
      <!-- Header -->
      <header class="mb-10 border-b border-border pb-10">
        <h1 class="text-3xl font-bold tracking-tight text-foreground m-0">
          Dropdown Menu
        </h1>
        <p class="mt-4 text-lg text-muted-foreground max-w-2xl leading-relaxed">
          Displays a menu to the user — such as a set of actions or functions —
          triggered by a button.
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
          <div class="p-12 flex items-center justify-center min-h-[300px]">
            <div class="relative inline-block" #dropdownContainer>
              <!-- Trigger -->
              <button
                class="inline-flex items-center gap-2 rounded-md text-sm font-medium h-10 px-4 border border-border bg-transparent text-foreground cursor-pointer transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2"
                [attr.aria-expanded]="isOpen()"
                (click)="toggle()"
                (keydown)="onTriggerKeydown($event)"
              >
                Options
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="opacity-50"
                  [class.rotate-180]="isOpen()"
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>

              <!-- Menu Content -->
              <div
                class="absolute right-0 z-50 mt-2 w-56 rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md animate-fade-in hidden"
                [class.block]="isOpen()"
                role="menu"
                tabindex="-1"
              >
                <div class="px-2 py-1.5 text-sm font-semibold text-foreground">
                  My Account
                </div>
                <div class="-mx-1 my-1 h-px bg-muted"></div>

                @for (item of items; track item.id) {
                  <button
                    class="relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none bg-transparent border-0 text-popover-foreground hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    role="menuitem"
                    (click)="select(item)"
                    (keydown)="onMenuKeydown($event)"
                  >
                    <span
                      class="mr-2 flex h-3.5 w-3.5 items-center justify-center"
                      >{{ item.icon }}</span
                    >
                    <span>{{ item.label }}</span>
                    @if (item.shortcut) {
                      <span
                        class="ml-auto text-xs tracking-widest opacity-60"
                        >{{ item.shortcut }}</span
                      >
                    }
                  </button>
                }

                <div class="-mx-1 my-1 h-px bg-muted"></div>
                <button
                  class="relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none bg-transparent border-0 text-destructive hover:bg-destructive hover:text-destructive-foreground focus:bg-destructive focus:text-destructive-foreground"
                  role="menuitem"
                  (click)="select({ label: 'Log out' })"
                >
                  <span
                    class="mr-2 flex h-3.5 w-3.5 items-center justify-center"
                    >🚪</span
                  >
                  <span>Log out</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Usage Code -->
      <section class="mb-12">
        <h2 class="text-xl font-semibold tracking-tight text-foreground mb-5">
          Usage
        </h2>
        <div
          class="rounded-xl bg-[#0a0a0a] border border-zinc-800 overflow-x-auto shadow-sm"
        >
          <pre
            class="m-0 p-5 font-mono text-[13px] leading-relaxed text-zinc-200"
          ><code>import {{ '{' }} createDropdown {{ '}' }} from '@andersseen/headless-core';

const dropdown = createDropdown({{ '{' }}
    closeOnSelect: true
{{ '}' }});

// Toggle
dropdown.actions.toggle();

// Select item
dropdown.actions.selectItem('item-id');

// Close
dropdown.actions.close();</code></pre>
        </div>
      </section>

      <!-- Raw Example -->
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
          The headless core manages the open state and focus trapping. You just
          render the elements.
        </p>

        <div
          class="rounded-xl border-2 border-dashed border-border p-8 bg-muted/30"
        >
          <div style="position: relative; display: inline-block;">
            <button (click)="toggle()">Native Button</button>

            <ul
              [style.display]="isOpen() ? 'block' : 'none'"
              style="position: absolute; top: 100%; left: 0; border: 1px solid #999; background: white; padding: 0; margin: 4px 0 0 0; list-style: none; min-width: 150px; z-index: 10;"
            >
              @for (item of items; track item.id) {
                <li
                  style="padding: 6px 12px; cursor: pointer; border-bottom: 1px solid #eee;"
                  (click)="select(item)"
                >
                  {{ item.label }}
                </li>
              }
            </ul>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [
    `
      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(-4px) scale(0.97);
        }
        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }
      .animate-fade-in {
        animation: fadeIn 0.15s ease;
      }
    `,
  ],
  host: {
    '(document:click)': 'onDocumentClick($event)',
  },
})
export default class DropdownHeadlessDemo {
  @ViewChild('dropdownContainer') container!: ElementRef;

  items = [
    { id: '1', label: 'Profile', icon: '👤', shortcut: '⇧⌘P' },
    { id: '2', label: 'Billing', icon: '💳', shortcut: '⌘B' },
    { id: '3', label: 'Settings', icon: '⚙️', shortcut: '⌘S' },
    { id: '4', label: 'Keyboard shortcuts', icon: '⌨️', shortcut: '' },
  ];

  private _dropdown = createDropdown({
    closeOnSelect: true,
    onOpenChange: (isOpen: boolean) => console.log('Dropdown open:', isOpen),
  });

  state = signal(this._dropdown.state);

  isOpen() {
    return this.state().isOpen;
  }

  toggle() {
    this._dropdown.actions.toggle();
    this.updateState();
  }

  select(item: any) {
    console.log('Selected:', item.label);
    this._dropdown.actions.selectItem(item.id || 'custom');
    this.updateState();
  }

  onTriggerKeydown(event: KeyboardEvent) {
    this._dropdown.handleTriggerKeyDown(event);
    this.updateState();
  }

  onMenuKeydown(event: KeyboardEvent) {
    this.updateState();
  }

  onDocumentClick(event: MouseEvent) {
    if (
      this.container &&
      !this.container.nativeElement.contains(event.target)
    ) {
      if (this.isOpen()) {
        this._dropdown.actions.close();
        this.updateState();
      }
    }
  }

  private updateState() {
    this.state.set(this._dropdown.state);
  }
}

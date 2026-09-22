import { Component, signal, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { createDropdown } from '@andersseen/headless-components';

@Component({
  selector: 'app-dropdown-headless-demo',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-4xl mx-auto pb-12">
      <!-- Header -->
      <header class="mb-10 border-b border-border pb-10">
        <h1 class="text-3xl font-bold tracking-tight text-foreground m-0">Dropdown Menu</h1>
        <p class="mt-4 text-lg text-muted-foreground max-w-2xl leading-relaxed">
          Displays a menu to the user — such as a set of actions or functions — triggered by a button.
        </p>
      </header>

      <!-- Preview Section -->
      <section class="headless-primitive mb-12">
        <h2 class="text-xl font-semibold tracking-tight text-foreground mb-5">Preview</h2>
        <div class="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
          <div class="p-12 flex items-center justify-center min-h-[300px]">
            <div #dropdownContainer>
              <button
                type="button"
                [attr.aria-expanded]="isOpen()"
                aria-haspopup="menu"
                (click)="toggle()"
                (keydown)="onTriggerKeydown($event)"
              >
                Options {{ isOpen() ? '▲' : '▼' }}
              </button>

              @if (isOpen()) {
                <ul role="menu" aria-label="Account actions" (keydown)="onMenuKeydown($event)">
                  <li>My Account</li>
                  @for (item of items; track item.id) {
                    <li>
                      <button type="button" role="menuitem" (click)="select(item)">
                        {{ item.label }}{{ item.shortcut ? ' (' + item.shortcut + ')' : '' }}
                      </button>
                    </li>
                  }
                  <li>
                    <button type="button" role="menuitem" (click)="select({ id: 'logout', label: 'Log out' })">
                      Log out
                    </button>
                  </li>
                </ul>
              }
            </div>
          </div>
        </div>
      </section>

      <!-- Usage Code -->
      <section class="mb-12">
        <h2 class="text-xl font-semibold tracking-tight text-foreground mb-5">Usage</h2>
        <div class="rounded-xl bg-primary-950 border border-primary-900 overflow-x-auto shadow-sm">
          <pre
            class="m-0 p-5 font-mono text-[13px] leading-relaxed text-primary-200"
          ><code>import {{ '{' }} createDropdown {{ '}' }} from '@andersseen/headless-components';

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
          <h2 class="text-xl font-semibold tracking-tight text-foreground m-0">Headless Implementation</h2>
          <span
            class="text-[11px] font-medium px-3 py-1 rounded-full bg-muted text-muted-foreground border border-border tracking-wide"
            >Zero Styles</span
          >
        </div>

        <p class="mt-4 text-lg text-muted-foreground max-w-2xl leading-relaxed mb-6">
          The headless core manages the open state and focus trapping. You just render the elements.
        </p>

        <div class="rounded-xl border-2 border-dashed border-border p-8 bg-muted/30">
          <div style="position: relative; display: inline-block;">
            <button (click)="toggle()">Native Button</button>

            <ul
              [style.display]="isOpen() ? 'block' : 'none'"
              style="position: absolute; top: 100%; left: 0; border: 1px solid #999; background: white; padding: 0; margin: 4px 0 0 0; list-style: none; min-width: 150px; z-index: 10;"
            >
              @for (item of items; track item.id) {
                <li style="padding: 6px 12px; cursor: pointer; border-bottom: 1px solid #eee;" (click)="select(item)">
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

  items: Array<{ id: string; label: string; icon: string; shortcut: string }> = [
    { id: '1', label: 'Profile', icon: '👤', shortcut: '⇧⌘P' },
    { id: '2', label: 'Billing', icon: '💳', shortcut: '⌘B' },
    { id: '3', label: 'Settings', icon: '⚙️', shortcut: '⌘S' },
    { id: '4', label: 'Keyboard shortcuts', icon: '⌨️', shortcut: '' },
  ];

  private _dropdown = createDropdown({
    closeOnSelect: true,
    onOpenChange: (_isOpen: boolean) => {
      // Dropdown state changed
    },
  });

  state = signal(this._dropdown.state);

  isOpen() {
    return this.state().isOpen;
  }

  toggle() {
    this._dropdown.actions.toggle();
    this.updateState();
  }

  select(item: { id: string; label: string }) {
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
    if (this.container && !this.container.nativeElement.contains(event.target)) {
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

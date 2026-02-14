import { Component, signal, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { createDropdown } from '@andersseen/headless-core';

@Component({
  selector: 'app-dropdown-headless-demo',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="demo-page">
      <!-- Header -->
      <header class="demo-header">
        <h1 class="demo-title">Dropdown Menu</h1>
        <p class="demo-description">
          Displays a menu to the user — such as a set of actions or functions —
          triggered by a button.
        </p>
      </header>

      <!-- Preview Section -->
      <section class="demo-section">
        <h2 class="section-title">Preview</h2>
        <div class="preview-card">
          <div class="preview-area">
            <div class="dropdown-wrapper" #dropdownContainer>
              <!-- Trigger -->
              <button
                class="trigger-btn"
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
                  style="opacity: 0.5;"
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>

              <!-- Menu Content -->
              <div
                class="dropdown-menu"
                [class.is-open]="isOpen()"
                role="menu"
                tabindex="-1"
              >
                <div class="menu-label">My Account</div>
                <div class="menu-separator"></div>

                @for (item of items; track item.id) {
                  <button
                    class="menu-item"
                    role="menuitem"
                    (click)="select(item)"
                    (keydown)="onMenuKeydown($event)"
                  >
                    <span class="menu-icon">{{ item.icon }}</span>
                    <span>{{ item.label }}</span>
                    @if (item.shortcut) {
                      <span class="menu-shortcut">{{ item.shortcut }}</span>
                    }
                  </button>
                }

                <div class="menu-separator"></div>
                <button
                  class="menu-item menu-item-danger"
                  role="menuitem"
                  (click)="select({ label: 'Log out' })"
                >
                  <span class="menu-icon">🚪</span>
                  <span>Log out</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Usage Code -->
      <section class="demo-section">
        <h2 class="section-title">Usage</h2>
        <div class="code-block">
          <pre><code>import {{ '{' }} createDropdown {{ '}' }} from '@andersseen/headless-core';

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
      <section class="demo-section">
        <div class="headless-header">
          <h2 class="section-title">Headless Implementation</h2>
          <span class="badge">Zero Styles</span>
        </div>

        <p class="demo-description" style="margin-bottom: 1.5rem;">
          The headless core manages the open state and focus trapping. You just
          render the elements.
        </p>

        <div class="headless-area">
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
      .demo-page {
        max-width: 56rem;
        margin: 0 auto;
        padding-bottom: 3rem;
      }

      .demo-header {
        margin-bottom: 2.5rem;
        border-bottom: 1px solid hsl(var(--border));
        padding-bottom: 2.5rem;
      }

      .demo-title {
        font-size: 2rem;
        font-weight: 700;
        letter-spacing: -0.025em;
        color: hsl(var(--foreground));
        margin: 0;
      }

      .demo-description {
        margin-top: 1rem;
        font-size: 1.125rem;
        color: hsl(var(--muted-foreground));
        max-width: 42rem;
        line-height: 1.7;
      }

      .demo-section {
        margin-bottom: 3rem;
      }

      .section-title {
        font-size: 1.375rem;
        font-weight: 600;
        letter-spacing: -0.015em;
        color: hsl(var(--foreground));
        margin: 0 0 1.25rem 0;
      }

      .preview-card {
        border-radius: 0.75rem;
        border: 1px solid hsl(var(--border));
        background: hsl(var(--card));
        overflow: hidden;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
      }

      .preview-area {
        padding: 3rem;
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 300px;
      }

      /* Dropdown styles */
      .dropdown-wrapper {
        position: relative;
        display: inline-block;
      }

      .trigger-btn {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        border-radius: 0.375rem;
        font-size: 0.875rem;
        font-weight: 500;
        font-family: inherit;
        height: 2.5rem;
        padding: 0 1rem;
        background: transparent;
        color: hsl(var(--foreground));
        border: 1px solid hsl(var(--border));
        cursor: pointer;
        transition: all 0.15s ease;
      }

      .trigger-btn:hover {
        background: hsl(var(--accent));
        color: hsl(var(--accent-foreground));
      }

      .trigger-btn:focus-visible {
        outline: 2px solid hsl(var(--ring));
        outline-offset: 2px;
      }

      .dropdown-menu {
        position: absolute;
        right: 0;
        z-index: 50;
        margin-top: 0.5rem;
        width: 14rem;
        border-radius: 0.5rem;
        border: 1px solid hsl(var(--border));
        background: hsl(var(--popover));
        color: hsl(var(--popover-foreground));
        padding: 0.25rem;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        display: none;
        animation: fadeIn 0.15s ease;
      }

      .dropdown-menu.is-open {
        display: block;
      }

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

      .menu-label {
        padding: 0.375rem 0.5rem;
        font-size: 0.875rem;
        font-weight: 600;
        color: hsl(var(--foreground));
      }

      .menu-separator {
        height: 1px;
        background: hsl(var(--border));
        margin: 0.25rem 0;
      }

      .menu-item {
        display: flex;
        width: 100%;
        align-items: center;
        gap: 0;
        border-radius: 0.25rem;
        padding: 0.375rem 0.5rem;
        font-size: 0.875rem;
        font-family: inherit;
        background: none;
        border: none;
        color: hsl(var(--popover-foreground));
        cursor: pointer;
        transition: background 0.1s ease;
        text-align: left;
      }

      .menu-item:hover,
      .menu-item:focus {
        background: hsl(var(--accent));
        color: hsl(var(--accent-foreground));
        outline: none;
      }

      .menu-item-danger {
        color: hsl(var(--destructive));
      }

      .menu-item-danger:hover,
      .menu-item-danger:focus {
        background: hsl(var(--destructive));
        color: hsl(var(--destructive-foreground));
      }

      .menu-icon {
        width: 1.25rem;
        margin-right: 0.5rem;
        display: inline-flex;
        font-size: 0.875rem;
      }

      .menu-shortcut {
        margin-left: auto;
        font-size: 0.75rem;
        letter-spacing: 0.05em;
        opacity: 0.5;
      }

      /* Code block */
      .code-block {
        border-radius: 0.75rem;
        background: #0a0a0a;
        border: 1px solid #27272a;
        overflow-x: auto;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      }

      .code-block pre {
        margin: 0;
        padding: 1.25rem 1.5rem;
        font-family:
          'SF Mono', 'Fira Code', 'Fira Mono', Menlo, Consolas, monospace;
        font-size: 0.8125rem;
        line-height: 1.7;
        color: #e4e4e7;
      }

      /* Headless section */
      .headless-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 0.5rem;
      }

      .badge {
        font-size: 0.6875rem;
        font-weight: 500;
        padding: 0.25rem 0.75rem;
        border-radius: 9999px;
        background: hsl(var(--muted));
        color: hsl(var(--muted-foreground));
        border: 1px solid hsl(var(--border));
        letter-spacing: 0.025em;
      }

      .headless-area {
        border-radius: 0.75rem;
        border: 2px dashed hsl(var(--border));
        padding: 2rem;
        background: hsl(var(--muted) / 0.3);
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

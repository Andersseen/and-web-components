import { Component, signal, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { createContextMenu } from '@andersseen/headless-components';

@Component({
  selector: 'app-context-menu-headless-demo',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-4xl mx-auto pb-12">
      <!-- Header -->
      <header class="mb-10 border-b border-border pb-10">
        <h1 class="text-3xl font-bold tracking-tight text-foreground m-0">Context Menu</h1>
        <p class="mt-4 text-lg text-muted-foreground max-w-2xl leading-relaxed">
          A right-click contextual menu. Handles positioning relative to the pointer, outside-click dismissal, and
          Escape-key support.
        </p>
      </header>

      <!-- Preview Section -->
      <section class="headless-primitive mb-12">
        <h2 class="text-xl font-semibold tracking-tight text-foreground mb-5">Unstyled behavior</h2>
        <fieldset>
          <legend>Context menu trigger</legend>
          <p id="context-menu-hint">Use the secondary mouse button on this control. Press Escape to close the menu.</p>
          <button type="button" aria-describedby="context-menu-hint" (contextmenu)="onContextMenu($event)" #triggerArea>
            Right-click this button
          </button>
          @if (selectedAction()) {
            <p aria-live="polite">Last selected: {{ selectedAction() }}</p>
          }
        </fieldset>

        @if (isOpen()) {
          <ul
            [style.position]="'fixed'"
            [style.zIndex]="50"
            [style.left.px]="position().x"
            [style.top.px]="position().y"
            role="menu"
            aria-label="Context menu"
          >
            @for (item of menuItems; track item.id) {
              @if (item.separator) {
                <li role="separator"><hr /></li>
              } @else {
                <li>
                  <button type="button" role="menuitem" (click)="selectItem(item)">
                    {{ item.label }}
                    @if (item.shortcut) {
                      ({{ item.shortcut }})
                    }
                  </button>
                </li>
              }
            }
          </ul>
        }
      </section>

      <!-- Usage Code -->
      <section class="mb-12">
        <h2 class="text-xl font-semibold tracking-tight text-foreground mb-5">Usage</h2>
        <div class="rounded-xl bg-primary-950 border border-primary-900 overflow-x-auto shadow-sm">
          <pre
            class="m-0 p-5 font-mono text-[13px] leading-relaxed text-primary-200"
          ><code>import {{ '{' }} createContextMenu {{ '}' }} from '@andersseen/headless-components';

const ctx = createContextMenu({{ '{' }}
  closeOnSelect: true,
  onOpenChange: (open) => console.log('Open:', open),
  onPosition: (pos) => console.log('Position:', pos),
{{ '}' }});

// Attach to trigger element
el.addEventListener('contextmenu', (e) => ctx.handleContextMenu(e));
document.addEventListener('keydown', (e) => ctx.handleKeyDown(e));

// Get element props
const triggerProps = ctx.getTriggerProps();
const panelProps   = ctx.getPanelProps('Context menu');

// Actions
ctx.actions.open({{ '{' }} x: 100, y: 200 {{ '}' }});
ctx.actions.selectItem('edit');
ctx.actions.close();</code></pre>
        </div>
      </section>

      <!-- Headless Implementation -->
      <section class="mb-12">
        <div class="flex items-center justify-between mb-2">
          <h2 class="text-xl font-semibold tracking-tight text-foreground m-0">Headless Implementation</h2>
          <span
            class="text-[11px] font-medium px-3 py-1 rounded-full bg-muted text-muted-foreground border border-border tracking-wide"
            >Zero Styles</span
          >
        </div>

        <p class="mt-4 text-lg text-muted-foreground max-w-2xl leading-relaxed mb-6">
          The headless core manages open/close state, pointer-relative positioning, and keyboard dismissal — no styling
          imposed.
        </p>

        <div class="rounded-xl border-2 border-dashed border-border p-8 bg-muted/30">
          <div
            style="position: relative; width: 260px; height: 140px; border: 1px solid #999; display: flex; align-items: center; justify-content: center; user-select: none;"
            (contextmenu)="onHeadlessContextMenu($event)"
          >
            Right-click here

            @if (headlessIsOpen()) {
              <ul
                style="position: fixed; z-index: 10; border: 1px solid #999; background: white; padding: 0; margin: 0; list-style: none; min-width: 150px;"
                [style.left.px]="headlessPosition().x"
                [style.top.px]="headlessPosition().y"
                role="menu"
              >
                <li
                  style="padding: 6px 12px; cursor: pointer; border-bottom: 1px solid #eee;"
                  (click)="headlessSelectItem('cut')"
                >
                  Cut
                </li>
                <li
                  style="padding: 6px 12px; cursor: pointer; border-bottom: 1px solid #eee;"
                  (click)="headlessSelectItem('copy')"
                >
                  Copy
                </li>
                <li
                  style="padding: 6px 12px; cursor: pointer; border-bottom: 1px solid #eee;"
                  (click)="headlessSelectItem('paste')"
                >
                  Paste
                </li>
                <li style="padding: 6px 12px; cursor: pointer; color: red;" (click)="headlessSelectItem('delete')">
                  Delete
                </li>
              </ul>
            }
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
          transform: scale(0.95);
        }
        to {
          opacity: 1;
          transform: scale(1);
        }
      }
      .animate-fade-in {
        animation: fadeIn 0.12s ease;
      }
    `,
  ],
  host: {
    '(document:click)': 'onDocumentClick($event)',
    '(document:keydown)': 'onDocumentKeydown($event)',
  },
})
export default class ContextMenuHeadlessDemo {
  @ViewChild('triggerArea') triggerArea!: ElementRef;

  menuItems: Array<{
    id?: string;
    label?: string;
    icon?: string;
    shortcut?: string;
    intent?: string;
    separator?: boolean;
  }> = [
    { id: 'back', label: 'Back', icon: '←', shortcut: '⌘[' },
    { id: 'forward', label: 'Forward', icon: '→', shortcut: '⌘]' },
    { id: 'reload', label: 'Reload', icon: '↻', shortcut: '⌘R' },
    { separator: true },
    { id: 'save', label: 'Save As…', icon: '💾', shortcut: '⇧⌘S' },
    { id: 'print', label: 'Print', icon: '🖨️', shortcut: '⌘P' },
    { separator: true },
    { id: 'inspect', label: 'Inspect', icon: '🔍', intent: 'destructive' },
  ];

  // Styled context menu
  private _ctx = createContextMenu({
    closeOnSelect: true,
    onOpenChange: (_open: boolean) => {
      // Context menu state changed
    },
  });

  isOpen = signal(false);
  position = signal({ x: 0, y: 0 });
  selectedAction = signal<string | null>(null);

  // Headless context menu
  private _headlessCtx = createContextMenu({
    closeOnSelect: true,
    onOpenChange: (open: boolean) => {
      this.headlessIsOpen.set(open);
    },
    onPosition: (pos: { x: number; y: number }) => {
      this.headlessPosition.set(pos);
    },
  });

  headlessIsOpen = signal(false);
  headlessPosition = signal({ x: 0, y: 0 });

  onContextMenu(event: MouseEvent) {
    event.preventDefault();
    this._ctx.handleContextMenu(event);
    this.isOpen.set(this._ctx.state.isOpen);
    this.position.set({ ...this._ctx.state.position });
  }

  selectItem(item: { id?: string; label?: string }) {
    if (!item.id) return;
    this.selectedAction.set(item.label ?? item.id);
    this._ctx.actions.selectItem(item.id);
    this.isOpen.set(this._ctx.state.isOpen);
  }

  onDocumentClick(event: MouseEvent) {
    // Close styled menu
    if (this.isOpen()) {
      this._ctx.actions.close();
      this.isOpen.set(false);
    }
    // Close headless menu
    if (this.headlessIsOpen()) {
      this._headlessCtx.actions.close();
      this.headlessIsOpen.set(false);
    }
  }

  onDocumentKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      if (this.isOpen()) {
        this._ctx.actions.close();
        this.isOpen.set(false);
      }
      if (this.headlessIsOpen()) {
        this._headlessCtx.actions.close();
        this.headlessIsOpen.set(false);
      }
    }
  }

  // Headless handlers
  onHeadlessContextMenu(event: MouseEvent) {
    event.preventDefault();
    this._headlessCtx.handleContextMenu(event);
    this.headlessIsOpen.set(this._headlessCtx.state.isOpen);
    this.headlessPosition.set({ ...this._headlessCtx.state.position });
  }

  headlessSelectItem(id: string) {
    alert(`Selected: ${id}`);
    this._headlessCtx.actions.selectItem(id);
    this.headlessIsOpen.set(this._headlessCtx.state.isOpen);
  }
}

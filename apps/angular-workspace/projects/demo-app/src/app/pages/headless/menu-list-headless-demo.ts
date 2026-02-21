import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { createMenuList } from '@andersseen/headless-components';

@Component({
  selector: 'app-menu-list-headless-demo',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-4xl mx-auto pb-12">
      <!-- Header -->
      <header class="mb-10 border-b border-border pb-10">
        <h1 class="text-3xl font-bold tracking-tight text-foreground m-0">
          Menu List
        </h1>
        <p
          class="mt-4 text-lg text-muted-foreground max-w-2xl leading-relaxed"
        >
          An accessible menu list for actions or navigation. Handles roving
          tabindex, keyboard navigation (arrow keys, Home, End), and
          disabled&nbsp;items.
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
          <div class="p-10 flex items-center justify-center min-h-[300px]">
            <div class="w-64 rounded-lg border border-border bg-popover p-1 shadow-sm">
              <ul
                role="menu"
                aria-label="Actions"
                class="list-none m-0 p-0"
                (keydown)="onMenuKeydown($event)"
              >
                @for (item of previewItems; track item.id; let i = $index) {
                  @if (item.separator) {
                    <li class="my-1 h-px bg-muted" role="separator"></li>
                  } @else {
                    <li
                      role="menuitem"
                      class="relative flex w-full select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none cursor-pointer transition-colors"
                      [class.text-popover-foreground]="item.intent !== 'destructive'"
                      [class.hover:bg-accent]="item.intent !== 'destructive' && !item.disabled"
                      [class.hover:text-accent-foreground]="item.intent !== 'destructive' && !item.disabled"
                      [class.focus:bg-accent]="item.intent !== 'destructive' && !item.disabled"
                      [class.text-destructive]="item.intent === 'destructive'"
                      [class.hover:bg-destructive]="item.intent === 'destructive' && !item.disabled"
                      [class.hover:text-destructive-foreground]="item.intent === 'destructive' && !item.disabled"
                      [class.opacity-50]="!!item.disabled"
                      [class.pointer-events-none]="!!item.disabled"
                      [attr.aria-disabled]="item.disabled || null"
                      [tabIndex]="i === focusedIndex() ? 0 : -1"
                      (click)="selectItem(item)"
                    >
                      <span class="mr-2">{{ item.icon }}</span>
                      <span>{{ item.label }}</span>
                      @if (item.shortcut) {
                        <span class="ml-auto text-xs tracking-widest opacity-60">
                          {{ item.shortcut }}
                        </span>
                      }
                    </li>
                  }
                }
              </ul>
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
          class="rounded-xl bg-primary-950 border border-primary-900 overflow-x-auto shadow-sm"
        >
          <pre
            class="m-0 p-5 font-mono text-[13px] leading-relaxed text-primary-200"
          ><code>import {{ '{' }} createMenuList {{ '}' }} from '@andersseen/headless-components';

const menu = createMenuList({{ '{' }}
  ariaLabel: 'File actions',
  items: [
    {{ '{' }} id: 'edit', intent: 'default' {{ '}' }},
    {{ '{' }} id: 'duplicate' {{ '}' }},
    {{ '{' }} id: 'archive', disabled: true {{ '}' }},
    {{ '{' }} id: 'delete', intent: 'destructive' {{ '}' }},
  ],
  onSelect: (id) => console.log('Selected:', id),
{{ '}' }});

// Get element props
const menuProps = menu.getMenuProps();
const itemProps = menu.getItemProps(item, index);

// Keyboard handlers
menu.handleMenuKeyDown(event);
menu.handleItemKeyDown(event, item);

// Actions
menu.actions.focusItem(2);
menu.actions.selectItem('edit');</code></pre>
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
          The headless core handles roving tabindex, arrow-key navigation,
          and disabled-item skipping. You provide the HTML.
        </p>

        <div
          class="rounded-xl border-2 border-dashed border-border p-8 bg-muted/30"
        >
          <ul
            style="list-style: none; padding: 0; margin: 0; min-width: 200px; display: inline-block;"
            role="menu"
            (keydown)="onHeadlessKeydown($event)"
          >
            @for (item of headlessMenuItems; track item.id; let i = $index) {
              <li
                role="menuitem"
                style="padding: 6px 12px; cursor: pointer; border-bottom: 1px solid #eee;"
                [style.opacity]="item.disabled ? '0.4' : '1'"
                [style.cursor]="item.disabled ? 'not-allowed' : 'pointer'"
                [tabIndex]="i === headlessFocused() ? 0 : -1"
                (click)="headlessSelect(item)"
              >
                {{ item.label }}
                @if (item.disabled) {
                  (disabled)
                }
                @if (item.intent === 'destructive') {
                  ⚠️
                }
              </li>
            }
          </ul>
        </div>
      </section>
    </div>
  `,
})
export default class MenuListHeadlessDemo {
  previewItems: any[] = [
    { id: 'profile', label: 'Profile', icon: '👤', shortcut: '⇧⌘P' },
    { id: 'settings', label: 'Settings', icon: '⚙️', shortcut: '⌘,' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { separator: true },
    { id: 'archive', label: 'Archive', icon: '📦', disabled: true },
    { id: 'export', label: 'Export', icon: '📤' },
    { separator: true },
    { id: 'delete', label: 'Delete', icon: '🗑️', intent: 'destructive' },
  ];

  private _menu = createMenuList({
    ariaLabel: 'Actions',
    items: this.previewItems
      .filter((i: any) => !i.separator)
      .map((i: any) => ({
        id: i.id,
        intent: i.intent || 'default',
        disabled: i.disabled || false,
      })),
    onSelect: (id: string) => console.log('Selected:', id),
  });

  focusedIndex = signal(this._menu.state.focusedIndex);

  // Headless section
  headlessMenuItems = [
    { id: 'edit', label: 'Edit', intent: 'default', disabled: false },
    { id: 'duplicate', label: 'Duplicate', intent: 'default', disabled: false },
    { id: 'locked', label: 'Locked item', intent: 'default', disabled: true },
    { id: 'delete', label: 'Delete', intent: 'destructive', disabled: false },
  ];

  private _headlessMenu = createMenuList({
    ariaLabel: 'Headless actions',
    items: this.headlessMenuItems.map((i) => ({
      id: i.id,
      intent: i.intent as 'default' | 'destructive',
      disabled: i.disabled,
    })),
    onSelect: (id: string) => alert(`Selected: ${id}`),
  });

  headlessFocused = signal(this._headlessMenu.state.focusedIndex);

  selectItem(item: any) {
    if (item.disabled) return;
    this._menu.actions.selectItem(item.id);
    this.focusedIndex.set(this._menu.state.focusedIndex);
  }

  onMenuKeydown(event: KeyboardEvent) {
    this._menu.handleMenuKeyDown(event);
    this.focusedIndex.set(this._menu.state.focusedIndex);
  }

  headlessSelect(item: any) {
    if (item.disabled) return;
    this._headlessMenu.actions.selectItem(item.id);
    this.headlessFocused.set(this._headlessMenu.state.focusedIndex);
  }

  onHeadlessKeydown(event: KeyboardEvent) {
    this._headlessMenu.handleMenuKeyDown(event);
    this.headlessFocused.set(this._headlessMenu.state.focusedIndex);
  }
}

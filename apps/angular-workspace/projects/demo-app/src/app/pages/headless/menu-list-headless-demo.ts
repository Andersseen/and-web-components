import { Component, ElementRef, QueryList, signal, ViewChildren } from '@angular/core';
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
        <h1 class="text-3xl font-bold tracking-tight text-foreground m-0">Menu List</h1>
        <p class="mt-4 text-lg text-muted-foreground max-w-2xl leading-relaxed">
          An accessible menu list for actions or navigation. Handles roving tabindex, keyboard navigation (arrow keys,
          Home, End), and disabled&nbsp;items.
        </p>
      </header>

      <!-- Preview Section -->
      <section class="headless-primitive mb-12">
        <h2 class="text-xl font-semibold tracking-tight text-foreground mb-5">Unstyled behavior</h2>
        <fieldset>
          <legend>Account actions</legend>
          <p>Use Arrow keys, Home, or End to move between actions. Archive is disabled.</p>
          <ul role="menu" aria-label="Account actions" (keydown)="onMenuKeydown($event)">
            @for (item of previewItems; track item.id) {
              @if (item.separator) {
                <li role="separator"><hr /></li>
              } @else {
                <li>
                  <button
                    #previewMenuItem
                    type="button"
                    role="menuitem"
                    [disabled]="item.disabled"
                    [attr.aria-disabled]="item.disabled || null"
                    [tabIndex]="isFocused(item) ? 0 : -1"
                    (click)="selectItem(item)"
                  >
                    {{ item.label }}
                    @if (item.shortcut) {
                      ({{ item.shortcut }})
                    }
                  </button>
                </li>
              }
            }
          </ul>
          <output aria-live="polite">Focused: {{ focusedItemLabel() }} · Selected: {{ selectedItemLabel() }}</output>
        </fieldset>
      </section>

      <!-- Usage Code -->
      <section class="mb-12">
        <h2 class="text-xl font-semibold tracking-tight text-foreground mb-5">Usage</h2>
        <div class="rounded-xl bg-primary-950 border border-primary-900 overflow-x-auto shadow-sm">
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
          <h2 class="text-xl font-semibold tracking-tight text-foreground m-0">Headless Implementation</h2>
          <span
            class="text-[11px] font-medium px-3 py-1 rounded-full bg-muted text-muted-foreground border border-border tracking-wide"
            >Zero Styles</span
          >
        </div>

        <p class="mt-4 text-lg text-muted-foreground max-w-2xl leading-relaxed mb-6">
          The headless core handles roving tabindex, arrow-key navigation, and disabled-item skipping. You provide the
          HTML.
        </p>

        <div class="rounded-xl border-2 border-dashed border-border p-8 bg-muted/30">
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
  @ViewChildren('previewMenuItem') previewMenuItems!: QueryList<ElementRef<HTMLButtonElement>>;

  previewItems: Array<{
    id?: string;
    label?: string;
    icon?: string;
    shortcut?: string;
    intent?: 'default' | 'destructive';
    disabled?: boolean;
    separator?: boolean;
  }> = [
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
      .filter(i => !i.separator)
      .map(i => ({
        id: i.id!,
        intent: i.intent || 'default',
        disabled: i.disabled || false,
      })),
    onSelect: (_id: string) => {
      // Menu item selected
    },
  });

  focusedIndex = signal(this._menu.state.focusedIndex);
  selectedItemLabel = signal('None');

  // Headless section
  headlessMenuItems = [
    { id: 'edit', label: 'Edit', intent: 'default', disabled: false },
    { id: 'duplicate', label: 'Duplicate', intent: 'default', disabled: false },
    { id: 'locked', label: 'Locked item', intent: 'default', disabled: true },
    { id: 'delete', label: 'Delete', intent: 'destructive', disabled: false },
  ];

  private _headlessMenu = createMenuList({
    ariaLabel: 'Headless actions',
    items: this.headlessMenuItems.map(i => ({
      id: i.id,
      intent: i.intent as 'default' | 'destructive',
      disabled: i.disabled,
    })),
    onSelect: (id: string) => alert(`Selected: ${id}`),
  });

  headlessFocused = signal(this._headlessMenu.state.focusedIndex);

  selectItem(item: { id?: string; disabled?: boolean }) {
    if (item.disabled || !item.id) return;
    this._menu.actions.selectItem(item.id);
    this.focusedIndex.set(this._menu.state.focusedIndex);
    this.selectedItemLabel.set(this.getLabel(item.id));
  }

  onMenuKeydown(event: KeyboardEvent) {
    this._menu.handleMenuKeyDown(event);
    this.focusedIndex.set(this._menu.state.focusedIndex);
    queueMicrotask(() => this.previewMenuItems.get(this.focusedIndex())?.nativeElement.focus());
  }

  isFocused(item: { id?: string }) {
    return this.getInteractiveIndex(item.id) === this.focusedIndex();
  }

  focusedItemLabel() {
    return this.getLabel(this.previewItems.filter(item => !item.separator)[this.focusedIndex()]?.id);
  }

  private getInteractiveIndex(id?: string) {
    return this.previewItems.filter(item => !item.separator).findIndex(item => item.id === id);
  }

  private getLabel(id?: string) {
    return this.previewItems.find(item => item.id === id)?.label ?? 'None';
  }

  headlessSelect(item: { id: string; disabled?: boolean }) {
    if (item.disabled) return;
    this._headlessMenu.actions.selectItem(item.id);
    this.headlessFocused.set(this._headlessMenu.state.focusedIndex);
  }

  onHeadlessKeydown(event: KeyboardEvent) {
    this._headlessMenu.handleMenuKeyDown(event);
    this.headlessFocused.set(this._headlessMenu.state.focusedIndex);
  }
}

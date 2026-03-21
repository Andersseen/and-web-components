# Accessibility Reference — Andersseen Web Components

## ARIA Patterns by Component Type

### Disclosure / Dropdown Menu

```tsx
// Trigger
<button
  id={this.triggerId}
  aria-haspopup="menu"
  aria-expanded={String(this._isOpen)}
  aria-controls={this.menuId}
  onKeyDown={this.handleTriggerKeyDown}
>
  <slot name="trigger" />
</button>

// Panel
<ul
  id={this.menuId}
  role="menu"
  aria-labelledby={this.triggerId}
  tabIndex={-1}
>
  <slot />
</ul>
```

### Context Menu

```tsx
<div
  role="presentation"
  onContextMenu={this.handleContextMenu}
  aria-haspopup="menu"
>
  <slot name="target" />
</div>

<ul role="menu" aria-label={this.label || 'Context menu'}>
  <slot />
</ul>
```

### Dialog / Modal

```tsx
<div
  role="dialog"
  aria-modal="true"
  aria-labelledby={this.titleId}
  aria-describedby={this.descriptionId}
>
  <slot name="header" />
  <slot />
  <slot name="footer" />
</div>
```

### Tabs

```tsx
<div role="tablist" aria-orientation={this.orientation}>
  {/* each tab: role="tab" aria-selected aria-controls={panelId} id={tabId} */}
</div>
<div role="tabpanel" aria-labelledby={tabId} tabindex="0">
  <slot />
</div>
```

### Accordion

```tsx
<button
  aria-expanded={String(this.isOpen)}
  aria-controls={this.panelId}
  id={this.headerId}
>
  <slot name="trigger" />
</button>
<div
  id={this.panelId}
  role="region"
  aria-labelledby={this.headerId}
  hidden={!this.isOpen}
>
  <slot />
</div>
```

### Tooltip

```tsx
// Anchor
<span
  aria-describedby={this.tooltipId}
  onMouseEnter={this.show}
  onFocus={this.show}
  onMouseLeave={this.hide}
  onBlur={this.hide}
>
  <slot name="trigger" />
</span>

// Tooltip
<div
  id={this.tooltipId}
  role="tooltip"
  class={{ hidden: !this.isVisible }}
>
  {this.content}
</div>
```

### Combobox / Select

```tsx
<input
  role="combobox"
  aria-expanded={String(this.isOpen)}
  aria-haspopup="listbox"
  aria-controls={this.listboxId}
  aria-autocomplete="list"
  aria-activedescendant={this.activeOptionId}
/>
<ul id={this.listboxId} role="listbox" aria-label={this.label}>
  {/* each option: role="option" aria-selected id={optionId} */}
</ul>
```

---

## Keyboard Navigation — Full Implementation

```tsx
private handleMenuKeyDown = (e: KeyboardEvent) => {
  const items = this.getMenuItems(); // focusable, non-disabled items

  switch (e.key) {
    case 'ArrowDown':
      e.preventDefault();
      this.focusedIndex = (this.focusedIndex + 1) % items.length;
      items[this.focusedIndex]?.focus();
      break;

    case 'ArrowUp':
      e.preventDefault();
      this.focusedIndex = (this.focusedIndex - 1 + items.length) % items.length;
      items[this.focusedIndex]?.focus();
      break;

    case 'Home':
      e.preventDefault();
      this.focusedIndex = 0;
      items[0]?.focus();
      break;

    case 'End':
      e.preventDefault();
      this.focusedIndex = items.length - 1;
      items[items.length - 1]?.focus();
      break;

    case 'Enter':
    case ' ':
      e.preventDefault();
      (items[this.focusedIndex] as HTMLElement)?.click();
      break;

    case 'Escape':
      e.preventDefault();
      this.close();
      this.triggerEl?.focus(); // Return focus to trigger — MANDATORY
      break;

    case 'Tab':
      this.close(); // Close on tab, let focus move naturally
      break;
  }
};

// Type-ahead search (for long menus)
private handleTypeAhead = (char: string) => {
  const items = this.getMenuItems();
  const match = items.find(item =>
    item.textContent?.trim().toLowerCase().startsWith(char.toLowerCase())
  );
  (match as HTMLElement)?.focus();
};
```

---

## Focus Management

### Focus Trap (Modals / Dialogs)

```tsx
private trapFocus(container: HTMLElement) {
  const focusable = container.querySelectorAll<HTMLElement>(
    'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), ' +
    'textarea:not([disabled]), [tabindex]:not([tabindex="-1"]), [contenteditable]'
  );
  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  container.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return;
    if (e.shiftKey) {
      if (document.activeElement === first) { e.preventDefault(); last.focus(); }
    } else {
      if (document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
}
```

### Screen Reader Announcements

```tsx
private announce(message: string, politeness: 'polite' | 'assertive' = 'polite') {
  const live = document.createElement('div');
  live.setAttribute('aria-live', politeness);
  live.setAttribute('aria-atomic', 'true');
  live.className = 'sr-only';
  document.body.appendChild(live);
  setTimeout(() => { live.textContent = message; }, 100);
  setTimeout(() => { document.body.removeChild(live); }, 1000);
}
```

Use `'assertive'` only for critical errors. Prefer `'polite'` for status updates.

### `prefers-reduced-motion`

```css
@media (prefers-reduced-motion: reduce) {
  :host {
    --and-duration-fast: 0ms;
    --and-duration-base: 0ms;
    --and-duration-slow: 0ms;
  }
}
```

---

## Helper — Get Focusable Menu Items

```tsx
private getMenuItems(): HTMLElement[] {
  return Array.from(
    this.el.querySelectorAll<HTMLElement>(
      '[role="menuitem"]:not([aria-disabled="true"]):not([disabled])'
    )
  );
}
```

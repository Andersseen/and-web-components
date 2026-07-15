---
title: Headless Core — Menu List
description:
  createMenuList — a focusable menuitem list with roving tabindex, separators,
  and destructive-intent items. Powers the styled Menu List component.
---

Powers [Menu List](/components/menu-list/) internally. Unlike
[Dropdown](/headless/dropdown/) and [Context Menu](/headless/context-menu/),
this factory has **no** open/close state of its own — it's just the focusable
item list, often used _inside_ one of those two for the actual panel content.

## Usage

```ts
import { createMenuList } from '@andersseen/headless-components/menu-list';

const menu = createMenuList({
  ariaLabel: 'File actions',
  items: [
    { id: 'edit', label: 'Edit' },
    { separator: true },
    { id: 'delete', label: 'Delete', intent: 'destructive' },
    { id: 'locked', label: 'Locked', disabled: true },
  ],
  onSelect: id => console.log('Selected:', id),
});

const menuProps = menu.getMenuProps();
const itemProps = menu.getItemProps(item, index);
```

## Config

| Option        | Type                       | Default  | Notes                                                                |
| ------------- | -------------------------- | -------- | -------------------------------------------------------------------- |
| `ariaLabel`   | `string`                   | `'Menu'` |                                                                      |
| `items`       | `MenuItemConfig[]`         | `[]`     | `{ id?, label?, shortcut?, icon?, separator?, intent?, disabled? }`. |
| `onSelect`    | `(itemId: string) => void` | —        |                                                                      |
| `rovingFocus` | `boolean`                  | `true`   | See [Prop-getters](#prop-getters--handlers) below.                   |

An item is only **interactive** (selectable/focusable) if `separator` is falsy
and it has a non-empty `id` — items without an `id` render but are skipped by
keyboard navigation and `queries.getInteractiveItems()`.

## State

`items`, `ariaLabel`, `focusedIndex` (`-1` = none — an index into `items`,
including separators, not into the interactive subset).

## Actions & queries

| Member                                | Signature                           | Notes                                                                                                                                |
| ------------------------------------- | ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `actions.setItems(items)`             | `(items: MenuItemConfig[]) => void` | Resets `focusedIndex` to `-1`.                                                                                                       |
| `actions.focusItem(index)`            | `(index: number) => void`           | No-ops for a separator or disabled item.                                                                                             |
| `actions.selectItem(itemId)`          | `(itemId: string) => void`          | No-ops for a disabled/non-interactive item; doesn't move focus itself.                                                               |
| `queries.getInteractiveItems()`       | `() => MenuInteractiveItem[]`       | Filters out separators, items without `id`, and disabled items.                                                                      |
| `queries.getInteractiveItemIds()`     | `() => string[]`                    |                                                                                                                                      |
| `queries.getItemIndex(templateIndex)` | `(templateIndex: number) => number` | Maps a raw `items` index to its position among interactive items only — useful if your rendering layer needs a "1 of 3" style label. |

## Prop-getters & handlers

| Getter                      | Returns                                                                        |
| --------------------------- | ------------------------------------------------------------------------------ |
| `getMenuProps()`            | `role: 'menu'`, `aria-label`                                                   |
| `getItemProps(item, index)` | `role: 'menuitem'`, `tabindex`, `aria-disabled`, `data-state`, `data-disabled` |
| `getSeparatorProps()`       | `role: 'separator'`                                                            |

With `rovingFocus: true` (the default), only the currently-focused item gets
`tabindex: 0` — the rest are `-1`, so `Tab` moves focus into and out of the
whole menu in one step, and arrow keys move `focusedIndex` within it. With
`rovingFocus: false`, every enabled item gets `tabindex: 0` individually (the
browser's natural `Tab` order visits each one).

`handleMenuKeyDown(event)` — `ArrowDown`/`ArrowUp` move the focus, `Home`/`End`
jump to the first/last interactive item. `handleItemKeyDown(event, item)` —
`Enter`/`Space` select the item; everything else delegates to
`handleMenuKeyDown`, so you only need to attach this one handler to each item
element.

## Live example

<div class="and-live-example" style="flex-direction: column; align-items: stretch; gap: 0.75rem;">
  <div style="display: flex; gap: 0.5rem;">
    <and-button id="menulist-demo-next">Focus next</and-button>
    <and-button id="menulist-demo-select" variant="outline">Select focused</and-button>
  </div>
  <pre id="menulist-demo-output" style="margin: 0; white-space: pre-wrap; font-size: 0.8em;"></pre>
</div>

<script>
  function runMenuListDemo() {
    const H = window.andHeadless;
    const output = document.getElementById('menulist-demo-output');
    if (!H || !output) return;

    const menu = H.createMenuList({
      ariaLabel: 'File actions',
      items: [
        { id: 'edit', label: 'Edit' },
        { separator: true },
        { id: 'delete', label: 'Delete', intent: 'destructive' },
      ],
    });

    const render = () => {
      output.textContent = 'menu.state →\n' + JSON.stringify(menu.state, null, 2);
    };
    menu.subscribe(render);
    render();

    document.getElementById('menulist-demo-next')?.addEventListener('click', () => {
      menu.handleMenuKeyDown({ key: 'ArrowDown', preventDefault() {} });
    });
    document.getElementById('menulist-demo-select')?.addEventListener('click', () => {
      const item = menu.state.items[menu.state.focusedIndex];
      if (item && item.id) menu.actions.selectItem(item.id);
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runMenuListDemo);
  } else {
    runMenuListDemo();
  }
</script>

## Next steps

[Dropdown](/headless/dropdown/) and [Context Menu](/headless/context-menu/) —
the two disclosure factories this list is typically rendered inside.

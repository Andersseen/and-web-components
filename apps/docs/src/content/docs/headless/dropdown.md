---
title: Headless Core — Dropdown
description:
  createDropdown — open/close state, placement, and menu-item selection for
  trigger-anchored menus. Powers the styled Dropdown component.
---

Powers [Dropdown](/components/dropdown/) internally. Built on
[`createMenuSelection`](/headless/primitives/#createmenuselection) for its
`selectItem` action.

## Usage

```ts
import { createDropdown } from '@andersseen/headless-components/dropdown';

const dropdown = createDropdown({
  placement: 'bottom',
  closeOnSelect: true,
  onOpenChange: isOpen => console.log('Open:', isOpen),
  onSelect: e => console.log('Selected:', e.itemId),
});

dropdown.actions.toggle();
```

## Config

| Option          | Type                                     | Default    | Notes                                      |
| --------------- | ---------------------------------------- | ---------- | ------------------------------------------ |
| `defaultOpen`   | `boolean`                                | `false`    |                                            |
| `onOpenChange`  | `(isOpen: boolean) => void`              | —          |                                            |
| `closeOnSelect` | `boolean`                                | `true`     | Forwarded to `createMenuSelection`.        |
| `onSelect`      | `(e: { itemId?: string }) => void`       | —          | Forwarded to `createMenuSelection`.        |
| `placement`     | `'top' \| 'bottom' \| 'left' \| 'right'` | `'bottom'` |                                            |
| `disabled`      | `boolean`                                | `false`    | Setting `true` while open force-closes it. |

## State

`isOpen`, `placement`, `disabled`.

## Actions & queries

| Member                                    | Signature                     |
| ----------------------------------------- | ----------------------------- |
| `actions.open()` / `close()` / `toggle()` | `() => void`                  |
| `actions.selectItem(itemId?)`             | `(itemId?: string) => void`   |
| `actions.setDisabled(v)`                  | `(disabled: boolean) => void` |
| `queries.isOpen()`                        | `() => boolean`               |

## Prop-getters & handlers

| Getter                  | Returns                                                                 |
| ----------------------- | ----------------------------------------------------------------------- |
| `getTriggerProps()`     | `aria-haspopup: 'menu'`, `aria-expanded`, `aria-disabled`, `data-state` |
| `getContentProps()`     | `role: 'menu'`, `data-state`, `hidden`                                  |
| `getItemProps(itemId?)` | `role: 'menuitem'`, `tabindex` (`0` only while open)                    |

`handleTriggerKeyDown(event)` opens on `Enter`/`Space`/`ArrowDown`/`ArrowUp`
(actual focus-into-menu is left to the consuming component).
`handleContentKeyDown(event, allItemIds)` closes on `Escape` or `Tab` — it takes
`allItemIds` in its signature but doesn't currently use it for navigation
(arrow-key movement inside the open menu is left to
[Menu List](/headless/menu-list/) if you compose the two, or to your own
handler).

## Live example

<div class="and-live-example" style="flex-direction: column; align-items: stretch; gap: 0.75rem;">
  <and-button id="dropdown-demo-toggle">Toggle dropdown</and-button>
  <pre id="dropdown-demo-output" style="margin: 0; white-space: pre-wrap; font-size: 0.8em;"></pre>
</div>

<script>
  function runDropdownDemo() {
    const H = window.andHeadless;
    const output = document.getElementById('dropdown-demo-output');
    if (!H || !output) return;

    const dropdown = H.createDropdown({ placement: 'bottom' });

    const render = () => {
      output.textContent =
        'dropdown.getTriggerProps() →\n' + JSON.stringify(dropdown.getTriggerProps(), null, 2) +
        '\n\ndropdown.getContentProps() →\n' + JSON.stringify(dropdown.getContentProps(), null, 2);
    };
    dropdown.subscribe(render);
    render();

    document.getElementById('dropdown-demo-toggle')?.addEventListener('click', () => dropdown.actions.toggle());
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runDropdownDemo);
  } else {
    runDropdownDemo();
  }
</script>

## Next steps

[Context Menu](/headless/context-menu/) shares the same
`createMenuSelection`-based `selectItem` action, for pointer-position-anchored
menus instead of trigger-anchored ones.

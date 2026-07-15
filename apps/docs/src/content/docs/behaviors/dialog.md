---
title: Behaviors — Dialog
description:
  Modal/drawer trigger driven by the and-dialog-trigger attribute, plus its
  imperative createDialog factory.
---

`and-dialog-trigger="target-id"` opens whatever element has that `id` as a
modal. The target can be a `<template>` (cloned fresh on every open — no need to
hide it in the page beforehand) or a real, already-visible element (reparented
into the dialog and moved back on close):

<div class="and-live-example" style="flex-direction: column; align-items: flex-start;">
  <and-button and-dialog-trigger="settings-panel">Open settings</and-button>
</div>

<template id="settings-panel" and-dialog-position="right" and-dialog-width="20rem">
  <div style="height: 100%; box-sizing: border-box; padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem; background: hsl(var(--background)); color: hsl(var(--foreground));">
    <strong>Settings</strong>
    <label style="display: flex; flex-direction: column; gap: 0.25rem; font-size: 0.85rem;">
      Display name
      <input type="text" placeholder="Ada Lovelace" style="padding: 0.4rem 0.6rem; border: 1px solid hsl(var(--border)); border-radius: 0.375rem; background: hsl(var(--background)); color: hsl(var(--foreground));" />
    </label>
    <and-button and-dialog-close variant="outline" style="align-self: flex-start;">Close</and-button>
  </div>
</template>

```html
<button and-dialog-trigger="settings-panel">Open settings</button>

<template
  id="settings-panel"
  and-dialog-position="right"
  and-dialog-width="20rem"
>
  <div>
    <strong>Settings</strong>
    <button and-dialog-close>Close</button>
  </div>
</template>
```

If your dialog's content is already live in the page rather than a `<template>`,
hide it with `class="hidden"` (a Tailwind-style utility, not
`style="display: none"`) — `createDialog` specifically detects and clears that
class when it moves the element in, and **re-adds it when the element moves back
on close**. An inline `style="display: none"` is only cleared on open, never
restored on close, so the element would be left visible in its original spot in
the page once the dialog is dismissed.

## Attributes

| Attribute                      | Where                 | Values                                       | Default    |
| ------------------------------ | --------------------- | -------------------------------------------- | ---------- |
| `and-dialog-trigger`           | trigger               | `string` (target element `id`)               | required   |
| `and-dialog-position`          | trigger and/or target | `'center'\|'top'\|'bottom'\|'left'\|'right'` | `'center'` |
| `and-dialog-backdrop`          | trigger and/or target | `'false'` to disable                         | shown      |
| `and-dialog-close-on-backdrop` | trigger and/or target | `'false'` to disable                         | enabled    |
| `and-dialog-close-on-escape`   | trigger and/or target | `'false'` to disable                         | enabled    |
| `and-dialog-width` / `-height` | trigger and/or target | any CSS length                               | —          |
| `and-dialog-panel-class`       | trigger and/or target | class name(s)                                | —          |
| `and-dialog-backdrop-class`    | trigger and/or target | class name(s)                                | —          |
| `and-dialog-close`             | any descendant        | —                                            | —          |

Any attribute is read from the **trigger first, then the target** as a fallback
— set it on whichever element is more convenient. Any element with
`and-dialog-close` inside the opened content closes the dialog when clicked.

## Imperative API

```ts
import { createDialog } from '@andersseen/behaviors/dialog';

const dialog = createDialog(document.getElementById('panel'), {
  position: 'right',
});
dialog.closed.then(() => console.log('dialog dismissed'));
// dialog.close();
```

`content` accepts three shapes, each handled differently:

| Type                  | Behavior                                                                                                                                                           |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `HTMLElement`         | Reparented into the dialog panel (a comment placeholder marks its original spot) and **moved back on close** — including restoring a `hidden` class if it had one. |
| `HTMLTemplateElement` | Cloned via `importNode` into the panel — the original template is left untouched, so you can open the same template more than once.                                |
| `string`              | Set as `panelEl.innerHTML` directly.                                                                                                                               |

| Option                 | Type                                         | Default    |
| ---------------------- | -------------------------------------------- | ---------- |
| `position`             | `'center'\|'top'\|'bottom'\|'left'\|'right'` | `'center'` |
| `backdrop`             | `boolean`                                    | `true`     |
| `closeOnBackdropClick` | `boolean`                                    | `true`     |
| `closeOnEscape`        | `boolean`                                    | `true`     |
| `width` / `height`     | `string` (any CSS length)                    | —          |
| `panelClass`           | `string \| string[]`                         | —          |
| `backdropClass`        | `string \| string[]`                         | —          |

`DialogRef` is `{ close(): void; readonly closed: Promise<void> }` — `closed`
resolves once, whenever the dialog is dismissed (backdrop click, `Escape`, a
`[and-dialog-close]` element inside the content, or your own `close()` call —
`[and-dialog-close]` auto-wiring works the same whether the dialog was opened
declaratively or imperatively).

Dialogs stack: open a second one while the first is open and `Escape` only
closes the **top-most**. Body scroll is locked (`overflow: hidden`) while at
least one dialog is open, and restored only once the last one closes. Focus
moves to the first focusable element in the panel on open, is trapped inside it
on `Tab`/`Shift+Tab`, and returns to whatever had focus before `createDialog`
was called once it closes.

<div class="and-live-example" style="flex-direction: column; align-items: flex-start;">
  <and-button id="confirm-trigger" variant="destructive">Delete item…</and-button>
</div>

<template id="confirm-template">
  <div style="padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem; min-width: 18rem; background: hsl(var(--background)); color: hsl(var(--foreground)); border-radius: 0.75rem; border: 1px solid hsl(var(--border));">
    <strong>Delete this item?</strong>
    <p style="margin: 0; color: hsl(var(--muted-foreground)); font-size: 0.9rem;">This can't be undone.</p>
    <div style="display: flex; gap: 0.5rem; justify-content: flex-end;">
      <and-button id="confirm-cancel" variant="outline" and-dialog-close>Cancel</and-button>
      <and-button id="confirm-ok" variant="destructive">Delete</and-button>
    </div>
  </div>
</template>

<script>
  function runConfirm() {
    const B = window.andBehaviors;
    const trigger = document.getElementById('confirm-trigger');
    const template = document.getElementById('confirm-template');
    if (!B || !trigger || !template) return;

    trigger.addEventListener('click', () => {
      const dialog = B.createDialog(template, { position: 'center' });
      document.getElementById('confirm-ok')?.addEventListener('click', () => {
        dialog.close();
      });
      dialog.closed.then(() => trigger.focus());
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runConfirm);
  } else {
    runConfirm();
  }
</script>

```html
<button id="trigger">Delete item…</button>

<template id="confirm-template">
  <div>
    <strong>Delete this item?</strong>
    <button and-dialog-close>Cancel</button>
    <button id="confirm-ok">Delete</button>
  </div>
</template>

<script type="module">
  import { createDialog } from '@andersseen/behaviors/dialog';

  document.getElementById('trigger').addEventListener('click', () => {
    const dialog = createDialog(document.getElementById('confirm-template'));
    document
      .getElementById('confirm-ok')
      .addEventListener('click', () => dialog.close());
  });
</script>
```

## Accessibility

Sets `role="dialog"` and `aria-modal="true"` on the panel, traps
`Tab`/`Shift+Tab` inside it (disabled/hidden controls skipped by the
focusable-elements query), locks body scroll while open, and restores focus to
whatever triggered the dialog once it closes.

## Next steps

[Recipes → A promise-based confirm dialog](/behaviors/recipes/#a-promise-based-confirm-dialog)

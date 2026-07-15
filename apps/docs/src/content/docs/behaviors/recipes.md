---
title: Behaviors — Recipes
description:
  Real-world patterns built from the and-* attributes and their imperative
  factories — cross-list drag & drop, a persisted splitter, a tooltip on a
  disabled control, and a promise-based confirm dialog.
---

Practical patterns combining the [declarative attributes](/behaviors/overview/)
and the [imperative factories](/behaviors/imperative-api/) — grounded in the
real engine, no extra helper library.

## Cross-list drag & drop

`defineBehaviors` auto-reorders any `[and-drop-zone-sortable]` zone on drop —
and since the handler just inserts the dragged element into _whichever_ zone it
was dropped on, dragging **between** two different sortable zones works out of
the box, purely from markup:

<div class="and-live-example" style="display: block;">
  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
    <div>
      <div and-text="p-sm weight:semibold" style="margin-bottom: 0.5rem;">To do</div>
      <div and-drop-zone and-drop-zone-sortable and-drop-zone-accept="task" style="display: flex; flex-direction: column; gap: 0.5rem; min-height: 4rem; padding: 0.5rem; border: 1px dashed hsl(var(--border)); border-radius: 0.5rem;">
        <div and-draggable and-draggable-type="task" style="padding: 0.6rem 0.9rem; border-radius: 0.5rem; background: hsl(var(--muted)); color: hsl(var(--foreground)); border: 1px solid hsl(var(--border));">Write changelog</div>
        <div and-draggable and-draggable-type="task" style="padding: 0.6rem 0.9rem; border-radius: 0.5rem; background: hsl(var(--muted)); color: hsl(var(--foreground)); border: 1px solid hsl(var(--border));">Review PR #48</div>
      </div>
    </div>
    <div>
      <div and-text="p-sm weight:semibold" style="margin-bottom: 0.5rem;">Done</div>
      <div and-drop-zone and-drop-zone-sortable and-drop-zone-accept="task" style="display: flex; flex-direction: column; gap: 0.5rem; min-height: 4rem; padding: 0.5rem; border: 1px dashed hsl(var(--border)); border-radius: 0.5rem;">
        <div and-draggable and-draggable-type="task" style="padding: 0.6rem 0.9rem; border-radius: 0.5rem; background: hsl(var(--muted)); color: hsl(var(--foreground)); border: 1px solid hsl(var(--border));">Ship docs site</div>
      </div>
    </div>
  </div>
</div>

```html
<div and-drop-zone and-drop-zone-sortable and-drop-zone-accept="task">
  <div and-draggable and-draggable-type="task">Write changelog</div>
  <div and-draggable and-draggable-type="task">Review PR #48</div>
</div>

<div and-drop-zone and-drop-zone-sortable and-drop-zone-accept="task">
  <div and-draggable and-draggable-type="task">Ship docs site</div>
</div>
```

`and-drop-zone-accept="task"` on both zones (matched against
`and-draggable-type="task"` on each item) is what makes them a matching pair —
drop zones with no `accept` list take anything, so it's only needed once you
have more than one kind of draggable on the page and want to keep them apart.

If you need custom logic instead of plain reordering — moving the item between
two different _data_ arrays, not just DOM nodes — skip the `sortable` attribute
and wire `createDropZone` yourself; see
[Drag & Drop's Imperative API section](/behaviors/drag-drop/#imperative-api).

## Persisting a splitter's position

`and-splitter-default-position` sets the _initial_ position, but nothing
declarative saves it back. Read `localStorage` before creating the splitter, and
write to it on `and-splitter-change`:

<div class="and-live-example" style="display: block;">
  <div id="persist-splitter" and-splitter="horizontal" and-splitter-min="20" and-splitter-max="80" style="height: 6rem; border: 1px solid hsl(var(--border)); border-radius: 0.5rem; overflow: hidden;">
    <div and-splitter-panel="primary" style="background: hsl(var(--muted)); color: hsl(var(--foreground)); display: flex; align-items: center; justify-content: center; font-size: 0.85rem;">Primary</div>
    <div and-splitter-handle style="width: 6px; background: hsl(var(--border));"></div>
    <div and-splitter-panel="secondary" style="background: hsl(var(--accent)); color: hsl(var(--accent-foreground)); display: flex; align-items: center; justify-content: center; font-size: 0.85rem;">Secondary</div>
  </div>
  <p and-text="p-xs color:muted" style="margin: 0.5rem 0 0;">Drag the divider, then reload this page — the position is restored from <code>localStorage</code>.</p>
</div>

<script>
  function runPersist() {
    const el = document.getElementById('persist-splitter');
    if (!el) return;
    const KEY = 'and-docs-splitter-position';
    const saved = Number(localStorage.getItem(KEY));
    if (saved) el.setAttribute('and-splitter-default-position', String(saved));
    el.addEventListener('and-splitter-change', e => {
      if (!e.detail.isDragging) localStorage.setItem(KEY, String(e.detail.position));
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runPersist);
  } else {
    runPersist();
  }
</script>

The declarative example above sets `and-splitter-default-position` _before_
`defineBehaviors` scans the DOM (both run on the same `DOMContentLoaded` tick),
which is enough since the attribute is only read once, at creation. Building the
container in code instead, use `createSplitter`'s `defaultPosition` option
directly:

```ts
import { createSplitter } from '@andersseen/behaviors/splitter';

const KEY = 'panels-position';
const saved = Number(localStorage.getItem(KEY)) || 50;

const splitter = createSplitter(document.getElementById('panels'), {
  defaultPosition: saved,
});

document.getElementById('panels').addEventListener('and-splitter-change', e => {
  if (!e.detail.isDragging)
    localStorage.setItem(KEY, String(e.detail.position));
});
```

Only writing on `and-splitter-change` events where `isDragging` is `false`
avoids hammering `localStorage` on every `mousemove` — that flag flips to
`false` exactly once, when the drag (or a keyboard nudge) ends.

## Tooltip on a disabled control

Disabled elements don't reliably fire `mouseenter`/`focus` across browsers, so
`and-tooltip` on a disabled button often just never shows. The standard fix:
don't disable the button itself — wrap it in a hoverable/focusable element and
put `and-tooltip` there instead, with `pointer-events: none` on the inner button
so clicks still don't fire:

<div class="and-live-example">
  <span and-tooltip="Connect a payment method first" and-tooltip-placement="top" tabindex="0" style="display: inline-block; border-radius: 0.375rem;">
    <and-button disabled style="pointer-events: none;">Upgrade plan</and-button>
  </span>
</div>

```html
<span and-tooltip="Connect a payment method first" tabindex="0">
  <and-button disabled style="pointer-events: none;">Upgrade plan</and-button>
</span>
```

The wrapper needs `tabindex="0"` so keyboard users can reach it — a disabled
button is skipped in the tab order entirely, so without this the tooltip's
content would never reach keyboard-only users at all. `aria-disabled="true"`
plus a real (non-`disabled`) `<button>` is a more involved but more robust
alternative if your component supports it; the wrapper trick above works with
any disabled element as-is, including `and-button`.

## A promise-based confirm dialog

`DialogRef.closed` makes it straightforward to turn `createDialog` into a
reusable `confirm()`-style helper that resolves `true`/`false` depending on
which button was pressed, instead of wiring `[and-dialog-close]` by hand every
time:

```ts
import { createDialog } from '@andersseen/behaviors/dialog';

function confirmDialog(message: string): Promise<boolean> {
  return new Promise(resolve => {
    const template = document.createElement('template');
    template.innerHTML = `
      <div class="confirm-panel">
        <p>${message}</p>
        <button data-action="cancel">Cancel</button>
        <button data-action="confirm">Confirm</button>
      </div>
    `;

    const dialog = createDialog(template, { closeOnBackdropClick: false });
    let confirmed = false;

    dialog.closed.then(() => resolve(confirmed));

    // The panel content was cloned into the live DOM by createDialog —
    // query it back out via the class to wire the two buttons.
    const panel = document.querySelector('.confirm-panel');
    panel
      ?.querySelector('[data-action="confirm"]')
      ?.addEventListener('click', () => {
        confirmed = true;
        dialog.close();
      });
    panel
      ?.querySelector('[data-action="cancel"]')
      ?.addEventListener('click', () => {
        dialog.close();
      });
  });
}

// Usage — reads like the native confirm(), but non-blocking:
deleteButton.addEventListener('click', async () => {
  if (await confirmDialog('Delete this item?')) {
    deleteItem();
  }
});
```

`closeOnBackdropClick: false` here is deliberate: a confirm dialog should force
an explicit choice rather than let a stray backdrop click silently resolve to
`false`. `closeOnEscape` is left at its default (`true`) — `Escape` still
resolves the promise to `false`, same as clicking Cancel, since `confirmed`
stays `false` until the confirm button's own handler flips it.

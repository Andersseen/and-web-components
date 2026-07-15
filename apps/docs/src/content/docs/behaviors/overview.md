---
title: Behaviors — Overview
description:
  Framework-agnostic DOM behaviors driven by and-* attributes -- splitter, drag
  & drop, tooltip, dialog.
---

`@andersseen/behaviors` provides framework-agnostic **DOM behaviors** driven by
`and-*` attributes. Progressive enhancement for the browser — no framework
runtime required. Attach interaction patterns (splitter, drag & drop, tooltip,
dialog) to existing HTML using either declarative attributes or low-level
imperative APIs.

Sibling package: [Headless Core](/headless/overview/) is pure state machines
with **no** DOM; `@andersseen/behaviors` is the layer that wires interaction
directly onto elements already in the page.

## Install

```bash
pnpm add @andersseen/behaviors
```

## Declarative attributes

Call `defineBehaviors()` once after your DOM is ready. It scans for `[and-*]`
attributes and wires up the corresponding behaviors.

```html
<button and-tooltip="Save changes" and-tooltip-placement="top">Save</button>

<script type="module">
  import { defineBehaviors } from '@andersseen/behaviors';
  const cleanup = defineBehaviors({ observe: true });
  // cleanup() destroys every behavior and stops observing.
</script>
```

`defineBehaviors(options)` takes two options and returns a cleanup function:

| Option    | Type          | Default         | Notes                                                                                              |
| --------- | ------------- | --------------- | -------------------------------------------------------------------------------------------------- |
| `root`    | `HTMLElement` | `document.body` | Only elements inside this root are scanned.                                                        |
| `observe` | `boolean`     | `false`         | Watch for later-added `[and-*]` elements with a `MutationObserver` and wire them up automatically. |

This docs site calls `defineBehaviors({ observe: true })` once, globally, so
every `and-*` attribute in the live examples across these pages just works.

## Behaviors

Each has its own page: declarative attributes, events, the imperative `create*`
factory, and accessibility notes.

| Attribute                         | Behavior                        | Page                                 | Subpath                           |
| --------------------------------- | ------------------------------- | ------------------------------------ | --------------------------------- |
| `and-splitter`                    | Resizable panel container       | [Splitter](/behaviors/splitter/)     | `@andersseen/behaviors/splitter`  |
| `and-tooltip`                     | Hover/focus tooltip             | [Tooltip](/behaviors/tooltip/)       | `@andersseen/behaviors/tooltip`   |
| `and-dialog-trigger`              | Modal/drawer trigger            | [Dialog](/behaviors/dialog/)         | `@andersseen/behaviors/dialog`    |
| `and-draggable` / `and-drop-zone` | HTML5 drag source & drop target | [Drag & Drop](/behaviors/drag-drop/) | `@andersseen/behaviors/drag-drop` |

Every factory returns an instance with a `destroy()` — call it when the element
is removed so listeners don't leak. Import from the package root or a
per-behavior subpath (as above) for tighter tree-shaking.

## Browser support

All behaviors touch the DOM and are browser-only. Call `defineBehaviors()` only
after `document.body` is available.

## Next steps

- [Splitter](/behaviors/splitter/), [Tooltip](/behaviors/tooltip/),
  [Dialog](/behaviors/dialog/), [Drag & Drop](/behaviors/drag-drop/) — one page
  per behavior, each with its declarative attributes, imperative API, and
  accessibility notes.
- [Recipes](/behaviors/recipes/) — cross-list drag & drop, a persisted splitter,
  a tooltip on a disabled control, and a promise-based confirm dialog.

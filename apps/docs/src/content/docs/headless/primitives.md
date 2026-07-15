---
title: Headless Core — Primitives
description:
  The low-level building blocks every headless factory is made of — StateStore,
  createMachine, id generation, and the shared ARIA/keyboard vocabulary.
---

Every `create*` factory in this package is built from the same handful of
primitives. Reach for them directly when a factory doesn't quite fit your case,
or when you're modelling a new interactive pattern from scratch.

## `StateStore` / `createStore`

The reactive core every factory's `state`/`subscribe` is built on — a tiny
`setState`/`subscribe` store, not `EventTarget` (so it works inside Stencil's
`mock-doc` test environment too).

```ts
import { createStore } from '@andersseen/headless-components';

const store = createStore({ count: 0, name: 'and' });

const unsubscribe = store.subscribe((state, prev) => {
  console.log('changed from', prev, 'to', state);
});

store.setState({ count: 1 }); // triggers subscriber
store.setState({ count: 1 }); // no-op: value unchanged, subscriber not called
unsubscribe();
```

| Member                | Signature                                   | Notes                                                                                   |
| --------------------- | ------------------------------------------- | --------------------------------------------------------------------------------------- |
| `state`               | getter → `Readonly<T>`                      | Returns a **frozen shallow copy** on every access.                                      |
| `setState(partial)`   | `(partial: Partial<T>) => void`             | Per-key **shallow reference equality**; skips notifying subscribers if nothing changed. |
| `subscribe(callback)` | `(cb: (state, prev) => void) => () => void` | Returns an unsubscribe function.                                                        |

Because `setState` does shallow equality per key, mutating a nested object or
array in place (`state.items.push(x)`) and calling
`setState({ items: state.items })` **won't notify** — the reference didn't
change. Always pass a new reference
(`setState({ items: [...state.items, x] })`), exactly like the factories above
do internally (see `accordion`'s `new Set(...)` pattern, or `toast`'s
`[...store.state.toasts, toast]`).

## `createMachine`

A finite state-machine primitive for modelling flows more complex than a single
boolean `isOpen` — explicit states, guarded transitions, and enter/leave effects
with automatic cleanup. None of the 17 component factories above use it directly
(their state is simple enough for a plain store), but it's exported for your own
more elaborate flows.

```ts
import { createMachine } from '@andersseen/headless-components';

const machine = createMachine({
  initial: 'closed',
  states: {
    closed: { on: { OPEN: { target: 'opening' } } },
    opening: {
      on: { MOUNTED: { target: 'open' } },
      effect: ({ send }) => {
        const id = requestAnimationFrame(() => send('MOUNTED'));
        return () => cancelAnimationFrame(id); // cleanup on leave
      },
    },
    open: { on: { CLOSE: { target: 'closed' } } },
  },
});

machine.subscribe((snapshot, prev) =>
  console.log(prev.value, '→', snapshot.value),
);
machine.send('OPEN'); // or { type: 'OPEN' }
machine.snapshot.can('CLOSE'); // true — is this event handled in the current state?
machine.stop(); // cleans up the active effect, clears subscribers
```

| Concept    | Config field                                 | Notes                                                                            |
| ---------- | -------------------------------------------- | -------------------------------------------------------------------------------- |
| State      | `states: Record<string, StateConfig>`        | A finite value from a known set.                                                 |
| Context    | `context?: C`                                | Arbitrary data carried alongside the current state.                              |
| Transition | `on: { EVENT: { target, guard?, action? } }` | `guard` must return `true` for the transition to fire; `action` patches context. |
| Effect     | `effect?: (api) => (() => void) \| void`     | Runs on entering a state; the returned function (if any) runs on **leaving** it. |

`send(event)` accepts either a string (`'OPEN'`) or an object
(`{ type: 'OPEN', ...data }`) — unhandled event types for the current state are
silently ignored, not thrown.

## `createIdGenerator` / `generateId`

Collision-free ID helpers for wiring `aria-controls`/`aria-labelledby` pairs —
used internally by `accordion`, `tabs`, `tooltip`, and `navbar`.

```ts
import { createIdGenerator } from '@andersseen/headless-components';

const generateId = createIdGenerator('accordion');
generateId('content-item-1'); // 'accordion-1-content-item-1'
generateId('content-item-1'); // same call again → identical id (memoized)
generateId('content-item-2'); // 'accordion-2-content-item-2' — new suffix, new id
```

`createIdGenerator(prefix)` memoizes by suffix **within one generator instance**
— call it once per component instance and reuse the returned function so paired
elements (a trigger and the panel it controls) always agree on the same id
across re-renders. The standalone `generateId(prefix?)` export has no
memoization — every call returns a new id, so only use it for genuine one-offs.

## `Keys` / `KeyboardKey`

Named keyboard constants used by every factory's keyboard handler, so key
comparisons read as `event.key === Keys.ArrowDown` instead of magic strings:

```ts
import { Keys } from '@andersseen/headless-components';

Keys.Enter; // 'Enter'
Keys.Space; // ' '
Keys.Escape; // 'Escape'
Keys.ArrowUp / Keys.ArrowDown / Keys.ArrowLeft / Keys.ArrowRight;
Keys.Home / Keys.End / Keys.Tab;
```

`KeyboardKey` is the union type of all values above
(`(typeof Keys)[keyof typeof Keys]`).

## `AriaAttributes` / `DataAttributes`

The shared prop-getter return-type building blocks every `get*Props()` method
extends — not something you call, but useful when typing your own wrapper around
a factory:

```ts
interface AriaAttributes {
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  'aria-hidden'?: boolean | 'true' | 'false';
  'aria-disabled'?: boolean | 'true' | 'false';
  'aria-expanded'?: boolean | 'true' | 'false';
  'aria-selected'?: boolean | 'true' | 'false';
  'aria-controls'?: string;
  'aria-haspopup'?:
    | boolean
    | 'true'
    | 'false'
    | 'menu'
    | 'listbox'
    | 'tree'
    | 'grid'
    | 'dialog';
  'role'?: string;
}

interface DataAttributes {
  'data-state'?:
    | 'open'
    | 'closed'
    | 'active'
    | 'inactive'
    | 'selected'
    | 'unselected';
  'data-disabled'?: boolean;
  'data-orientation'?: 'horizontal' | 'vertical';
}
```

## `createMenuSelection`

Shared "select an item, then optionally close" behavior factored out of
[Dropdown](/headless/dropdown/) and [Context Menu](/headless/context-menu/) —
not tied to any one component, so it's documented here rather than getting its
own page. [Menu List](/headless/menu-list/) doesn't use it (it has no "close"
concept of its own — it's just a focus/selection list, often used _inside_ a
Dropdown or Context Menu panel).

```ts
import { createMenuSelection } from '@andersseen/headless-components/menu';

const selection = createMenuSelection(
  { onSelect: e => console.log('selected', e.itemId), closeOnSelect: true },
  () => dropdown.actions.close(), // called after onSelect, when closeOnSelect is true
);

selection.selectItem('item-1'); // fires onSelect, then the close callback
```

`createMenuSelection(config, close)` returns `{ selectItem(itemId?) }`. It's how
[Dropdown](/headless/dropdown/)'s and [Context Menu](/headless/context-menu/)'s
own `actions.selectItem` are implemented internally — reach for it directly only
if you're building a third disclosure-style component that needs the same
"select closes the panel" contract.

## Next steps

[Overview](/headless/overview/) — the full factory table and the
`state`/`subscribe`/`actions`/`queries`/prop-getter pattern all 17 of them
share.

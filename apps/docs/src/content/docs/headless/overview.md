---
title: Headless Core — Overview
description:
  Pure TypeScript state machines and a11y/keyboard logic, zero DOM, zero
  styling. Powers web-components and vanilla-components internally.
---

`@andersseen/headless-components` is the **foundation** tier of this stack (see
the root README's "Package Roles"): pure TypeScript state machines with **no**
DOM rendering and **no** styles. It powers
[`@andersseen/web-components`](/components/button/) and
[`@andersseen/vanilla-components`](/vanilla/overview/) internally, and is also
published standalone for teams building their own design system on top of it.

- ✅ Pure TypeScript, works with any framework (Stencil, Angular, React, Vue,
  vanilla JS)
- ✅ Reactive state, accessibility, and keyboard navigation
- ❌ Does **not** render any DOM
- ❌ Does **not** include any styles

## Install

```bash
pnpm add @andersseen/headless-components
```

## The pattern

Every component factory follows the same shape: `create*(config)` returns an
object exposing a **reactive state snapshot**, a **`subscribe`** function,
`actions` (setters), `queries` (derived getters), one or more **prop-getters**
you spread onto your own markup, and **event handlers** you wire to DOM events.

```ts
import { createButton } from '@andersseen/headless-components';

const button = createButton({
  disabled: false,
  onClick: e => console.log('clicked'),
});

button.state; // readonly snapshot: { disabled, loading, type }
button.getButtonProps(); // props to spread on your <button>
button.actions.setLoading(true); // mutate → notifies subscribers
button.queries.isDisabled(); // derived boolean
button.handleClick(event); // event handler (guards disabled/loading)
```

`getButtonProps()` returns exactly what a UI layer spreads onto its element —
for a button that's:

```jsonc
{
  "type": "button",
  "disabled": false,
  "tabindex": 0,
  "aria-disabled": false,
  "aria-busy": false,
  "data-state": "active",
  "data-disabled": false,
}
```

Method names vary per component (a dropdown has `getTriggerProps()` /
`getMenuProps()` / `handleKeyDown()`, tabs has `getTabProps(id)`, etc.), but the
five buckets — `state`, `subscribe`, `actions`, `queries`, prop-getters +
handlers — are consistent across all of them.

## Reactivity: `subscribe`

The core is reactive: `subscribe(cb)` fires on every state change and returns an
unsubscribe function. This is what makes one factory work in any framework
without an adapter — you bridge it to whatever re-render primitive your
framework has.

```ts
const unsubscribe = button.subscribe(state => {
  console.log('button state changed:', state);
});
// …later
unsubscribe();
```

```tsx
// React: bridge subscribe → a re-render
import { useSyncExternalStore, useRef } from 'react';
import { createButton } from '@andersseen/headless-components';

function useButton(config) {
  const ref = useRef(null);
  ref.current ??= createButton(config);
  const button = ref.current;
  useSyncExternalStore(button.subscribe, () => button.state);
  return button;
}
```

## Live example

This is the _actual_, unmodified return value of
`createButton({ disabled: false })` called live on this page — nothing rendered,
just the plain object a UI layer would spread onto its own `<button>`:

<div class="and-live-example" style="flex-direction: column; align-items: stretch;">
  <pre id="headless-output" style="margin: 0; white-space: pre-wrap; font-size: 0.8em;"></pre>
</div>

<script>
  function run() {
    const button = window.andHeadless.createButton({ disabled: false });
    document.getElementById('headless-output').textContent =
      'button.getButtonProps() →\n' + JSON.stringify(button.getButtonProps(), null, 2);
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
</script>

## Available factories

Eighteen component factories, each powering the matching styled component in
`@andersseen/web-components`. Import from the package root or a per-component
subpath (`@andersseen/headless-components/button`).

| Factory               | Powers                                                                         |
| --------------------- | ------------------------------------------------------------------------------ |
| `createButton`        | [Button](/components/button/)                                                  |
| `createAccordion`     | [Accordion](/components/accordion/)                                            |
| `createTabs`          | [Tabs](/components/tabs/)                                                      |
| `createDropdown`      | [Dropdown](/components/dropdown/)                                              |
| `createModal`         | [Modal](/components/modal/)                                                    |
| `createDrawer`        | [Drawer](/components/drawer/)                                                  |
| `createTooltip`       | [Tooltip](/components/tooltip/)                                                |
| `createToastManager`  | [Toast](/components/toast/)                                                    |
| `createInput`         | [Input](/components/input/)                                                    |
| `createSelect`        | [Select](/components/select/)                                                  |
| `createAlert`         | [Alert](/components/alert/)                                                    |
| `createNavbar`        | [Navbar](/components/navbar/)                                                  |
| `createSidebar`       | [Sidebar](/components/sidebar/)                                                |
| `createBreadcrumb`    | [Breadcrumb](/components/breadcrumb/)                                          |
| `createCarousel`      | [Carousel](/components/carousel/)                                              |
| `createMenuList`      | [Menu List](/components/menu-list/)                                            |
| `createContextMenu`   | [Context Menu](/components/context-menu/)                                      |
| `createMenuSelection` | shared menu-disclosure logic (internal to dropdown / menu-list / context-menu) |

## Primitives

Alongside the component factories, the package exports the low-level building
blocks they're made of:

| Export                             | What it is                                                                                                           |
| ---------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `StateStore` / `createStore`       | The reactive core — a tiny `setState`/`subscribe` store. Freezes snapshots and only notifies on actual change.       |
| `createMachine`                    | A finite state-machine primitive (`states`, `on` transitions, `guards`, `effects`) for modelling more complex flows. |
| `createIdGenerator`                | Collision-free id helper for wiring `aria-controls` / `aria-labelledby`.                                             |
| `Keys` / `KeyboardKey`             | Named keyboard constants (`Keys.Enter`, `Keys.ArrowDown`, …) used by the keyboard handlers.                          |
| `AriaAttributes`, `DataAttributes` | The shared prop-getter return types (`aria-*` and `data-state`/`data-disabled`/`data-orientation`).                  |

```ts
import { createStore } from '@andersseen/headless-components';

const store = createStore({ count: 0 });
const stop = store.subscribe((state, prev) => {
  console.log(prev.count, '→', state.count);
});
store.setState({ count: 1 }); // logs "0 → 1"
store.setState({ count: 1 }); // no-op: value unchanged, subscribers not called
stop();
```

## Usage with Stencil

```tsx
import { Component, State, h } from '@stencil/core';
import {
  createButton,
  type ButtonReturn,
} from '@andersseen/headless-components/button';

@Component({ tag: 'my-button', shadow: true })
export class MyButton {
  @State() private buttonLogic: ButtonReturn;

  componentWillLoad() {
    this.buttonLogic = createButton({ onClick: e => this.handleClick(e) });
  }

  private handleClick = (e: MouseEvent) => console.log('Button clicked!');

  render() {
    const props = this.buttonLogic.getButtonProps();
    return (
      <button {...props} onClick={e => this.buttonLogic.handleClick(e)}>
        <slot />
      </button>
    );
  }
}
```

## Usage with Angular

```ts
import { Component, OnInit } from '@angular/core';
import {
  createButton,
  type ButtonReturn,
} from '@andersseen/headless-components/button';

@Component({
  selector: 'app-button',
  template: `
    <button
      [attr.type]="props.type"
      [disabled]="props.disabled"
      (click)="button.handleClick($event)"
    >
      <ng-content></ng-content>
    </button>
  `,
})
export class ButtonComponent implements OnInit {
  button!: ButtonReturn;
  props: any;

  ngOnInit() {
    this.button = createButton({ onClick: () => console.log('clicked') });
    this.props = this.button.getButtonProps();
    // re-read props on change:
    this.button.subscribe(() => (this.props = this.button.getButtonProps()));
  }
}
```

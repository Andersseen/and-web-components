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

Method names vary per component (a dropdown has `getTriggerProps()` /
`getMenuProps()` / `handleKeyDown()`, tabs has `getTabProps(id)`, etc.), but the
five buckets — `state`, `subscribe`, `actions`, `queries`, prop-getters +
handlers — are consistent across all of them. See each factory's own page for
its exact shape.

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

Seventeen component factories, each with its own page: full config, state,
actions/queries, prop-getters, and a live demo. Import from the package root or
a per-component subpath (`@andersseen/headless-components/button`).

| Factory              | Page                                    | Powers                                    |
| -------------------- | --------------------------------------- | ----------------------------------------- |
| `createButton`       | [Button](/headless/button/)             | [Button](/components/button/)             |
| `createAccordion`    | [Accordion](/headless/accordion/)       | [Accordion](/components/accordion/)       |
| `createTabs`         | [Tabs](/headless/tabs/)                 | [Tabs](/components/tabs/)                 |
| `createDropdown`     | [Dropdown](/headless/dropdown/)         | [Dropdown](/components/dropdown/)         |
| `createModal`        | [Modal](/headless/modal/)               | [Modal](/components/modal/)               |
| `createDrawer`       | [Drawer](/headless/drawer/)             | [Drawer](/components/drawer/)             |
| `createTooltip`      | [Tooltip](/headless/tooltip/)           | [Tooltip](/components/tooltip/)           |
| `createToastManager` | [Toast](/headless/toast/)               | [Toast](/components/toast/)               |
| `createInput`        | [Input](/headless/input/)               | [Input](/components/input/)               |
| `createSelect`       | [Select](/headless/select/)             | [Select](/components/select/)             |
| `createAlert`        | [Alert](/headless/alert/)               | [Alert](/components/alert/)               |
| `createNavbar`       | [Navbar](/headless/navbar/)             | [Navbar](/components/navbar/)             |
| `createSidebar`      | [Sidebar](/headless/sidebar/)           | [Sidebar](/components/sidebar/)           |
| `createBreadcrumb`   | [Breadcrumb](/headless/breadcrumb/)     | [Breadcrumb](/components/breadcrumb/)     |
| `createCarousel`     | [Carousel](/headless/carousel/)         | [Carousel](/components/carousel/)         |
| `createMenuList`     | [Menu List](/headless/menu-list/)       | [Menu List](/components/menu-list/)       |
| `createContextMenu`  | [Context Menu](/headless/context-menu/) | [Context Menu](/components/context-menu/) |

Plus [`createMenuSelection`](/headless/primitives/#createmenuselection) — shared
menu-disclosure logic factored out of Dropdown and Context Menu, covered on the
Primitives page rather than getting its own.

## Primitives

Alongside the factories above, the package exports the low-level building blocks
they're made of — `StateStore`, `createMachine`, `createIdGenerator`, `Keys`,
and the shared `AriaAttributes`/`DataAttributes` prop-getter types. See
[Primitives](/headless/primitives/) for the full reference.

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

## Next steps

[Primitives](/headless/primitives/), then any factory page above for its full
reference.

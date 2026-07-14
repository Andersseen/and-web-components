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
- ✅ State management, accessibility, and keyboard navigation
- ❌ Does **not** render any DOM
- ❌ Does **not** include any styles

## Install

```bash
pnpm add @andersseen/headless-components
```

## Quick start

Every component follows the same pattern: a `create*()` factory returns `state`,
`actions`, `queries`, and prop-getters you wire onto your own markup.

```ts
import { createButton } from '@andersseen/headless-components';

const button = createButton({
  disabled: false,
  onClick: e => console.log('clicked'),
});

const props = button.getButtonProps();
// { type: 'button', disabled: false, tabindex: 0, 'aria-disabled': false, 'data-state': 'active' }

button.actions.setLoading(true);
```

## Example

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

## Available components

| Component         | Import                                      | Notes                                      |
| ----------------- | ------------------------------------------- | ------------------------------------------ |
| `createButton`    | `@andersseen/headless-components/button`    | Loading and disabled states                |
| `createAccordion` | `@andersseen/headless-components/accordion` | Collapsible sections, multi-select support |
| `createTabs`      | `@andersseen/headless-components/tabs`      | Automatic/manual activation                |
| `createDropdown`  | `@andersseen/headless-components/dropdown`  | Keyboard navigation, placement             |

Every `create*()` factory follows the same API shape:

```ts
const component = createComponent(config);

component.state; // readonly state snapshot
component.actions.doSomething(); // mutate state
component.queries.getSomething(); // read derived state
component.getElementProps(); // props for an element
component.handleSomeEvent(); // keyboard/event handlers
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
      <button {...props} onClick={e => this.buttonLogic.actions.click(e)}>
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
      (click)="button.actions.click($event)"
    >
      <ng-content></ng-content>
    </button>
  `,
})
export class ButtonComponent implements OnInit {
  button!: ButtonReturn;
  props: any;

  ngOnInit() {
    this.button = createButton({ onClick: e => console.log('clicked') });
    this.props = this.button.getButtonProps();
  }
}
```

---
title: Headless Core — Accordion
description:
  createAccordion — single/multi-select expand-collapse state with keyboard
  support. Powers the styled Accordion component.
---

Powers [Accordion](/components/accordion/) and `and-vanilla-accordion`
internally.

## Usage

```ts
import { createAccordion } from '@andersseen/headless-components/accordion';

const accordion = createAccordion({
  allowMultiple: true,
  defaultValue: ['item-1'],
  onValueChange: items => console.log('Expanded:', items),
});

accordion.actions.toggle('item-2');
accordion.queries.isExpanded('item-1'); // true
```

## Config

| Option          | Type                         | Default      | Notes                              |
| --------------- | ---------------------------- | ------------ | ---------------------------------- |
| `allowMultiple` | `boolean`                    | `false`      |                                    |
| `defaultValue`  | `string[]`                   | `[]`         | Item IDs expanded on creation.     |
| `onValueChange` | `(items: string[]) => void`  | —            | Fires after every expand/collapse. |
| `orientation`   | `'horizontal' \| 'vertical'` | `'vertical'` |                                    |
| `disabled`      | `boolean`                    | `false`      |                                    |

## State

`expandedItems: Set<string>`, `orientation`, `disabled`, `allowMultiple`.

## Actions & queries

| Member                                           | Signature                     | Notes                                                                                                                               |
| ------------------------------------------------ | ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `actions.toggle(id)`                             | `(itemId: string) => void`    | In single mode, expanding one collapses the rest.                                                                                   |
| `actions.expand(id)` / `collapse(id)`            | `(itemId: string) => void`    |                                                                                                                                     |
| `actions.expandAll()`                            | `() => void`                  | No-op today — needs the full item-id list, which the factory doesn't track (only expanded ones). Use `expand(id)` per item instead. |
| `actions.collapseAll()`                          | `() => void`                  |                                                                                                                                     |
| `actions.setDisabled(v)` / `setAllowMultiple(v)` | `(boolean) => void`           |                                                                                                                                     |
| `queries.isExpanded(id)`                         | `(itemId: string) => boolean` |                                                                                                                                     |
| `queries.getExpandedItems()`                     | `() => string[]`              |                                                                                                                                     |

## Prop-getters & handler

| Getter                    | Returns                                                                                                        |
| ------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `getContainerProps()`     | `data-orientation`                                                                                             |
| `getTriggerProps(itemId)` | `aria-expanded`, `aria-controls`, `aria-disabled`, `role: 'button'`, `tabindex`, `data-state`, `data-disabled` |
| `getContentProps(itemId)` | `role: 'region'`, `id`, `aria-hidden`, `hidden`, `data-state`                                                  |

`aria-controls`/`id` are paired via `createIdGenerator` — see
[Primitives](/headless/primitives/#createidgenerator--generateid).

`handleTriggerKeyDown(event, itemId)` toggles on `Enter`/`Space`; `Home`/`End`
call `preventDefault()` but focus-moving is left to the consuming component (the
headless core has no DOM access to focus a sibling trigger).

## Live example

<div class="and-live-example" style="flex-direction: column; align-items: stretch; gap: 0.75rem;">
  <div style="display: flex; gap: 0.5rem;">
    <and-button id="accordion-demo-toggle">Toggle "item-1"</and-button>
  </div>
  <pre id="accordion-demo-output" style="margin: 0; white-space: pre-wrap; font-size: 0.8em;"></pre>
</div>

<script>
  function runAccordionDemo() {
    const H = window.andHeadless;
    const output = document.getElementById('accordion-demo-output');
    if (!H || !output) return;

    const accordion = H.createAccordion({ defaultValue: [] });

    const render = () => {
      output.textContent =
        'accordion.getTriggerProps("item-1") →\n' +
        JSON.stringify(accordion.getTriggerProps('item-1'), null, 2) +
        '\n\naccordion.getContentProps("item-1") →\n' +
        JSON.stringify(accordion.getContentProps('item-1'), null, 2);
    };
    accordion.subscribe(render);
    render();

    document.getElementById('accordion-demo-toggle')?.addEventListener('click', () => {
      accordion.actions.toggle('item-1');
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runAccordionDemo);
  } else {
    runAccordionDemo();
  }
</script>

## Next steps

[Primitives](/headless/primitives/#createidgenerator--generateid) — how the
`aria-controls`/`id` pair stays in sync.

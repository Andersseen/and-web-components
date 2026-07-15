---
title: Headless Core — Select
description:
  createSelect — listbox open state, disabled-option-skipping keyboard
  navigation, and typeahead search. Powers the styled Select component.
---

Powers [Select](/components/select/) internally. The most keyboard-heavy factory
in the package — full `ArrowDown`/`ArrowUp`/`Home`/`End` navigation that skips
disabled options and wraps at the ends, plus typeahead (type letters to jump to
a matching option).

## Usage

```ts
import { createSelect } from '@andersseen/headless-components/select';

const select = createSelect({
  options: [
    { value: 'sm', text: 'Small' },
    { value: 'md', text: 'Medium' },
    { value: 'lg', text: 'Large', disabled: true },
  ],
  defaultValue: 'sm',
  onValueChange: value => console.log('Selected:', value),
});

select.actions.open();
select.actions.highlightNext();
select.actions.selectHighlighted();
```

## Config

| Option          | Type                        | Default | Notes                         |
| --------------- | --------------------------- | ------- | ----------------------------- |
| `options`       | `SelectOption[]`            | `[]`    | `{ value, text, disabled? }`. |
| `defaultValue`  | `string`                    | —       |                               |
| `disabled`      | `boolean`                   | `false` |                               |
| `onValueChange` | `(value: string) => void`   | —       |                               |
| `onOpenChange`  | `(isOpen: boolean) => void` | —       |                               |

## State

`isOpen`, `highlightedIndex` (`-1` = none), `selectedValue: string | null`,
`disabled`.

## Actions & queries

| Member                                         | Signature                           | Notes                                                                   |
| ---------------------------------------------- | ----------------------------------- | ----------------------------------------------------------------------- |
| `actions.open()` / `close()` / `toggle()`      | `() => void`                        | `open()` highlights the current selection, or the first enabled option. |
| `actions.highlightNext()` / `highlightPrev()`  | `() => void`                        | Skips disabled options; wraps at the ends.                              |
| `actions.highlightFirst()` / `highlightLast()` | `() => void`                        |                                                                         |
| `actions.selectHighlighted()`                  | `() => void`                        | Selects the highlighted option, then closes.                            |
| `actions.selectValue(value)`                   | `(value: string) => void`           |                                                                         |
| `actions.setDisabled(v)`                       | `(disabled: boolean) => void`       |                                                                         |
| `actions.setOptions(options)`                  | `(options: SelectOption[]) => void` | Re-registers the option list (e.g. after an async load).                |
| `queries.isOpen()`                             | `() => boolean`                     |                                                                         |
| `queries.getSelectedText()`                    | `() => string \| undefined`         |                                                                         |
| `queries.getHighlightedOption()`               | `() => SelectOption \| undefined`   |                                                                         |
| `queries.getOptions()`                         | `() => SelectOption[]`              |                                                                         |

## Prop-getters & handlers

| Getter                        | Returns                                                                                                                                              |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `getTriggerProps()`           | `aria-haspopup: 'listbox'`, `aria-expanded`, `aria-disabled`, `data-state`                                                                           |
| `getMenuProps()`              | `role: 'listbox'`, `aria-label: 'Options'`, `data-state`, `hidden`                                                                                   |
| `getItemProps(option, index)` | `role: 'option'`, `aria-selected`, `aria-disabled`, `data-state` (`'active' \| 'highlighted' \| 'inactive'`), `tabindex` (`0` only when highlighted) |

`handleTriggerKeyDown(event)` opens on `Enter`/`Space`/`ArrowDown`/`ArrowUp`, or
on any printable character (which also starts a typeahead search).
`handleMenuKeyDown(event)` — `Escape`/`Tab` close; `ArrowDown`/`ArrowUp` move
the highlight (`Alt+ArrowDown`/`Alt+ArrowUp` close instead, matching the native
`<select>` convention); `Home`/`End` jump; `Enter`/`Space` select the
highlighted option; any other printable character continues the typeahead buffer
(reset after 500ms of inactivity).

## Live example

<div class="and-live-example" style="flex-direction: column; align-items: stretch; gap: 0.75rem;">
  <div style="display: flex; gap: 0.5rem;">
    <and-button id="select-demo-open">Open</and-button>
    <and-button id="select-demo-next" variant="outline">Highlight next</and-button>
    <and-button id="select-demo-choose" variant="outline">Select highlighted</and-button>
  </div>
  <pre id="select-demo-output" style="margin: 0; white-space: pre-wrap; font-size: 0.8em;"></pre>
</div>

<script>
  function runSelectDemo() {
    const H = window.andHeadless;
    const output = document.getElementById('select-demo-output');
    if (!H || !output) return;

    const select = H.createSelect({
      options: [
        { value: 'sm', text: 'Small' },
        { value: 'md', text: 'Medium' },
        { value: 'lg', text: 'Large', disabled: true },
      ],
      defaultValue: 'sm',
    });

    const render = () => {
      output.textContent =
        'select.state →\n' + JSON.stringify(select.state, null, 2) +
        '\n\nselect.getTriggerProps() →\n' + JSON.stringify(select.getTriggerProps(), null, 2);
    };
    select.subscribe(render);
    render();

    document.getElementById('select-demo-open')?.addEventListener('click', () => select.actions.toggle());
    document.getElementById('select-demo-next')?.addEventListener('click', () => select.actions.highlightNext());
    document.getElementById('select-demo-choose')?.addEventListener('click', () => select.actions.selectHighlighted());
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runSelectDemo);
  } else {
    runSelectDemo();
  }
</script>

## Next steps

[Input](/headless/input/) — the simpler text-entry relative, no options list.

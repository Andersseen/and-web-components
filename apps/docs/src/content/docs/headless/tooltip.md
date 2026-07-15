---
title: Headless Core — Tooltip
description:
  createTooltip — delayed show/hide state for hover and focus triggers, with no
  DOM positioning. Powers the styled Tooltip component.
---

Powers [Tooltip](/components/tooltip/) internally. Positioning (placing the
tooltip near its anchor) is a real layout operation left entirely to the
consuming component — this factory only tracks visibility and timing.

## Usage

```ts
import { createTooltip } from '@andersseen/headless-components/tooltip';

const tooltip = createTooltip({
  placement: 'top',
  openDelay: 200,
  closeDelay: 100,
  onVisibilityChange: visible => console.log('Tooltip:', visible),
});

trigger.addEventListener('mouseenter', tooltip.handleMouseEnter);
trigger.addEventListener('mouseleave', tooltip.handleMouseLeave);
trigger.addEventListener('focusin', tooltip.handleFocusIn);
trigger.addEventListener('focusout', tooltip.handleFocusOut);

tooltip.destroy(); // clears any pending show/hide timer
```

## Config

| Option               | Type                                     | Default | Notes |
| -------------------- | ---------------------------------------- | ------- | ----- |
| `placement`          | `'top' \| 'bottom' \| 'left' \| 'right'` | `'top'` |       |
| `openDelay`          | `number` (ms)                            | `0`     |       |
| `closeDelay`         | `number` (ms)                            | `0`     |       |
| `onVisibilityChange` | `(visible: boolean) => void`             | —       |       |
| `disabled`           | `boolean`                                | `false` |       |

## State

`isVisible`, `placement`, `disabled`.

## Actions

`show()` / `hide()` (both timer-debounced by `openDelay`/`closeDelay` — calling
`show()` twice in a row just resets the pending timer, it doesn't stack),
`setPlacement(v)`, `setDisabled(v)` (forces `isVisible: false` immediately if it
was open). No `queries` bucket; read `tooltip.state.isVisible` directly.

## Prop-getters, handlers & cleanup

| Getter              | Returns                                                                                     |
| ------------------- | ------------------------------------------------------------------------------------------- |
| `getTriggerProps()` | `aria-describedby` — only set to the tooltip's id while visible, `''` otherwise             |
| `getTooltipProps()` | `role: 'tooltip'`, `id`, `aria-hidden`, `data-state`, `data-side` (the placement), `hidden` |

`handleMouseEnter`/`handleFocusIn` call `show()`;
`handleMouseLeave`/`handleFocusOut` call `hide()` — attach all four to the
trigger element. `destroy()` clears any pending timer; call it when the trigger
unmounts so a delayed `show()`/`hide()` doesn't fire against a gone component.

## Live example

<div class="and-live-example" style="flex-direction: column; align-items: stretch; gap: 0.75rem;">
  <and-button id="tooltip-demo-trigger">Hover or focus me</and-button>
  <pre id="tooltip-demo-output" style="margin: 0; white-space: pre-wrap; font-size: 0.8em;"></pre>
</div>

<script>
  function runTooltipDemo() {
    const H = window.andHeadless;
    const output = document.getElementById('tooltip-demo-output');
    const trigger = document.getElementById('tooltip-demo-trigger');
    if (!H || !output || !trigger) return;

    const tooltip = H.createTooltip({ openDelay: 150, closeDelay: 100 });

    const render = () => {
      output.textContent = 'tooltip.getTooltipProps() →\n' + JSON.stringify(tooltip.getTooltipProps(), null, 2);
    };
    tooltip.subscribe(render);
    render();

    trigger.addEventListener('mouseenter', tooltip.handleMouseEnter);
    trigger.addEventListener('mouseleave', tooltip.handleMouseLeave);
    trigger.addEventListener('focusin', tooltip.handleFocusIn);
    trigger.addEventListener('focusout', tooltip.handleFocusOut);
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runTooltipDemo);
  } else {
    runTooltipDemo();
  }
</script>

## Next steps

[Primitives](/headless/primitives/) — every other factory's timer-free state
pattern, for comparison.

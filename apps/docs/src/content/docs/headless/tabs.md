---
title: Headless Core — Tabs
description:
  createTabs — ARIA tabs pattern with automatic/manual activation and
  orientation-aware keyboard navigation. Powers the styled Tabs component.
---

Powers [Tabs](/components/tabs/) internally.

## Usage

```ts
import { createTabs } from '@andersseen/headless-components/tabs';

const tabs = createTabs({
  defaultValue: 'tab-1',
  orientation: 'horizontal',
  onValueChange: tabId => console.log('Selected:', tabId),
});

tabs.actions.selectTab('tab-2');
```

## Config

| Option           | Type                         | Default        | Notes                                                   |
| ---------------- | ---------------------------- | -------------- | ------------------------------------------------------- |
| `defaultValue`   | `string`                     | —              | Initially selected tab id.                              |
| `onValueChange`  | `(tabId: string) => void`    | —              |                                                         |
| `orientation`    | `'horizontal' \| 'vertical'` | `'horizontal'` | Swaps which arrow keys move focus.                      |
| `activationMode` | `'automatic' \| 'manual'`    | `'automatic'`  | Automatic: arrow-focusing a tab selects it immediately. |
| `disabled`       | `boolean`                    | `false`        |                                                         |

## State

`selectedTab: string | null`, `orientation`, `activationMode`, `disabled`.

## Actions & queries

| Member                         | Signature                                           |
| ------------------------------ | --------------------------------------------------- |
| `actions.selectTab(id)`        | `(tabId: string) => void`                           |
| `actions.setDisabled(v)`       | `(disabled: boolean) => void`                       |
| `actions.setOrientation(v)`    | `(orientation: 'horizontal' \| 'vertical') => void` |
| `actions.setActivationMode(v)` | `(mode: 'automatic' \| 'manual') => void`           |
| `queries.isSelected(id)`       | `(tabId: string) => boolean`                        |
| `queries.getSelectedTab()`     | `() => string \| null`                              |

## Prop-getters & handler

| Getter                | Returns                                                                                                                                                                        |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `getContainerProps()` | `data-orientation`                                                                                                                                                             |
| `getListProps()`      | `role: 'tablist'`, `aria-orientation`                                                                                                                                          |
| `getTriggerProps(id)` | `role: 'tab'`, `aria-selected`, `aria-controls`, `aria-disabled`, `tabindex` (roving — `0` only for the selected tab), `id`, `data-state`, `data-disabled`, `data-orientation` |
| `getContentProps(id)` | `role: 'tabpanel'`, `aria-labelledby`, `tabindex: 0`, `id`, `hidden`, `data-state`                                                                                             |

`handleTriggerKeyDown(event, currentTabId, allTabIds)` — needs the full id list
every call, since the headless core doesn't track registration order itself.
`ArrowRight`/`ArrowLeft` (or `ArrowDown`/`ArrowUp` when
`orientation: 'vertical'`) move focus with wraparound; `Home`/`End` jump to the
first/last. In `automatic` mode, moving focus also calls `selectTab` — actually
focusing the resulting element is left to the consuming component (no DOM access
here).

## Live example

<div class="and-live-example" style="flex-direction: column; align-items: stretch; gap: 0.75rem;">
  <div style="display: flex; gap: 0.5rem;">
    <and-button id="tabs-demo-1">Select "tab-1"</and-button>
    <and-button id="tabs-demo-2">Select "tab-2"</and-button>
  </div>
  <pre id="tabs-demo-output" style="margin: 0; white-space: pre-wrap; font-size: 0.8em;"></pre>
</div>

<script>
  function runTabsDemo() {
    const H = window.andHeadless;
    const output = document.getElementById('tabs-demo-output');
    if (!H || !output) return;

    const tabs = H.createTabs({ defaultValue: 'tab-1' });

    const render = () => {
      output.textContent =
        'tabs.getTriggerProps("tab-1") →\n' + JSON.stringify(tabs.getTriggerProps('tab-1'), null, 2) +
        '\n\ntabs.getTriggerProps("tab-2") →\n' + JSON.stringify(tabs.getTriggerProps('tab-2'), null, 2);
    };
    tabs.subscribe(render);
    render();

    document.getElementById('tabs-demo-1')?.addEventListener('click', () => tabs.actions.selectTab('tab-1'));
    document.getElementById('tabs-demo-2')?.addEventListener('click', () => tabs.actions.selectTab('tab-2'));
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runTabsDemo);
  } else {
    runTabsDemo();
  }
</script>

## Next steps

[Sidebar](/headless/sidebar/) and [Navbar](/headless/navbar/) implement a
similar roving-focus keyboard pattern over a registered item list.

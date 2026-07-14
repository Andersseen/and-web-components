---
title: Tabs
description:
  Tabs root that coordinates and-tabs-list, and-tabs-trigger, and
  and-tabs-content via shared headless logic.
---

Tabs root — coordinates `and-tabs-list` > `and-tabs-trigger` and
`and-tabs-content` children via shared headless logic, injected into each child
automatically. Arrow keys, Home/End, and roving tabindex are handled for you.

## Example

<div class="and-live-example" style="flex-direction: column; align-items: stretch;">
  <and-tabs default-value="account">
    <and-tabs-list>
      <and-tabs-trigger value="account">Account</and-tabs-trigger>
      <and-tabs-trigger value="password">Password</and-tabs-trigger>
    </and-tabs-list>
    <and-tabs-content value="account">Manage your account details here.</and-tabs-content>
    <and-tabs-content value="password">Change your password here.</and-tabs-content>
  </and-tabs>
</div>

```html
<and-tabs default-value="account">
  <and-tabs-list>
    <and-tabs-trigger value="account">Account</and-tabs-trigger>
    <and-tabs-trigger value="password">Password</and-tabs-trigger>
  </and-tabs-list>
  <and-tabs-content value="account"
    >Manage your account details here.</and-tabs-content
  >
  <and-tabs-content value="password"
    >Change your password here.</and-tabs-content
  >
</and-tabs>
```

## Properties

### `and-tabs` (root)

| Property         | Attribute         | Description                                   | Type                         | Default        |
| ---------------- | ----------------- | --------------------------------------------- | ---------------------------- | -------------- |
| `value`          | `value`           | The currently selected tab value.             | `string`                     | `''`           |
| `defaultValue`   | `default-value`   | The initial tab value when uncontrolled.      | `string`                     | `''`           |
| `orientation`    | `orientation`     | Orientation of the tab list.                  | `"horizontal" \| "vertical"` | `'horizontal'` |
| `activationMode` | `activation-mode` | How tabs are activated: on focus or on click. | `"automatic" \| "manual"`    | `'automatic'`  |

### `and-tabs-trigger`

| Property   | Attribute  | Description                           | Type      | Default     |
| ---------- | ---------- | ------------------------------------- | --------- | ----------- |
| `value`    | `value`    | The value that identifies this tab.   | `string`  | `undefined` |
| `disabled` | `disabled` | Whether this tab trigger is disabled. | `boolean` | `false`     |

### `and-tabs-content`

| Property | Attribute | Description                                                  | Type     | Default     |
| -------- | --------- | ------------------------------------------------------------ | -------- | ----------- |
| `value`  | `value`   | The value that identifies which tab this content belongs to. | `string` | `undefined` |

## Events

| Event          | Description                            | Type                  |
| -------------- | -------------------------------------- | --------------------- |
| `andTabChange` | Emitted when the selected tab changes. | `CustomEvent<string>` |

<small>
  Note: `packages/web-components/src/components/and-tabs/readme.md` currently
  documents `and-tabs-trigger`, not the `and-tabs` root — see the note on the
  [Accordion](/components/accordion/) page for why. The root's table above
  comes from `and-tabs.tsx` directly.
</small>

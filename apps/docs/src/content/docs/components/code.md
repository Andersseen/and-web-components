---
title: Code
description:
  Read-only command/code snippet block with a copy-to-clipboard button.
---

Read-only command/code snippet block with a copy-to-clipboard button. Plain text
only — it doesn't do syntax highlighting, and `prompt` is just a display hint
(no relation to any actual shell or language). The prompt character is hidden by
default; opt in with `showPrompt`.

## Example

<div class="and-live-example" style="flex-direction: column; align-items: stretch;">
  <and-code value="pnpm add @andersseen/web-components" show-prompt></and-code>
</div>

```html
<and-code value="pnpm add @andersseen/web-components" show-prompt></and-code>
```

## Properties

| Property      | Attribute     | Description                                                                                          | Type      | Default  |
| ------------- | ------------- | ---------------------------------------------------------------------------------------------------- | --------- | -------- |
| `copyable`    | `copyable`    | Whether to show the copy button.                                                                     | `boolean` | `true`   |
| `customClass` | `class`       | Additional CSS classes from the consumer.                                                            | `string`  | `''`     |
| `height`      | `height`      | Fixed height of the block (CSS length).                                                              | `string`  | `'auto'` |
| `prompt`      | `prompt`      | Prompt character shown before each line (e.g. `$`, `>`, `#`). Ignored unless `showPrompt` is `true`. | `string`  | `'$'`    |
| `showPrompt`  | `show-prompt` | Whether to show the `prompt` character before each line. Off by default — opt in per instance.       | `boolean` | `false`  |
| `value`       | `value`       | Code or command to display.                                                                          | `string`  | `''`     |

## Events

| Event         | Description                                          | Type                                                |
| ------------- | ---------------------------------------------------- | --------------------------------------------------- |
| `andCodeCopy` | Emitted when the content is copied to the clipboard. | `CustomEvent<{ value: string; success: boolean; }>` |

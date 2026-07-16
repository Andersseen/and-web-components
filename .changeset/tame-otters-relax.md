---
'@andersseen/web-components': minor
'@andersseen/headless-components': minor
---

`and-select` now resyncs its value with a wrapping `<form>` after a native
`form.reset()`. It already renders in light DOM with a hidden
`<input type="hidden">` mirroring `value` as a real descendant of the form, so
`FormData` and `<fieldset disabled>` worked natively already — the gap was that
Stencil re-stamps the hidden input's `value` attribute on every selection,
dragging its native reset-default along with it, so a form reset previously
restored the _last selected_ value instead of the true default. Fixed with the
same `reset`-listener pattern as `and-input`, plus a new `setSelectedValue`
headless action for restoring "no selection". Also adds an "In a form" Storybook
story demonstrating submit, reset, and `fieldset[disabled]`.

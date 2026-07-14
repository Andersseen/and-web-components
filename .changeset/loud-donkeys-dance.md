---
'@andersseen/web-components': minor
---

`and-input` now resyncs its value with a wrapping `<form>` after a native
`form.reset()`. Its inner `<input>` already renders in light DOM as a real
descendant of the form, so `FormData`, `required` validation, and
Enter-to-submit worked natively already — the only gap was that a native reset
changed the visible input's value without notifying the component, leaving its
internal state stale. Also adds an "In a form" Storybook story demonstrating
submit and reset.

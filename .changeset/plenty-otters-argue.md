---
'@andersseen/web-components': minor
'@andersseen/headless-components': minor
---

Adds `and-switch`, a boolean on/off toggle. Renders in light DOM around a real
`<input type="checkbox" role="switch">`, so `FormData`, native `required`
validation, `<fieldset disabled>`, keyboard (Space), and label-click-to-toggle
all work natively with no extra wiring — the visible track/thumb are styled
purely off the checkbox's own `:checked`/`:disabled` state via Tailwind `peer-*`
variants. Also resyncs on native `form.reset()`, the same fix already shipped
for `and-input` and `and-select`. Adds the new `createSwitch` headless factory
(`@andersseen/headless-components/switch`), spec tests, a Storybook "In a form"
story, and a docs page.

---
title: Styling Integration
description:
  Use the design tokens with or without Tailwind — SASS/plain CSS and Tailwind
  are both first-class paths.
---

Components render with **Shadow DOM** — their compiled styles (including
Tailwind) live inside each component's shadow root, invisible to your document's
own stylesheets. Tailwind is never a requirement to consume
`@andersseen/web-components`; the only thing your document needs is the **design
tokens** (CSS custom properties like `--primary`, `--radius`, `--background`).

Tailwind is entirely optional at the document level — pick either path, or
neither:

## Without Tailwind (SASS / plain CSS)

Import the tokens directly. No Tailwind, no Preflight reset, no opinionated
`body` rule — safe to load alongside hand-authored SASS.

```ts
import '@andersseen/web-components/tokens.css';
```

`tokens.css` bundles the default palette (Indigo & Rose, light + dark) and the
default style theme (radius, spacing, motion, navbar/sidebar/carousel tokens).
For a different palette or style theme, import the underlying files instead:

```ts
import '@andersseen/web-components/colors/slate-amber.css';
import '@andersseen/web-components/themes/styles/compact.css';
```

If you also want the same utility classes components apply to their own host
element (see [Theming & Tokens](/guides/theming-tokens/) for the token list),
without Tailwind's Preflight reset fighting your SASS:

```ts
import '@andersseen/web-components/elements.css';
```

`elements.css` ships the same Tailwind utility classes as the full bundle, minus
`@tailwind base` and the `body { background/color }` rule.

This is the same CSS the old `style.css` bundle contains, just split so you can
opt out of the reset:

| Import                                  | Tokens | Utility classes | Preflight reset |
| --------------------------------------- | ------ | --------------- | --------------- |
| `tokens.css`                            | ✅     | —               | —               |
| `elements.css`                          | —      | ✅              | —               |
| `style.css` (existing, still supported) | ✅     | ✅              | ✅              |

## With Tailwind

If your app already uses Tailwind, add the library's preset so your own
`bg-primary` / `rounded-lg` / `t-gap-*` utilities resolve to the exact same
tokens the components use — no copy-pasting color scales into your config:

```js
// tailwind.config.js
module.exports = {
  presets: [require('@andersseen/web-components/tailwind-preset')],
  content: ['./src/**/*.{html,js,jsx,ts,tsx,astro,vue}'],
};
```

Then load a token file (`tokens.css`, or a `colors/*.css` +
`themes/styles/*.css` pair) the same way as the no-Tailwind path above — the
preset only maps utility _names_ to `--*` variables, it doesn't define the
variables themselves.

```html
<div class="bg-primary text-primary-foreground rounded-lg p-t-gap">
  Uses the library's tokens through your own Tailwind build.
</div>
```

Switching palette (`and-color`) or style theme (`and-theme`) at runtime still
works — your Tailwind utilities re-resolve automatically since they reference
the same custom properties.

`@andersseen/web-components/tailwind.config.js` (the internal Stencil build
config) imports this exact preset via `presets: [...]`, so the two can never
drift.

## Reference: what each export contains

| Export                                       | Contents                                  | Use when                                         |
| -------------------------------------------- | ----------------------------------------- | ------------------------------------------------ |
| `@andersseen/web-components/style.css`       | tokens + host utilities + Preflight reset | You want everything, zero setup                  |
| `@andersseen/web-components/tokens.css`      | tokens only                               | SASS/plain CSS, own reset                        |
| `@andersseen/web-components/elements.css`    | host utility classes only                 | SASS/plain CSS, want utilities without the reset |
| `@andersseen/web-components/tailwind-preset` | Tailwind config preset (no CSS)           | Your app already has Tailwind                    |

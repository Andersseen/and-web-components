---
title: Theming & Tokens
description:
  The full list of overridable design tokens, and how to build a custom theme
  from them.
---

Every visual property in the library — color, radius, spacing, motion timing,
per-component density — is a CSS custom property. Components never hardcode
colors or magic numbers; they read `var(--*)` and fall back to sane defaults.
This page lists the public token contract and how to override it.

Two independent axes, both switched with an attribute on `<html>` (or any
ancestor, since components pick them up via inheritance):

```html
<html and-color="slate-amber" and-theme="compact" and-mode="dark"></html>
```

- **`and-color`** — palette: primary/secondary color scales and the semantic
  surface colors derived from them.
- **`and-theme`** — shape/density: radius, spacing, motion, and per-component
  sizing (navbar height, sidebar width, carousel controls, …).
- **`and-mode`** — `light` / `dark`, on top of either axis. Defaults to
  `prefers-color-scheme`; `.dark` is a supported shorthand for
  `and-mode="dark"`.

## Color tokens (`and-color`)

Set by `themes/colors/*.css` (`default`, `slate-amber`, `emerald-orange`,
`violet-cyan`, `rose-teal`, `indigo-rose`). Each palette defines:

| Token                                                  | Purpose                                    |
| ------------------------------------------------------ | ------------------------------------------ |
| `--primary-50` … `--primary-950`                       | Full brand color scale                     |
| `--secondary-50` … `--secondary-950`                   | Complementary accent scale                 |
| `--primary`, `--primary-foreground`                    | Main CTA/link/focus color + its text color |
| `--secondary`, `--secondary-foreground`                | Accent badges/highlights + its text color  |
| `--background`, `--foreground`                         | Page background/text                       |
| `--card`, `--card-foreground`                          | Card surface                               |
| `--popover`, `--popover-foreground`                    | Overlay surface (dropdown, tooltip, menu)  |
| `--muted`, `--muted-foreground`                        | De-emphasized surface/text                 |
| `--accent`, `--accent-foreground`                      | Hover/selected surface                     |
| `--destructive`, `--destructive-foreground`            | Danger actions                             |
| `--border`, `--input`, `--ring`                        | Border, form input border, focus ring      |
| `--success` / `--warning` / `--info` (+ `-foreground`) | Status colors                              |

All are bare HSL triplets (`243 75% 59%`, no `hsl()` wrapper) so both the
library and your own CSS can apply opacity modifiers:
`hsl(var(--primary) / 0.5)` or, in Tailwind, `bg-primary/50`.

## Style tokens (`and-theme`)

Set by `themes/styles/*.css` (`default`, `compact`, `playful`, `retro`,
`elegant`):

| Token                                                                            | Purpose                                                               |
| -------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| `--radius`                                                                       | Base corner radius — drives `rounded-lg/md/sm` everywhere             |
| `--spacing-factor`                                                               | Multiplier on the `t-gap-*` spacing scale                             |
| `--border-width`                                                                 | Default border thickness                                              |
| `--navbar-link-active-weight/letter-spacing/text-transform`                      | Nav link typography                                                   |
| `--theme-layout-max-width`                                                       | Page/container max width                                              |
| `--theme-motion-fast/base/slow`                                                  | Animation durations                                                   |
| `--theme-easing-standard`                                                        | Animation easing curve                                                |
| `--theme-focus-ring-width/offset`                                                | Focus ring sizing                                                     |
| `--theme-surface-blur`, `--theme-overlay-opacity`, `--theme-modal-backdrop-blur` | Overlay/backdrop treatment                                            |
| `--theme-navbar-*`                                                               | Navbar height, padding, item/section gap, active indicator            |
| `--theme-sidebar-*`                                                              | Sidebar width (expanded/collapsed), header height, padding, icon size |
| `--theme-carousel-*`                                                             | Carousel track radius, control size/offset/radius/border              |

`--radius` alone reshapes every rounded corner in the library (`rounded-lg` =
`var(--radius)`, `rounded-md`/`rounded-sm` scale proportionally from it,
`rounded-full` is unaffected). The `--theme-*` tokens are what make `and-theme`
feel different beyond corners — they drive real dimensions in `and-navbar`,
`and-sidebar`, `and-modal`, `and-carousel`, and `and-select`.

## Building a custom theme

Don't fork a new theme file — layer your own values on top of an existing
preset, the same pattern shadcn/ui and Radix Themes use. There is no separate
"custom theme" mechanism to learn: `and-theme` is just an attribute selector, so
any value you put on it — including one the library doesn't ship — works as long
as you write the matching CSS rule.

### 1. Pick a starting point

Start from the built-in preset closest to what you want (`default`, `compact`,
`playful`, `retro`, or `elegant`) — see the
[Style tokens](#style-tokens-and-theme) table above for what each changes. Load
it the same way as any other theme:

```ts
import '@andersseen/web-components/tokens.css'; // default palette + default style
```

### 2. Override brand colors

Add a rule scoped to your own theme name. Override only the tokens that differ
from the base — everything else keeps inheriting from what you loaded in step 1:

```css
[and-theme='brand'] {
  /* Brand primary color, its scale, and the text color that sits on it */
  --primary: 262 83% 58%;
  --primary-foreground: 0 0% 100%;

  /* Optional: full scale if you use primary-50..950 utilities anywhere */
  --primary-500: 262 83% 66%;
  --primary-600: 262 83% 58%;
  --primary-700: 262 74% 48%;
}
```

Remember the values are bare `H S% L%` triplets (no `hsl()` wrapper) — that's
what lets both the library and `hsl(var(--primary) / 0.5)`-style opacity
overrides work.

### 3. Override shape/density tokens

Same rule, same selector — add whichever `--radius`, `--spacing-factor`, or
`--theme-*` tokens your brand needs:

```css
[and-theme='brand'] {
  /* ...colors from step 2... */

  --radius: 0.375rem;
  --theme-navbar-height: 3.75rem;
  --theme-focus-ring-width: 3px;
}
```

### 4. Handle dark mode

If your brand color needs a different value in dark mode, nest it under
`and-mode="dark"` (or `.dark`, the supported shorthand) combined with your theme
selector:

```css
[and-theme='brand'][and-mode='dark'],
[and-theme='brand'].dark {
  --primary: 262 83% 70%;
  --primary-foreground: 262 47% 14%;
}
```

### 5. Apply and verify

```html
<html and-theme="brand" and-color="indigo-rose"></html>
```

Because every component consumes these through `var(--token, fallback)`,
overriding a handful of tokens is enough — you don't need to touch component
CSS, and updates to the library won't silently revert your overrides (they live
in your own stylesheet, loaded after the library's). To sanity-check a theme
visually before wiring it into your app, the fastest loop is Storybook
(`pnpm storybook` in `packages/web-components`) or the Angular demo app
(`pnpm start:demo`) — both apply `and-theme`/`and-color` on `<html>` the same
way, and the demo app's navbar has a live theme/palette switcher you can use as
a reference for how the attribute wiring should look in your own app.

See [Styling Integration](/guides/styling-integration/) for the no-Tailwind and
Tailwind-preset paths for loading these tokens in the first place.

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
preset, the same pattern shadcn/ui and Radix Themes use. Load a base theme, then
override just the tokens you care about:

```css
/* Load a base palette + style theme first */
@import '@andersseen/web-components/tokens.css';

/* Then override only what your brand needs */
[and-theme='brand'] {
  --primary: 262 83% 58%;
  --primary-foreground: 0 0% 100%;
  --radius: 0.375rem;
  --theme-navbar-height: 3.75rem;
}
```

```html
<html and-theme="brand"></html>
```

Because every component consumes these through `var(--token, fallback)`,
overriding a handful of tokens is enough — you don't need to touch component
CSS, and updates to the library won't silently revert your overrides (they live
in your own stylesheet, loaded after the library's).

See [Styling Integration](/guides/styling-integration/) for the no-Tailwind and
Tailwind-preset paths for loading these tokens in the first place.

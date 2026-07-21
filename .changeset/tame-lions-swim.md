---
'@andersseen/web-components': minor
---

Makes Tailwind optional at the consumer end: adds `./tokens.css` (pure design
tokens, no `@tailwind`, no Preflight reset), `./elements.css` (the same host
utility classes `style.css` ships, without Preflight), and a shareable
`./tailwind-preset` so apps that already use Tailwind can map `bg-primary` /
`rounded-lg` / `t-gap-*` to the library's tokens without copying config.
`style.css` is unchanged and still supported.

Also fixes a theming gap: switching style themes at runtime via the documented
`and-theme` attribute (e.g. `<html and-theme="playful">`) only set 6 structural
tokens, while the static `themes/styles/*.css` imports set ~36 (including
`--theme-navbar-*`, `--theme-sidebar-*`, `--theme-carousel-*`, motion timings).
The two are now kept in sync, so runtime theme switching produces the full
effect. `borderRadius` (`rounded-md`/`rounded-sm`) now scales proportionally
from `--radius` instead of fixed pixel offsets, so themes with a larger base
radius (e.g. `playful`) differentiate their radius steps more clearly.

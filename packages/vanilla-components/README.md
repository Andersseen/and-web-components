# @andersseen/vanilla-components

> ## ⚠️ Experimental — not production-ready
>
> This package is a **proof of concept**: it exists to validate that
> `@andersseen/headless-components` can drive plain Custom Elements with zero
> runtime dependencies. It is not a supported UI library.
>
> - It ships **3 components** (button, accordion, modal) against the 25 in
>   `@andersseen/web-components`.
> - It is pinned at `0.0.x` and is **excluded from the Changesets release flow**
>   — it does not follow the rest of the stack's cadence and gets no minor
>   releases.
> - Its API can change or disappear without a deprecation window.
>
> **For anything real, use
> [`@andersseen/web-components`](https://www.npmjs.com/package/@andersseen/web-components).**
>
> ### Note on versions
>
> A `1.0.0` was published to npm by mistake and does not reflect maturity. The
> package tracks `0.0.x`. Note that `0.0.1` and `0.1.0` are earlier builds
> already on npm, so the next release is `0.0.2`. Depend on an exact `0.0.x`
> version.

Zero-runtime-dependency native Custom Elements built on the same headless core
as the Stencil components. `@andersseen/motion` is optional and loaded
dynamically only when the `animated` attribute is present.

## Install

```bash
pnpm add @andersseen/vanilla-components @andersseen/headless-components
```

## Usage

```html
<link
  rel="stylesheet"
  href="node_modules/@andersseen/vanilla-components/style.css"
/>

<and-vanilla-modal id="dialog" label="Confirm deletion">
  <h2>Delete account</h2>
  <p>This cannot be undone.</p>
  <button>Confirm</button>
</and-vanilla-modal>

<script type="module">
  import '@andersseen/vanilla-components';
  document.getElementById('dialog').setAttribute('open', '');
</script>
```

Importing the package registers `and-vanilla-button`, `and-vanilla-accordion`
and `and-vanilla-modal` automatically in the browser. The import is safe on the
server: element registration is skipped when there is no DOM, so the module can
be pulled into an Astro or Next server build without crashing.

To register manually instead:

```ts
import { defineAndComponents } from '@andersseen/vanilla-components';

defineAndComponents();
```

## Components

| Element                 | Notes                                                        |
| ----------------------- | ------------------------------------------------------------ |
| `and-vanilla-button`    | `variant`, `size`, `disabled`, `loading`                     |
| `and-vanilla-accordion` | single/multiple expansion                                    |
| `and-vanilla-modal`     | `open`, `animated`, `label`, focus trap, Escape, scroll lock |

### `and-vanilla-modal`

Give every modal an accessible name: set `label`, or slot a heading
(`<h1>`–`<h6>`) as the first element and it is wired as `aria-labelledby`
automatically.

| Attribute  | Description                                           |
| ---------- | ----------------------------------------------------- |
| `open`     | Reflects and controls the open state                  |
| `animated` | Enables enter/exit animation via `@andersseen/motion` |
| `label`    | Accessible name for the dialog                        |

Emits `andModalClose` (bubbles, composed) once per close.

## License

MIT

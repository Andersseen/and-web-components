---
'@andersseen/web-components': patch
---

Mark custom element registration files as side-effectful so Vite/Astro
production builds keep them in the client bundle. Fixes missing `<and-navbar>`,
`<and-button>`, `<and-icon>` and other components on the deployed landing page.

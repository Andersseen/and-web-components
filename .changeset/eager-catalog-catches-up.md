---
'@andersseen/mcp': patch
---

Regenerate the catalog against `@andersseen/web-components@0.4.1`
(`CATALOG_VERSION` `2026-08-07`).

Only `and-button`'s description changed: it now states that there is no `full`
prop and how to get a full-width button (`class="w-full"`, or `::part(button)`).
That is the exact question the server exists to answer correctly — without this
release it would keep telling assistants nothing about the most commonly
attempted prop on the most commonly used component.

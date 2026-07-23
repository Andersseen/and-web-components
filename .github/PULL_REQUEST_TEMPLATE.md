<!--
Read AGENTS.md before your first PR — it defines the package boundaries and
which files are generated (never edit stencil-generated/**, component readme.md,
src/components.d.ts, or custom-elements.json by hand).
-->

## What changed

<!-- One or two sentences. Link the issue this closes, if there is one. -->

## Why

<!-- The problem being solved. Skip if it's obvious from the above. -->

## Checklist

- [ ] `pnpm lint` passes
- [ ] Tests for the affected package pass
- [ ] `pnpm build:stencil` passes (required if you touched `packages/*`)
- [ ] Added a changeset (`pnpm changeset`) — needed for anything that changes
      published behaviour, not for docs or CI-only changes
- [ ] No generated files edited by hand

## Screenshots

<!-- For visual changes. Before/after helps a lot. Delete this section otherwise. -->

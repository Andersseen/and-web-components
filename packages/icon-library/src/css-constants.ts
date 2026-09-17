/**
 * The `[and-icon]` base rule shared by every CSS-only output
 * (`icons.css`, `base.css`, and the inline `<style>` `initLazyIcons()`
 * injects) — sizing, `currentColor` paint, and mask geometry. Icon-specific
 * rules (see `generate-css.ts`) only ever add a `mask-image`; this is the one
 * place the shared declarations are written.
 */
export const BASE_RULE = `[and-icon] {
  display: inline-block;
  width: 1em;
  height: 1em;
  background-color: currentColor;
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
  -webkit-mask-position: center;
  mask-position: center;
  -webkit-mask-size: contain;
  mask-size: contain;
}`;

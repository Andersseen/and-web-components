/**
 * Client-side bootstrap for @andersseen web components.
 *
 * Uses dist-custom-elements (auto-define) so Vite can bundle everything
 * statically — the lazy-loader's runtime dynamic imports break in
 * production because the entry-file chunks aren't emitted by Astro.
 *
 * Import options:
 *   - All at once:   import "@andersseen/web-components/components/all";
 *   - Tree-shaking:  import "@andersseen/web-components/components/and-navbar.js";
 */

// ── Web Components (register all) ──
import "@andersseen/web-components/components/all";

// ── Icons ──
import { registerAllIcons } from "@andersseen/icon";
registerAllIcons();

// ── Motion (attribute-driven animations) ──
import { initMotion } from "@andersseen/motion";
document.addEventListener("DOMContentLoaded", () => {
  initMotion();
});

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
 *
 * NOTE: Component animations are opt-in.  The global flag
 *       `window.__AND_ANIMATED__` is set by an inline <script> in
 *       Layout.astro BEFORE this module runs so that every component's
 *       `componentWillLoad` sees the flag during initial upgrade.
 *       The `enableAnimations()` call here is kept for API correctness.
 */

// ── Enable component animations ──
import { enableAnimations } from "@andersseen/web-components";
enableAnimations();

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

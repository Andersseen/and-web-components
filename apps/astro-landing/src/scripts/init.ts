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

type Mode = "light" | "dark";

const THEME_STORAGE_KEYS = {
  mode: "andersseen-mode",
  theme: "andersseen-theme",
  color: "andersseen-color",
} as const;

const THEME_DEFAULTS = {
  theme: "default",
  color: "indigo-rose",
} as const;

const getSystemMode = (): Mode =>
  window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

const readMode = (): Mode => {
  const stored = localStorage.getItem(THEME_STORAGE_KEYS.mode);
  return stored === "light" || stored === "dark" ? stored : getSystemMode();
};

const readTheme = (): string =>
  localStorage.getItem(THEME_STORAGE_KEYS.theme) || THEME_DEFAULTS.theme;

const readColor = (): string =>
  localStorage.getItem(THEME_STORAGE_KEYS.color) || THEME_DEFAULTS.color;

const applyThemeState = (mode: Mode, theme: string, color: string): void => {
  const root = document.documentElement;

  root.classList.toggle("dark", mode === "dark");
  root.setAttribute("data-color", color);

  if (theme !== THEME_DEFAULTS.theme) {
    root.setAttribute("data-theme", theme);
  } else {
    root.removeAttribute("data-theme");
  }

  const modeIcon = document.getElementById(
    "theme-mode-icon",
  ) as HTMLElement | null;

  if (modeIcon) {
    modeIcon.setAttribute("name", mode === "dark" ? "sun" : "moon");
  }

  const styleSelect = document.getElementById(
    "theme-style-select",
  ) as HTMLSelectElement | null;
  const colorSelect = document.getElementById(
    "theme-color-select",
  ) as HTMLSelectElement | null;

  if (styleSelect) {
    styleSelect.value = theme;
  }

  if (colorSelect) {
    colorSelect.value = color;
  }
};

const setupThemeControls = (): void => {
  const root = document.documentElement;
  const modeToggle = document.getElementById(
    "theme-mode-toggle",
  ) as HTMLButtonElement | null;
  const styleSelect = document.getElementById(
    "theme-style-select",
  ) as HTMLSelectElement | null;
  const colorSelect = document.getElementById(
    "theme-color-select",
  ) as HTMLSelectElement | null;

  let mode = readMode();
  let theme = readTheme();
  let color = readColor();

  applyThemeState(mode, theme, color);

  modeToggle?.addEventListener("click", () => {
    mode = root.classList.contains("dark") ? "light" : "dark";
    localStorage.setItem(THEME_STORAGE_KEYS.mode, mode);
    applyThemeState(mode, theme, color);
  });

  styleSelect?.addEventListener("change", (event) => {
    const nextTheme =
      (event.currentTarget as HTMLSelectElement).value || THEME_DEFAULTS.theme;
    theme = nextTheme;
    localStorage.setItem(THEME_STORAGE_KEYS.theme, nextTheme);
    applyThemeState(mode, theme, color);
  });

  colorSelect?.addEventListener("change", (event) => {
    const nextColor =
      (event.currentTarget as HTMLSelectElement).value || THEME_DEFAULTS.color;
    color = nextColor;
    localStorage.setItem(THEME_STORAGE_KEYS.color, nextColor);
    applyThemeState(mode, theme, color);
  });

  const media = window.matchMedia("(prefers-color-scheme: dark)");
  media.addEventListener("change", (event) => {
    const hasExplicitMode =
      localStorage.getItem(THEME_STORAGE_KEYS.mode) !== null;
    if (hasExplicitMode) {
      return;
    }

    mode = event.matches ? "dark" : "light";
    applyThemeState(mode, theme, color);
  });
};

document.addEventListener("DOMContentLoaded", () => {
  setupThemeControls();
  initMotion();
});

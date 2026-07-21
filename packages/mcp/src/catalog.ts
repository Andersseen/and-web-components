/**
 * Catalog access layer — wraps the generated component data and exposes the
 * project/theme metadata the MCP server serves.
 */

import type { Component } from './types';
import { catalog, CATALOG_VERSION } from './catalog-generated';

export { catalog, CATALOG_VERSION };
export type { Component } from './types';

const byTag = new Map(catalog.map(c => [c.tag, c]));

export function listComponents(): Component[] {
  return catalog;
}

/** Top-level components (excludes structural sub-components like `and-card-header`). */
export function topLevelComponents(): Component[] {
  return catalog.filter(c => !c.parent);
}

export function getComponent(tag: string): Component | undefined {
  return byTag.get(tag);
}

export const componentTags: string[] = catalog.map(c => c.tag);

export const projectInfo = {
  name: 'And Web Components',
  type: 'framework-agnostic-component-library',
  description:
    'Framework-agnostic UI components built as Stencil web components on a pure-TypeScript ' +
    'headless core, with generated React, Vue and Angular wrappers plus an Astro integration.',
  docs: 'https://and-web-components-docs.pages.dev',
  repository: 'https://github.com/Andersseen/and-web-components',
  packages: {
    webComponents: '@andersseen/web-components',
    react: '@andersseen/react-components',
    vue: '@andersseen/vue-components',
    angular: '@andersseen/angular-components',
    vanilla: '@andersseen/vanilla-components',
    astro: '@andersseen/astro',
    icon: '@andersseen/icon',
    motion: '@andersseen/motion',
    layout: '@andersseen/layout',
    behaviors: '@andersseen/behaviors',
    headless: '@andersseen/headless-components',
    mcp: '@andersseen/mcp',
  },
  naming: {
    tag: 'and-<name>',
    className: 'And<Name>',
    note: 'All wrappers are generated 1:1 from the same Stencil components: `and-button` -> `AndButton`.',
  },
  catalogVersion: CATALOG_VERSION,
};

export const themeInfo = {
  colors: ['indigo-rose', 'slate-amber', 'emerald-orange', 'violet-cyan', 'rose-teal'],
  themes: ['default', 'compact', 'playful', 'retro', 'elegant'],
  modes: ['light', 'dark'],
  howTo: {
    color: 'Set the color palette on the document root: <html and-color="slate-amber">.',
    theme: 'Set the style preset on the document root: <html and-theme="compact">.',
    mode: 'Toggle dark mode via the `and-mode` attribute: <html and-mode="dark">.',
    css: "Import styles once: import '@andersseen/web-components/style.css'.",
  },
  example: '<html and-theme="compact" and-color="slate-amber" and-mode="dark">',
  cssImports: {
    all: '@andersseen/web-components/style.css',
    tokens: '@andersseen/web-components/tokens.css',
  },
};

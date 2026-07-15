import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import andersseen from '@andersseen/astro';
import { sidebar } from './sidebar.config.mjs';

// `@andersseen/astro` only registers web-components + icons (see its own
// README) — it doesn't know about the other product-core packages this docs
// site now also documents. Their live examples need this site's own tiny
// integration to initialize them on every page, using the same
// `injectScript('page', ...)` mechanism the real integration uses (a raw
// <script> in page content can't `import` a bare module specifier like
// '@andersseen/motion' — that only resolves through Vite):
//   - `initMotion()` for the Motion pages' `[and-motion]` examples, plus
//     `createMotionPlayer` exposed as `window.andMotion` so a plain content
//     <script> (e.g. the Imperative Player page) can call it directly.
//   - `defineBehaviors({ observe: true })` for the Behaviors pages'
//     `and-tooltip`/`and-splitter`/etc. attribute examples, plus the
//     `create*` factories exposed as `window.andBehaviors` so each behavior's
//     "Imperative API" section (and the Recipes page) can call them directly
//     (same reasoning as `window.andMotion`).
//   - a side-effect import of `@andersseen/vanilla-components`, which
//     self-registers its custom elements (`and-vanilla-button` etc.) on
//     import — see packages/vanilla-components/src/index.ts.
//   - every `create*` factory from `@andersseen/headless-components` exposed
//     as `window.andHeadless`, so each Headless Core page (Overview + one
//     per factory) can print its actual (unstyled, DOM-free) return value
//     live, and call its actions from a demo button.
function productCoreInit() {
  return {
    name: 'product-core-init',
    hooks: {
      'astro:config:setup': ({ injectScript }) => {
        injectScript(
          'page',
          `import { initMotion, createMotionPlayer } from '@andersseen/motion';
           import { defineBehaviors, createSplitter, createTooltip, createDialog, createDraggable, createDropZone } from '@andersseen/behaviors';
           import {
             createButton, createAccordion, createTabs, createDropdown, createModal, createDrawer,
             createTooltip as createHeadlessTooltip, createToastManager, createInput, createSelect,
             createAlert, createNavbar, createSidebar, createBreadcrumb, createCarousel, createMenuList,
             createContextMenu,
           } from '@andersseen/headless-components';
           import '@andersseen/vanilla-components';
           window.andMotion = { createMotionPlayer };
           window.andHeadless = {
             createButton, createAccordion, createTabs, createDropdown, createModal, createDrawer,
             createTooltip: createHeadlessTooltip, createToastManager, createInput, createSelect,
             createAlert, createNavbar, createSidebar, createBreadcrumb, createCarousel, createMenuList,
             createContextMenu,
           };
           window.andBehaviors = { createSplitter, createTooltip, createDialog, createDraggable, createDropZone };
           initMotion();
           defineBehaviors({ observe: true });`,
        );
      },
    },
  };
}

// https://astro.build/config
export default defineConfig({
  integrations: [
    starlight({
      title: 'And Web Components',
      description: 'Framework-agnostic UI component library — API reference and usage guides.',
      social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/Andersseen/and-web-components' }],
      customCss: ['./src/styles/custom.css'],
      head: [
        {
          // Sets the default color palette, and mirrors Starlight's own
          // light/dark toggle (`data-theme` on <html>) onto `and-mode` so
          // <and-*> components track it too — see palettes.css, which scopes
          // its dark values under `.dark`/`[and-mode='dark']`/`[data-mode='dark']`,
          // not `data-theme`. Starlight persists <html> across client-router
          // navigations, so one observer set up here covers the whole session.
          tag: 'script',
          content: `
            (function () {
              var root = document.documentElement;
              root.setAttribute('and-color', 'indigo-rose');
              var sync = function () {
                var mode = root.getAttribute('data-theme');
                if (mode === 'dark' || mode === 'light') root.setAttribute('and-mode', mode);
              };
              sync();
              new MutationObserver(sync).observe(root, { attributeFilter: ['data-theme'] });
            })();
          `,
        },
      ],
      sidebar,
    }),
    andersseen(),
    productCoreInit(),
  ],
});

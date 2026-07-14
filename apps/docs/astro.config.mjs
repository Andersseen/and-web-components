import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import andersseen from '@andersseen/astro';

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
//   - `defineBehaviors({ observe: true })` for the Behaviors page's
//     `and-tooltip`/`and-splitter`/etc. attribute examples.
//   - a side-effect import of `@andersseen/vanilla-components`, which
//     self-registers its custom elements (`and-vanilla-button` etc.) on
//     import — see packages/vanilla-components/src/index.ts.
//   - `createButton`/`createAccordion` from `@andersseen/headless-components`
//     exposed as `window.andHeadless`, so the Headless Core page can print
//     its actual (unstyled, DOM-free) return value live.
function productCoreInit() {
  return {
    name: 'product-core-init',
    hooks: {
      'astro:config:setup': ({ injectScript }) => {
        injectScript(
          'page',
          `import { initMotion, createMotionPlayer } from '@andersseen/motion';
           import { defineBehaviors } from '@andersseen/behaviors';
           import { createButton, createAccordion } from '@andersseen/headless-components';
           import '@andersseen/vanilla-components';
           window.andMotion = { createMotionPlayer };
           window.andHeadless = { createButton, createAccordion };
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
      sidebar: [
        {
          label: 'Guides',
          items: [{ label: 'Getting Started', slug: 'guides/getting-started' }],
        },
        {
          label: 'Components',
          items: [
            { label: 'Accordion', slug: 'components/accordion' },
            { label: 'Alert', slug: 'components/alert' },
            { label: 'Badge', slug: 'components/badge' },
            { label: 'Breadcrumb', slug: 'components/breadcrumb' },
            { label: 'Button', slug: 'components/button' },
            { label: 'Card', slug: 'components/card' },
            { label: 'Carousel', slug: 'components/carousel' },
            { label: 'Code', slug: 'components/code' },
            { label: 'Context Menu', slug: 'components/context-menu' },
            { label: 'Control', slug: 'components/control' },
            { label: 'Drawer', slug: 'components/drawer' },
            { label: 'Dropdown', slug: 'components/dropdown' },
            { label: 'Icon', slug: 'components/icon' },
            { label: 'Input', slug: 'components/input' },
            { label: 'Menu List', slug: 'components/menu-list' },
            { label: 'Modal', slug: 'components/modal' },
            { label: 'Navbar', slug: 'components/navbar' },
            { label: 'Pagination', slug: 'components/pagination' },
            { label: 'Select', slug: 'components/select' },
            { label: 'Sidebar', slug: 'components/sidebar' },
            { label: 'Skeleton', slug: 'components/skeleton' },
            { label: 'Tabs', slug: 'components/tabs' },
            { label: 'Toast', slug: 'components/toast' },
            { label: 'Tooltip', slug: 'components/tooltip' },
          ],
        },
        {
          // Foundation tier (see root README's "Package Roles"): pure state
          // machines/a11y logic, zero DOM, powers both web-components and
          // vanilla-components internally.
          label: 'Headless Core',
          items: [{ label: 'Overview', slug: 'headless/overview' }],
        },
        {
          // Everything below is "product core" (root README) — usable
          // standalone, without web-components — each gets its own
          // top-level group rather than nesting under Components.
          label: 'Motion',
          items: [
            { label: 'Overview', slug: 'motion/overview' },
            { label: 'Imperative Player', slug: 'motion/imperative-player' },
            { label: 'Recipes', slug: 'motion/recipes' },
          ],
        },
        {
          label: 'Icon',
          items: [{ label: 'Overview', slug: 'icon/overview' }],
        },
        {
          label: 'Layout',
          items: [
            { label: 'Overview', slug: 'layout/overview' },
            { label: 'Recipes', slug: 'layout/recipes' },
          ],
        },
        {
          label: 'Behaviors',
          items: [{ label: 'Overview', slug: 'behaviors/overview' }],
        },
        {
          label: 'Vanilla Components',
          items: [{ label: 'Overview', slug: 'vanilla/overview' }],
        },
        {
          // Framework adapters (root README tier): thin, mostly-generated
          // wrappers around web-components, grouped together the same way
          // the README groups them.
          label: 'Framework Adapters',
          items: [
            { label: 'Astro', slug: 'framework-adapters/astro' },
            { label: 'Angular', slug: 'framework-adapters/angular' },
            { label: 'React', slug: 'framework-adapters/react' },
            { label: 'Vue', slug: 'framework-adapters/vue' },
          ],
        },
      ],
    }),
    andersseen(),
    productCoreInit(),
  ],
});

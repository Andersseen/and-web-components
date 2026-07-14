import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import andersseen from '@andersseen/astro';

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
            { label: 'Button', slug: 'components/button' },
            { label: 'Alert', slug: 'components/alert' },
            { label: 'Badge', slug: 'components/badge' },
          ],
        },
      ],
    }),
    andersseen(),
  ],
});

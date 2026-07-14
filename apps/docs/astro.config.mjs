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
          // Design tokens (colors, spacing) are scoped under `[and-color]`/`[and-theme]`
          // attribute selectors, not bare `:root` — see packages/web-components/src/global/palettes.css.
          // Set a default palette before first paint so <and-*> components aren't unstyled black.
          tag: 'script',
          content: "document.documentElement.setAttribute('and-color', 'indigo-rose');",
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

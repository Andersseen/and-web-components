import { Config } from '@stencil/core';
import { angularOutputTarget } from '@stencil/angular-output-target';
import { reactOutputTarget } from '@stencil/react-output-target';
import { vueOutputTarget } from '@stencil/vue-output-target';

import { postcss } from '@stencil-community/postcss';
import autoprefixer from 'autoprefixer';
import tailwindcss from 'tailwindcss';

const isDev = process.argv.includes('--dev') || process.argv.includes('--watch');

export const config: Config = {
  namespace: 'web-components',
  globalStyle: 'src/global/document.css',
  sourceMap: isDev,
  buildEs5: false,
  allowInlineScripts: false,
  // Bundle components to reduce duplication and improve loading
  bundles: [
    { components: ['and-button', 'and-badge'] },
    { components: ['and-accordion', 'and-accordion-item', 'and-accordion-trigger', 'and-accordion-content'] },
    {
      components: [
        'and-card',
        'and-card-content',
        'and-card-description',
        'and-card-footer',
        'and-card-header',
        'and-card-title',
      ],
    },
    { components: ['and-tabs', 'and-tabs-list', 'and-tabs-trigger', 'and-tabs-content'] },
    { components: ['and-modal', 'and-drawer'] },
    { components: ['and-dropdown', 'and-select', 'and-context-menu'] },
    { components: ['and-navbar', 'and-sidebar'] },
    { components: ['and-carousel', 'and-carousel-item'] },
    { components: ['and-toast', 'and-tooltip', 'and-alert'] },
    { components: ['and-breadcrumb', 'and-breadcrumb-item'] },
    { components: ['and-menu-list', 'and-menu-item'] },
    { components: ['and-pagination'] },
    { components: ['and-input'] },
    { components: ['and-switch'] },
    { components: ['and-icon'] },
    { components: ['and-code'] },
    { components: ['and-control'] },
  ],
  extras: {
    enableImportInjection: false,
  },
  outputTargets: [
    {
      type: 'dist',
      esmLoaderPath: '../loader',
    },
    {
      type: 'dist-custom-elements',
      customElementsExportBehavior: 'auto-define-custom-elements',
      externalRuntime: false,
    },
    {
      type: 'docs-readme',
    },
    {
      type: 'docs-custom-elements-manifest',
      file: 'custom-elements.json',
    },
    angularOutputTarget({
      componentCorePackage: '@andersseen/web-components',
      outputType: 'standalone',
      directivesProxyFile: '../../packages/angular-components/src/lib/stencil-generated/components.ts',
      directivesArrayFile: '../../packages/angular-components/src/lib/stencil-generated/index.ts',
    }),
    reactOutputTarget({
      outDir: '../../packages/react-components/src/components/stencil-generated',
      esModules: true,
    }),
    vueOutputTarget({
      componentCorePackage: '@andersseen/web-components',
      proxiesFile: '../../packages/vue-components/src/components/stencil-generated/index.ts',
      includeImportCustomElements: true,
      esModules: true,
    }),
  ],
  plugins: [
    postcss({
      plugins: [tailwindcss('./tailwind.config.js'), autoprefixer()],
    }),
  ],
};

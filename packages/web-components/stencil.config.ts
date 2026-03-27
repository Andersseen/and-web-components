import { Config } from '@stencil/core';
import { angularOutputTarget } from '@stencil/angular-output-target';

import { postcss } from '@stencil-community/postcss';
import autoprefixer from 'autoprefixer';
import tailwindcss from 'tailwindcss';

const isDev = process.argv.includes('--dev') || process.argv.includes('--watch');

export const config: Config = {
  namespace: 'web-components',
  globalStyle: 'src/global/global.css',
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
    { components: ['and-icon'] },
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
      directivesProxyFile:
        '../../apps/angular-workspace/projects/angular-components/src/lib/stencil-generated/components.ts',
      directivesArrayFile:
        '../../apps/angular-workspace/projects/angular-components/src/lib/stencil-generated/index.ts',
    }),
  ],
  plugins: [
    postcss({
      plugins: [tailwindcss('./tailwind.config.js'), autoprefixer()],
    }),
  ],
  testing: {
    browserHeadless: 'shell',
    moduleNameMapper: {
      '^@andersseen/icon$': '<rootDir>/../icon-library/dist-cjs/index.js',
    },
  },
};

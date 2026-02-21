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
      type: 'www',
      serviceWorker: null,
    },
    angularOutputTarget({
      componentCorePackage: '@andersseen/web-components',
      outputType: 'standalone',
      directivesProxyFile: '../../apps/angular-workspace/projects/angular-components/src/lib/stencil-generated/components.ts',
      directivesArrayFile: '../../apps/angular-workspace/projects/angular-components/src/lib/stencil-generated/index.ts',
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
      '^@andersseen/icon$': '<rootDir>/../icon-library/dist/index.js',
    },
  },
};

import { Config } from '@stencil/core';
import { angularOutputTarget } from '@stencil/angular-output-target';

import { postcss } from '@stencil-community/postcss';
import autoprefixer from 'autoprefixer';
import tailwindcss from 'tailwindcss';

export const config: Config = {
  namespace: 'stencil-library',
  globalStyle: 'src/global/global.css',
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
      componentCorePackage: 'stencil-library',
      outputType: 'standalone',
      directivesProxyFile: '../angular-workspace/projects/angular-components/src/lib/stencil-generated/components.ts',
      directivesArrayFile: '../angular-workspace/projects/angular-components/src/lib/stencil-generated/index.ts',
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
      '^@andersseen/icon-library$': '<rootDir>/../icon-library/dist/index.js',
    },
  },
};

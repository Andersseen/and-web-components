import { defineVitestConfig } from '@stencil/vitest/config';
import { stencilVitestPlugin } from '@stencil/vitest/plugin';
import path from 'path';

export default defineVitestConfig({
  stencilConfig: './stencil.config.ts',
  test: {
    projects: [
      {
        plugins: [stencilVitestPlugin()],
        test: {
          name: 'spec',
          include: ['src/**/*.spec.{ts,tsx}'],
          environment: 'stencil',
        },
        resolve: {
          alias: {
            '@andersseen/icon': path.resolve(__dirname, '../icon-library/dist/index.js'),
          },
        },
      },
      {
        test: {
          name: 'integration',
          include: ['src/__tests__/**/*.test.ts'],
          environment: 'node',
        },
        resolve: {
          alias: {
            '@andersseen/icon': path.resolve(__dirname, '../icon-library/dist/index.js'),
          },
        },
      },
    ],
  },
});

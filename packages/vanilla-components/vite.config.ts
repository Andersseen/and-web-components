import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'AndersseenVanillaComponents',
      fileName: format => `index.${format === 'es' ? 'esm' : format}.js`,
      formats: ['es', 'cjs', 'umd'],
    },
    rollupOptions: {
      // External: no external dependencies in production!
      external: [],
      output: {
        // Preserve module structure for tree-shaking
        preserveModules: false,
        // CSS extracted automatically
        assetFileNames: assetInfo => {
          if (assetInfo.name === 'style.css') return 'styles/index.css';
          return assetInfo.name;
        },
      },
    },
    // Minify for production
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    // Generate source maps for debugging
    sourcemap: true,
  },
  // Resolve @ imports
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  // Dev server
  server: {
    port: 3000,
    open: true,
  },
});

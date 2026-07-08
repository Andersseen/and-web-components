import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

/**
 * ESLint Configuration for @andersseen/angular-components
 *
 * Stencil-generated wrappers are auto-generated and excluded from linting.
 */
export default [
  {
    ignores: ['dist/**', 'node_modules/**', 'src/lib/stencil-generated/**', '**/*.d.ts', '**/*.spec.ts'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      parserOptions: {
        project: './tsconfig.lib.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
      'prefer-const': 'error',
      'no-var': 'error',
      'object-shorthand': ['error', 'always'],
      'eqeqeq': ['warn', 'always'],
      'curly': ['warn', 'all'],
    },
  },
];

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

/**
 * ESLint Configuration for icon-library package
 */
export default [
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-var-requires': 'error',
      'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
      'prefer-const': 'error',
      'no-var': 'error',
      'object-shorthand': ['error', 'always'],
      'prefer-template': 'error',
      'eqeqeq': ['warn', 'always'],
      'curly': ['warn', 'all'],
    },
  },
  {
    ignores: ['dist/**', 'dist-cjs/**', 'node_modules/**', '**/*.d.ts'],
  },
];

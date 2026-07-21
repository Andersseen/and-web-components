import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

/**
 * ESLint Configuration for the @andersseen/mcp package.
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
      'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
      'prefer-const': 'error',
      'no-var': 'error',
      'object-shorthand': ['error', 'always'],
      'prefer-template': 'error',
      'eqeqeq': ['warn', 'always'],
    },
  },
  {
    ignores: ['dist/**', 'node_modules/**', '**/*.d.ts', 'src/catalog-generated.ts'],
  },
];

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

/**
 * ESLint Configuration for web-components package
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
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
      'prefer-const': 'error',
      'no-var': 'error',
      'object-shorthand': ['error', 'always'],
      'prefer-template': 'error',
      'eqeqeq': ['warn', 'always'],
      'curly': ['warn', 'all'],
      'no-constant-binary-expression': 'warn',
    },
  },
  {
    ignores: [
      'dist/**',
      'dist-cjs/**',
      'www/**',
      'loader/**',
      'collection/**',
      'node_modules/**',
      '**/*.d.ts',
      '**/*.stories.ts',
      '.storybook/**',
    ],
  },
];

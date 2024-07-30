import reactPlugin from 'eslint-plugin-react'; // https://github.com/jsx-eslint/eslint-plugin-react?tab=readme-ov-file#configuration
import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';

export default [
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    name: 'ignore-outputs',
    ignores: ['**/build/', '**/dist/', '**/node_modules/', '**/.next/'],
  },
  {
    name: 'react',
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    ...reactPlugin.configs.flat.recommended,
    languageOptions: {
      ...reactPlugin.configs.flat.recommended.languageOptions,
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    rules: {
      'react/react-in-jsx-scope': 0,
      'react/jsx-uses-react': 0,
    },
  },
  {
    name: 'ts-migration-relax',
    files: ['**/*.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
  {
    name: 'ts-unused-vars',
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          args: 'all',
          argsIgnorePattern: '^_',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          // ignoreRestSiblings: true, - if you want to ignore unused rest siblings
        },
      ],
    },
  },
];

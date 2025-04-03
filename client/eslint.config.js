import pluginJs from '@eslint/js';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import reactPlugin from 'eslint-plugin-react'; // https://github.com/jsx-eslint/eslint-plugin-react?tab=readme-ov-file#configuration
import globals from 'globals';
import tsEslint from 'typescript-eslint';

export default [
  pluginJs.configs.recommended,
  jsxA11y.flatConfigs.recommended,
  ...tsEslint.configs.strict,
  ...tsEslint.configs.stylistic,
  eslintPluginPrettierRecommended,
  {
    name: 'tailwind-migration',
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    rules: {
      'tailwindcss/no-custom-classname': 0,
    },
  },
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
      '@typescript-eslint/no-empty-interface': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
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

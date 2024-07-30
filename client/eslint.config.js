import reactPlugin from 'eslint-plugin-react'; // https://github.com/jsx-eslint/eslint-plugin-react?tab=readme-ov-file#configuration
import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';

export default [
  {
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
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    name: 'ts-migration-relax',
    files: ['**/*.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
];

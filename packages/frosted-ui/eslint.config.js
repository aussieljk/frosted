const custom = require('eslint-config-custom');
const reactHooks = require('eslint-plugin-react-hooks');

module.exports = [
  ...custom,
  {
    plugins: {
      'react-hooks': reactHooks,
    },
    languageOptions: {
      globals: {
        module: 'readonly',
      },
    },
    rules: {
      '@typescript-eslint/no-empty-interface': 'off',
      // Successor of no-empty-interface in @typescript-eslint v8; keep the
      // same opt-out this package always had.
      '@typescript-eslint/no-empty-object-type': 'off',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },
  {
    // eslint-plugin-react-hooks v7 no longer treats `_use`-prefixed functions
    // as hooks; the legacy plugin version accepted `_useWidgetStack`.
    files: ['**/widget-stack/widget-stack.tsx'],
    rules: {
      'react-hooks/rules-of-hooks': 'off',
    },
  },
  {
    // Storybook setup files were outside the old lint script (src/** only);
    // keep them lint-clean without touching their @ts-ignore comments.
    files: ['.storybook/**'],
    rules: {
      '@typescript-eslint/ban-ts-comment': 'off',
    },
  },
  {
    // Disable react-hooks/rules-of-hooks for Storybook story files
    // as using hooks in render functions is acceptable for stories
    files: ['**/*.stories.tsx', '**/*.stories.ts'],
    rules: {
      'react-hooks/rules-of-hooks': 'off',
    },
  },
];

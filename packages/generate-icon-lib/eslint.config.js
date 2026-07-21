// Port of the old standalone .eslintrc.js (root: true, env node, no rules).
// This package has "type": "module", so the config is ESM.
export default [
  {
    ignores: ['eslint.config.js', 'dist/**', 'out/**'],
  },
  {
    languageOptions: {
      ecmaVersion: 'latest',
    },
  },
];

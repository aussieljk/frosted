// Port of the old standalone .eslintrc.js (root: true, env node, no rules).
export default [
  {
    ignores: ['eslint.config.ts', 'dist/**', 'out/**'],
  },
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'commonjs',
    },
  },
];

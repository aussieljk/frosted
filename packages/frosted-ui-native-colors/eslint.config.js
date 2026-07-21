// Port of the old standalone .eslintrc.js (root: true, env node, no rules).
module.exports = [
  {
    ignores: ['eslint.config.js', 'dist/**', 'out/**'],
  },
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'commonjs',
    },
  },
];

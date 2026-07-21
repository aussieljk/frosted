const custom = require('eslint-config-custom');

module.exports = [
  {
    // Converted from the old .eslintignore (plus flat-config config files and
    // build-output dot-directories that legacy ESLint ignored by default).
    ignores: [
      '**/eslint.config.js',
      '**/dist/**',
      '**/out/**',
      'apps/nativewind/**',
      '**/.next/**',
      '**/.turbo/**',
      '**/storybook-static/**',
    ],
  },
  ...custom,
  {
    // React Native tooling relies on require() interop (metro/babel/colors).
    // This package was never covered by a lint script under the legacy setup.
    files: ['packages/frosted-ui-react-native/**'],
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
];

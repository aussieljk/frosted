const tsPlugin = require('@typescript-eslint/eslint-plugin');
const prettierConfig = require('eslint-config-prettier');
const { builtinRules } = require('eslint/use-at-your-own-risk');

// Flat-config equivalent of the old `eslint:recommended`, built from the
// installed ESLint version's own rule metadata.
const eslintRecommendedRules = {};
for (const [name, rule] of builtinRules) {
  if (rule.meta?.docs?.recommended) {
    eslintRecommendedRules[name] = 'error';
  }
}

// Flat-config port of the old shareable config:
//   extends: ['prettier', 'eslint:recommended', 'plugin:@typescript-eslint/recommended']
//   parser: '@typescript-eslint/parser'
module.exports = [
  {
    // Build outputs and config files. ESLint 10 resolves the nearest
    // eslint.config.js per linted file, so shared ignores must live here
    // (root-level ignores do not apply inside packages with their own config).
    name: 'custom/ignores',
    ignores: [
      '**/eslint.config.js',
      '**/dist/**',
      '**/out/**',
      '**/.next/**',
      '**/.turbo/**',
      '**/storybook-static/**',
    ],
  },
  {
    name: 'custom/eslint-recommended',
    linterOptions: {
      // Legacy ESLint did not report unused eslint-disable directives.
      reportUnusedDisableDirectives: 'off',
    },
    rules: eslintRecommendedRules,
  },
  // Registers @typescript-eslint plugin + parser and the recommended rules,
  // including the eslint-recommended overrides for *.ts/*.tsx files.
  ...tsPlugin.configs['flat/recommended'],
  {
    name: 'custom/legacy-parity',
    rules: {
      // Not part of eslint:recommended when this repo was on the legacy config.
      'no-useless-assignment': 'off',
      // Not part of @typescript-eslint recommended in the legacy setup.
      '@typescript-eslint/no-unused-expressions': 'off',
      // Were `warn` in the legacy @typescript-eslint recommended preset.
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
  {
    // Plain JS files (configs, build scripts) are mostly CommonJS/Node.
    // The legacy setup never surfaced these rules for them.
    name: 'custom/plain-js',
    files: ['**/*.js', '**/*.cjs', '**/*.mjs'],
    rules: {
      'no-undef': 'off',
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
  {
    name: 'custom/prettier',
    rules: prettierConfig.rules,
  },
];

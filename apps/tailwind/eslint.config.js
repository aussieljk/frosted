const custom = require('eslint-config-custom');

module.exports = [
  ...custom,
  {
    languageOptions: {
      globals: {
        module: 'readonly',
      },
    },
  },
];

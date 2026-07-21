const custom = require('eslint-config-custom');

module.exports = [
  ...custom,
  {
    ignores: ['.source/**', '.output/**', '.nitro/**', '.tanstack/**', 'src/routeTree.gen.ts'],
  },
];

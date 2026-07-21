import custom from 'eslint-config-custom';

export default [
  ...custom,
  {
    languageOptions: {
      globals: {
        module: 'readonly',
      },
    },
  },
];

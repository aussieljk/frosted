import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['./**/*.mdx', './**/*.stories.@(js|jsx|mjs|ts|tsx)', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],

  addons: ['@storybook/addon-links', '@storybook/addon-docs'],

  core: {
    disableTelemetry: true,
  },

  framework: {
    name: '@storybook/react-vite',
    options: {},
  },

  typescript: {
    // react-docgen-typescript requires the classic TS compiler API, which the
    // installed TypeScript 7 (native compiler) no longer provides.
    reactDocgen: 'react-docgen',
  },
};
export default config;

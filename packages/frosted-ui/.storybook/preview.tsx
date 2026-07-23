import type { Decorator, Preview } from '@storybook/react-vite';
import React from 'react';
import { create } from 'storybook/theming';
import { Toaster } from '../src/components/toast';
import { themePropDefs } from '../src/theme-options';
import { Theme } from '../src/theme';
import { enhanceArgTypesFromProps } from './enhance-arg-types';
import { fontBase, fontCode } from './fonts';
// Pulls in tailwind + ../styles.css + ../theme.css — the demos are written in utilities.
import './preview.css';

export const withTheme: Decorator = (Story, context) => {
  // Get values from story parameter first, else fallback to globals
  const theme = (context.parameters.theme || context.globals.theme) as 'light' | 'dark';
  const accentColor = (context.parameters.accentColor || context.globals.accentColor || 'blue') as string;
  const grayColor = (context.parameters.grayColor || context.globals.grayColor || 'gray') as string;

  // No font override here: components use --default-font-family (SF Pro via -apple-system).
  return (
    <Theme accentColor={accentColor} grayColor={grayColor} appearance={theme}>
      <Story />
      <Toaster />
      {/* <ThemePanel /> */}
    </Theme>
  );
};

const preview: Preview = {
  decorators: [withTheme],

  globalTypes: {
    theme: {
      name: 'Theme',
      description: 'Global theme for components',
      toolbar: {
        // The icon for the toolbar item
        icon: 'circlehollow',
        // Array of options
        items: [
          { value: 'light', icon: 'circlehollow', title: 'light' },
          { value: 'dark', icon: 'circle', title: 'dark' },
        ],
        // Property that specifies if the name of the item will be displayed
        showName: true,
      },
    },
    accentColor: {
      name: 'Accent',
      description: 'Theme accent color',
      toolbar: {
        icon: 'paintbrush',
        items: [...themePropDefs.accentColor.values],
        dynamicTitle: true,
      },
    },
    grayColor: {
      name: 'Gray',
      description: 'Theme gray scale',
      toolbar: {
        icon: 'contrast',
        items: [...themePropDefs.grayColor.values],
        dynamicTitle: true,
      },
    },
  },

  initialGlobals: {
    theme: 'light',
    accentColor: 'blue',
    grayColor: 'gray',
  },

  argTypesEnhancers: [enhanceArgTypesFromProps],

  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    docs: { theme: create({ base: 'light', fontBase, fontCode }) },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },

  tags: ['autodocs'],
};

export default preview;

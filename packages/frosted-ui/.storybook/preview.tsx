import type { Decorator, Preview } from '@storybook/react-vite';
import React from 'react';
import { Toaster } from '../src/components/toast';
import { themePropDefs } from '../src/theme-options';
import { Theme } from '../src/theme';
import { enhanceArgTypesFromProps } from './enhance-arg-types';
import '../styles.css';

export const withTheme: Decorator = (Story, context) => {
  // Get values from story parameter first, else fallback to globals
  const theme = (context.parameters.theme || context.globals.theme) as 'light' | 'dark';
  const accentColor = (context.parameters.accentColor || context.globals.accentColor || 'blue') as string;
  const grayColor = (context.parameters.grayColor || context.globals.grayColor || 'gray') as string;

  return (
    <>
      <style>
        {`
.frosted-ui {
  --default-font-family: Inter, sans-serif;
}
@supports (font-variation-settings: normal) {
  .frosted-ui {
    --default-font-family: InterVariable, sans-serif;
  }
}
`}
      </style>
      <Theme accentColor={accentColor} grayColor={grayColor} appearance={theme}>
        <Story />
        <Toaster />
        {/* <ThemePanel /> */}
      </Theme>
    </>
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

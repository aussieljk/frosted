import type { Meta, StoryObj } from '@storybook/react-vite';

import React from 'react';
import { HStack, hStackPropDefs } from '.';

const Box = ({ height, children }: { height: number; children: React.ReactNode }) => (
  <div
    style={{
      height,
      width: 64,
      display: 'grid',
      placeItems: 'center',
      borderRadius: 8,
      background: 'var(--accent-alpha-200)',
    }}
  >
    {children}
  </div>
);

const meta = {
  title: 'Layout/HStack',
  component: HStack,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    alignment: {
      control: 'select',
      options: hStackPropDefs.alignment.values,
    },
    spacing: { control: 'number' },
  },
  tags: ['!autodocs'],
} satisfies Meta<typeof HStack>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    alignment: hStackPropDefs.alignment.default,
    spacing: 8,
    children: (
      <>
        <Box height={40}>1</Box>
        <Box height={80}>2</Box>
        <Box height={56}>3</Box>
      </>
    ),
  },
};

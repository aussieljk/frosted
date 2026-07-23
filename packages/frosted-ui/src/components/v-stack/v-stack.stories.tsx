import type { Meta, StoryObj } from '@storybook/react-vite';

import React from 'react';
import { VStack, vStackPropDefs } from '.';

const Box = ({ width, children }: { width: number; children: React.ReactNode }) => (
  <div
    style={{
      width,
      height: 40,
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
  title: 'Layout/VStack',
  component: VStack,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    alignment: {
      control: 'select',
      options: vStackPropDefs.alignment.values,
    },
    spacing: { control: 'number' },
  },
  tags: ['!autodocs'],
} satisfies Meta<typeof VStack>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    alignment: vStackPropDefs.alignment.default,
    spacing: 8,
    children: (
      <>
        <Box width={64}>1</Box>
        <Box width={128}>2</Box>
        <Box width={96}>3</Box>
      </>
    ),
  },
};

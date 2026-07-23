import type { Meta, StoryObj } from '@storybook/react-vite';

import React from 'react';
import { ZStack, zStackPropDefs } from '..';

const meta = {
  title: 'Layout/ZStack',
  component: ZStack,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    alignment: {
      control: 'select',
      options: zStackPropDefs.alignment.values,
    },
  },
  tags: ['!autodocs'],
} satisfies Meta<typeof ZStack>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    alignment: 'bottomTrailing',
    children: (
      <>
        <div style={{ width: 160, height: 160, borderRadius: 16, background: 'var(--accent-a4)' }} />
        <div style={{ width: 96, height: 96, borderRadius: 16, background: 'var(--accent-a6)' }} />
        <div style={{ width: 40, height: 40, borderRadius: 16, background: 'var(--accent-a9)' }} />
      </>
    ),
  },
};

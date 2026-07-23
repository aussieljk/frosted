import type { Meta, StoryObj } from '@storybook/react-vite';

import React from 'react';
import { Button, HStack, Spacer } from '..';

const meta = {
  title: 'Layout/Spacer',
  component: Spacer,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    minLength: { control: 'number' },
  },
  tags: ['!autodocs'],
} satisfies Meta<typeof Spacer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    minLength: 24,
  },
  render: (args) => (
    <HStack style={{ width: 400 }}>
      <Button>Leading</Button>
      <Spacer {...args} />
      <Button>Trailing</Button>
    </HStack>
  ),
};

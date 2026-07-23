import type { Meta, StoryObj } from '@storybook/react-vite';

import React from 'react';
import { Card, Inset, Text, insetPropDefs } from '..';

const meta = {
  title: 'Layout/Inset',
  component: Inset,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    side: {
      control: 'select',
      options: insetPropDefs.side.values,
    },
    clip: {
      control: 'select',
      options: insetPropDefs.clip.values,
    },
  },
  tags: ['!autodocs'],
} satisfies Meta<typeof Inset>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    side: 'top',
    pb: 'current',
  },
  render: (args) => (
    <Card size="2" style={{ maxWidth: 280 }}>
      <Inset {...args}>
        <div style={{ height: 96, background: 'var(--accent-a4)' }} />
      </Inset>
      <Text size="2">The tinted area bleeds to the card&apos;s edges; this text keeps the normal padding.</Text>
    </Card>
  ),
};

import type { Meta, StoryObj } from '@storybook/react-vite';

import React from 'react';
import { Badge, Overlay, overlayPropDefs } from '..';

const meta = {
  title: 'Layout/Overlay',
  component: Overlay,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    alignment: {
      control: 'select',
      options: overlayPropDefs.alignment.values,
    },
  },
  tags: ['!autodocs'],
} satisfies Meta<typeof Overlay>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    alignment: 'topTrailing',
    children: (
      <>
        <div style={{ width: 160, height: 160, borderRadius: 16, background: 'var(--accent-a4)' }} />
        <Overlay.Content>
          <Badge color="red" style={{ margin: 8 }}>
            99+
          </Badge>
        </Overlay.Content>
      </>
    ),
  },
};

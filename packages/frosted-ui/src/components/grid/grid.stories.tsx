import type { Meta, StoryObj } from '@storybook/react-vite';

import React from 'react';
import { Grid, Text, gridPropDefs } from '..';

const Cell = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{
      minWidth: 48,
      padding: 8,
      display: 'grid',
      placeItems: 'center',
      borderRadius: 8,
      background: 'var(--accent-a4)',
    }}
  >
    {children}
  </div>
);

const meta = {
  title: 'Layout/Grid',
  component: Grid,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    alignment: {
      control: 'select',
      options: gridPropDefs.alignment.values,
    },
    horizontalSpacing: { control: 'number' },
    verticalSpacing: { control: 'number' },
  },
  tags: ['!autodocs'],
} satisfies Meta<typeof Grid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    alignment: gridPropDefs.alignment.default,
    horizontalSpacing: 8,
    verticalSpacing: 8,
    children: (
      <>
        <Grid.Row>
          <Cell>1</Cell>
          <Cell>2</Cell>
          <Cell>3</Cell>
        </Grid.Row>
        <Grid.Row>
          <Cell>4</Cell>
          <Cell>5</Cell>
        </Grid.Row>
        <Text size="2" color="gray">
          Spans every column
        </Text>
      </>
    ),
  },
};

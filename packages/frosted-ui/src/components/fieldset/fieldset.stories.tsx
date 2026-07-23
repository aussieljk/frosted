import type { Meta, StoryObj } from '@storybook/react-vite';

import * as React from 'react';
import { Field, Fieldset, TextField } from '../index';

const meta = {
  title: 'Forms/Fieldset',
  parameters: {
    layout: 'centered',
  },
  tags: ['!autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Default',
  render: () => (
    <Fieldset.Root style={{ width: 320 }}>
      <Fieldset.Legend>Billing Details</Fieldset.Legend>

      <Field.Root name="company">
        <Field.Label>Company</Field.Label>
        <TextField.Root>
          <TextField.Input placeholder="Acme Inc." />
        </TextField.Root>
      </Field.Root>

      <Field.Root name="taxId">
        <Field.Label>Tax ID</Field.Label>
        <TextField.Root>
          <TextField.Input placeholder="XX-XXXXXXX" />
        </TextField.Root>
        <Field.Description>Your company's tax identification number</Field.Description>
      </Field.Root>
    </Fieldset.Root>
  ),
};

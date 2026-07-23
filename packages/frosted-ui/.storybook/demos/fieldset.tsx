import React from 'react';
import { Field, Fieldset, TextField } from '@aussieljk/frosted';

export default function FieldsetDemo() {
  return (
    <Fieldset.Root className="w-80">
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
  );
}

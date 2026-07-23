import { Gallery } from '../cosmos/Gallery';
import Demo from '../demos/fieldset.demo';
import * as React from 'react';
import { Field, Fieldset, Input } from '../src/components';

function FieldsetFixture() {
  return (
    <Fieldset.Root style={{ width: 320 }}>
      <Fieldset.Legend>Billing Details</Fieldset.Legend>

      <Field.Root name="company">
        <Field.Label>Company</Field.Label>
        <Input.Root>
          <Input.Control placeholder="Acme Inc." />
        </Input.Root>
      </Field.Root>

      <Field.Root name="taxId">
        <Field.Label>Tax ID</Field.Label>
        <Input.Root>
          <Input.Control placeholder="XX-XXXXXXX" />
        </Input.Root>
        <Field.Description>Your company's tax identification number</Field.Description>
      </Field.Root>
    </Fieldset.Root>
  );
}

const examples = { Example: FieldsetFixture };

export default <Gallery examples={examples} demo={Demo} />;

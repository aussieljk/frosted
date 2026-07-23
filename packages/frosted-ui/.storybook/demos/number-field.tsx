import React from 'react';
import { NumberField } from '@aussieljk/frosted';

export default function NumberFieldDemo() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 180 }}>
      <NumberField.Root defaultValue={50} min={0} max={100}>
        <NumberField.Input />
      </NumberField.Root>

      <NumberField.Root defaultValue={5} buttonLayout="split">
        <NumberField.Slot>Qty</NumberField.Slot>
        <NumberField.Input />
      </NumberField.Root>

      <NumberField.Root defaultValue={99} buttonLayout="none">
        <NumberField.Slot>$</NumberField.Slot>
        <NumberField.Input />
      </NumberField.Root>
    </div>
  );
}

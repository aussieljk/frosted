import React from 'react';
import { RadioButtonGroup, Text } from '@aussieljk/frosted';

const plans = ['Hobby', 'Pro', 'Enterprise'];

export default function RadioButtonGroupDemo() {
  return (
    <RadioButtonGroup.Root defaultValue="Pro">
      <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
        {plans.map((plan) => (
          <RadioButtonGroup.Item key={plan} value={plan}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
                padding: '8px 16px',
                borderRadius: 8,
                border: '1px solid var(--gray-a7)',
              }}
            >
              <RadioButtonGroup.Icon />
              <Text size="2">{plan}</Text>
            </div>
          </RadioButtonGroup.Item>
        ))}
      </div>
    </RadioButtonGroup.Root>
  );
}

import React from 'react';
import { Button, HStack, Spacer } from '@aussieljk/frosted';

export default function SpacerDemo() {
  return (
    <HStack spacing={0} style={{ width: 320, padding: 8, borderRadius: 12, border: '1px dashed var(--gray-a6)' }}>
      <Button size="1" variant="soft">
        Leading
      </Button>
      <Spacer minLength={24} />
      <Button size="1" variant="soft">
        Trailing
      </Button>
    </HStack>
  );
}

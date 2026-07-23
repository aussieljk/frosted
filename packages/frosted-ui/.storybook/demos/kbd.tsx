import React from 'react';
import { Kbd, Text } from '@aussieljk/frosted';

export default function KbdDemo() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
      <Text size="3">
        Press <Kbd>⇧⌘K</Kbd> to open the command palette.
      </Text>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
        <Kbd size="1">Shift + Tab</Kbd>
        <Kbd size="3">Shift + Tab</Kbd>
        <Kbd size="5">Shift + Tab</Kbd>
      </div>
    </div>
  );
}

import React from 'react';
import { Card, Inset, Text } from '@aussieljk/frosted';

export default function InsetDemo() {
  return (
    <Card size="2" style={{ maxWidth: 280 }}>
      <Inset side="top" pb="current">
        <div style={{ height: 96, background: 'var(--accent-a4)' }} />
      </Inset>
      <Text size="2">The tinted area bleeds to the card&apos;s edges; this text keeps the normal padding.</Text>
    </Card>
  );
}

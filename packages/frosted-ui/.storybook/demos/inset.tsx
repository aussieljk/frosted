import React from 'react';
import { Card, Inset, Text } from '@aussieljk/frosted';

export default function InsetDemo() {
  return (
    <Card size="2" className="max-w-70">
      <Inset side="top" pb="current">
        <div className="h-24 bg-accent-alpha-200" />
      </Inset>
      <Text size="2">The tinted area bleeds to the card&apos;s edges; this text keeps the normal padding.</Text>
    </Card>
  );
}

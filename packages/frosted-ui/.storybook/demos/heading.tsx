import React from 'react';
import { Heading } from '@aussieljk/frosted';

export default function HeadingDemo() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
      <Heading size="3">The quick brown fox</Heading>
      <Heading size="5">The quick brown fox</Heading>
      <Heading size="7">The quick brown fox</Heading>
      <Heading size="5" weight="medium">
        Medium weight
      </Heading>
      <Heading size="5" color="indigo">
        Indigo heading
      </Heading>
    </div>
  );
}

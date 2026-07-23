import React from 'react';
import { ZStack } from '@aussieljk/frosted';

export default function ZStackDemo() {
  return (
    <ZStack alignment="bottomTrailing">
      <div style={{ width: 160, height: 160, borderRadius: 16, background: 'var(--accent-a4)' }} />
      <div style={{ width: 96, height: 96, borderRadius: 16, background: 'var(--accent-a6)' }} />
      <div style={{ width: 40, height: 40, borderRadius: 16, background: 'var(--accent-a9)' }} />
    </ZStack>
  );
}

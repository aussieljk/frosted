import React from 'react';
import { Link, Text } from '@aussieljk/frosted';

export default function LinkDemo() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
      <Text size="3">
        Read the <Link href="#">documentation</Link> to get started.
      </Text>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
        <Link href="#" underline="auto">
          Auto underline
        </Link>
        <Link href="#" underline="hover">
          Hover underline
        </Link>
        <Link href="#" underline="always">
          Always underlined
        </Link>
        <Link href="#" color="orange">
          Orange link
        </Link>
      </div>
    </div>
  );
}

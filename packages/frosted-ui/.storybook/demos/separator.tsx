import React from 'react';
import { Separator, Text } from '@aussieljk/frosted';

export default function SeparatorDemo() {
  return (
    <Text size="2">
      Tools for building high-quality, accessible UI.
      <Separator size="4" style={{ margin: 'var(--space-3) 0' }} />
      <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
        Themes
        <Separator orientation="vertical" />
        Primitives
        <Separator orientation="vertical" />
        Icons
        <Separator orientation="vertical" />
        Colors
      </div>
    </Text>
  );
}

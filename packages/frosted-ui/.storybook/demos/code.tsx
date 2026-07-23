import React from 'react';
import { Code } from '@aussieljk/frosted';

export default function CodeDemo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
      <Code variant="solid">console.log()</Code>
      <Code variant="soft">console.log()</Code>
      <Code variant="outline">console.log()</Code>
      <Code variant="ghost">console.log()</Code>
      <Code variant="soft" color="orange">
        console.log()
      </Code>
      <Code variant="soft" size="4">
        console.log()
      </Code>
    </div>
  );
}

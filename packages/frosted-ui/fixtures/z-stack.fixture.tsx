import React from 'react';
import { Gallery } from '../cosmos/Gallery';
import Demo from '../demos/z-stack.demo';
import { ZStack } from '../src/components/z-stack';

function ZStackFixture() {
  const props = { alignment: 'bottomTrailing' } as const;
  return (
    <ZStack {...props}>
      <div style={{ width: 160, height: 160, borderRadius: 16, background: 'var(--accent-alpha-200)' }} />
      <div style={{ width: 96, height: 96, borderRadius: 16, background: 'var(--accent-alpha-400)' }} />
      <div style={{ width: 40, height: 40, borderRadius: 16, background: 'var(--accent-alpha-700)' }} />
    </ZStack>
  );
}

const examples = { Example: ZStackFixture };

export default <Gallery examples={examples} demo={Demo} />;

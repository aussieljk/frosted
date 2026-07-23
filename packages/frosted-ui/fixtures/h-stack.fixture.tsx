import React from 'react';
import { Gallery } from '../cosmos/Gallery';
import Demo from '../demos/h-stack.demo';
import { HStack } from '../src/components/h-stack';

const Box = ({ height, children }: { height: number; children: React.ReactNode }) => (
  <div
    style={{
      height,
      width: 64,
      display: 'grid',
      placeItems: 'center',
      borderRadius: 8,
      background: 'var(--accent-alpha-200)',
    }}
  >
    {children}
  </div>
);

function HStackFixture() {
  const props = { spacing: 8 };
  return (
    <HStack {...props}>
      <Box height={40}>1</Box>
      <Box height={80}>2</Box>
      <Box height={56}>3</Box>
    </HStack>
  );
}

const examples = { Example: HStackFixture };

export default <Gallery examples={examples} demo={Demo} />;

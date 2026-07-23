import React from 'react';
import { Gallery } from '../cosmos/Gallery';
import Demo from '../demos/spacer.demo';
import { Button, HStack, Spacer } from '../src/components';

function SpacerFixture() {
  const args = { minLength: 24 };
  return (
    <HStack style={{ width: 400 }}>
      <Button>Leading</Button>
      <Spacer {...args} />
      <Button>Trailing</Button>
    </HStack>
  );
}

const examples = { Example: SpacerFixture };

export default <Gallery examples={examples} demo={Demo} />;

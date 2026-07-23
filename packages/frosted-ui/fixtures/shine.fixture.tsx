import React from 'react';
import { Gallery } from '../cosmos/Gallery';
import Demo from '../demos/shine.demo';
import { Shine, Typography } from '../src/components';

function ShineFixture() {
  const props = { puffyness: '2' } as const;
  return (
    <Shine {...props}>
      <Typography.Text size="9" weight="bold">
        🧸☔️ Shine! ✨👻
      </Typography.Text>
    </Shine>
  );
}

const examples = { Example: ShineFixture };

export default <Gallery examples={examples} demo={Demo} />;

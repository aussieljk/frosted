import React from 'react';
import { Gallery } from '../cosmos/Gallery';
import Demo from '../demos/em.demo';
import { Em } from '../src/components/typography/em';
import { Text } from '../src/components/typography/text';

function EmFixture() {
  const args = {
    children: 'Em',
  };
  return (
    <Text>
      We <Em {...args}>had</Em> to do something about it.
    </Text>
  );
}

const examples = { Example: EmFixture };

export default <Gallery examples={examples} demo={Demo} />;

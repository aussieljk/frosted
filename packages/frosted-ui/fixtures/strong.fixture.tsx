import React from 'react';
import { Gallery } from '../cosmos/Gallery';
import Demo from '../demos/strong.demo';
import { Strong } from '../src/components/typography/strong';
import { Text } from '../src/components/typography/text';

function StrongFixture() {
  const args = {};
  return (
    <Text>
      The most important thing to remember is, <Strong {...args}>stay positive</Strong>.
    </Text>
  );
}

const examples = { Example: StrongFixture };

export default <Gallery examples={examples} demo={Demo} />;

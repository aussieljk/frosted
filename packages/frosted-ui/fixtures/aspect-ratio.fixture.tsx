import React from 'react';
import { Gallery } from '../cosmos/Gallery';
import Demo from '../demos/aspect-ratio.demo';

import { AspectRatio, Card, HStack, Typography } from '../src/components';

const Placeholder = ({ label }: { label: string }) => (
  <HStack
    alignment="center"
    style={{ width: '100%', height: '100%', background: 'var(--gray-alpha-200)', justifyContent: 'center' }}
  >
    <Typography.Text size="2" color="gray">
      {label}
    </Typography.Text>
  </HStack>
);

const examples = {
  Default: (
    <Card style={{ width: 320 }}>
      <AspectRatio ratio={16 / 9}>
        <Placeholder label="16 / 9" />
      </AspectRatio>
    </Card>
  ),

  Square: (
    <Card style={{ width: 240 }}>
      <AspectRatio>
        <Placeholder label="1 / 1" />
      </AspectRatio>
    </Card>
  ),

  Portrait: (
    <Card style={{ width: 240 }}>
      <AspectRatio ratio={3 / 4}>
        <Placeholder label="3 / 4" />
      </AspectRatio>
    </Card>
  ),
};

export default <Gallery examples={examples} demo={Demo} />;

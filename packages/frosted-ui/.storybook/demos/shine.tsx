import React from 'react';
import { Badge, Shine, Text } from '@aussieljk/frosted';

export default function ShineDemo() {
  return (
    <div className="flex flex-col items-center gap-4">
      <Shine puffyness="2">
        <Text size="9" weight="bold">
          Shine ✨
        </Text>
      </Shine>
      <Shine puffyness="1">
        <Badge size="2" color="yellow">
          Premium
        </Badge>
      </Shine>
    </div>
  );
}

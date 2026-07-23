import React from 'react';
import { Text } from '@aussieljk/frosted';

export default function TextDemo() {
  return (
    <div className="flex flex-col gap-2">
      <Text size="1">The quick brown fox jumps over the lazy dog.</Text>
      <Text size="2">The quick brown fox jumps over the lazy dog.</Text>
      <Text size="3">The quick brown fox jumps over the lazy dog.</Text>
      <Text size="4">The quick brown fox jumps over the lazy dog.</Text>
      <Text size="3" weight="medium">
        Medium weight
      </Text>
      <Text size="3" weight="bold">
        Bold weight
      </Text>
      <Text size="3" color="indigo">
        Indigo text
      </Text>
    </div>
  );
}

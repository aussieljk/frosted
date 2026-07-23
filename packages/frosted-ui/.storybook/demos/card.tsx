import React from 'react';
import { Avatar, Card, Text } from '@aussieljk/frosted';

export default function CardDemo() {
  return (
    <Card size="2" variant="surface" style={{ maxWidth: 320 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Avatar size="3" fallback="AF" color="blue" />
        <div>
          <Text render={<div />} size="2" weight="bold">
            @aussieljk/frosted
          </Text>
          <Text render={<div />} size="2" color="gray">
            A design system for building products
          </Text>
        </div>
      </div>
    </Card>
  );
}

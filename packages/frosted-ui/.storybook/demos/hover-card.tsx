import React from 'react';
import { Avatar, Heading, HoverCard, Link, Text } from '@aussieljk/frosted';

export default function HoverCardDemo() {
  return (
    <Text>
      Follow{' '}
      <HoverCard.Root>
        <HoverCard.Trigger>
          <Link href="https://github.com/aussieljk/frosted" target="_blank">
            frosted
          </Link>
        </HoverCard.Trigger>
        <HoverCard.Content>
          <div style={{ display: 'flex', gap: 16 }}>
            <Avatar size="3" fallback="FUI" />
            <div>
              <Heading size="3">Frosted UI</Heading>
              <Text render={<div />} size="2" color="gray">
                frosted-ui
              </Text>
              <Text render={<div />} size="2" style={{ maxWidth: 300, marginTop: 12 }}>
                React components library built on top of Base UI primitives.
              </Text>
            </div>
          </div>
        </HoverCard.Content>
      </HoverCard.Root>{' '}
      for updates.
    </Text>
  );
}

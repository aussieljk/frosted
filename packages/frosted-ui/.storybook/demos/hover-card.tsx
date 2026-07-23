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
          <div className="flex gap-4">
            <Avatar size="3" fallback="AF" />
            <div>
              <Heading size="3">@aussieljk/frosted</Heading>
              <Text render={<div />} size="2" color="gray">
                aussieljk
              </Text>
              <Text render={<div />} size="2" className="mt-3 max-w-75">
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

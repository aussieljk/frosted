import React from 'react';
import { Avatar, Badge, Button, Card, Heading, HStack, Spacer, Text, VStack, ZStack } from '@aussieljk/frosted';

export default function LayoutDemo() {
  return (
    <Card size="3" className="w-85">
      <VStack spacing={16} alignment="leading">
        <HStack spacing={8} className="w-full">
          <Heading size="4">Members</Heading>
          <Spacer />
          <Button size="1" variant="soft">
            Invite
          </Button>
        </HStack>

        <HStack spacing={12}>
          <ZStack alignment="bottomTrailing">
            <Avatar size="4" fallback="LK" color="indigo" />
            <Badge color="green" variant="solid" size="1">
              on
            </Badge>
          </ZStack>
          <VStack spacing={2} alignment="leading">
            <Text size="2" weight="bold">
              Lucas Knight
            </Text>
            <Text size="1" color="gray">
              Online now
            </Text>
          </VStack>
        </HStack>
      </VStack>
    </Card>
  );
}

import React from 'react';
import { Button, EmptyState, IconProvider, Icons } from '@aussieljk/frosted';
import { lucideAdapter } from '@aussieljk/frosted/icons/lucide';

export default function EmptyStateDemo() {
  return (
    <IconProvider library={lucideAdapter}>
      <EmptyState.Root>
        <EmptyState.Header>
          <EmptyState.Media>
            <Icons.Inbox />
          </EmptyState.Media>
          <EmptyState.Title>No messages yet</EmptyState.Title>
          <EmptyState.Description>When someone sends you a message, it will show up here.</EmptyState.Description>
        </EmptyState.Header>
        <EmptyState.Actions>
          <Button variant="classic">Compose message</Button>
        </EmptyState.Actions>
      </EmptyState.Root>
    </IconProvider>
  );
}

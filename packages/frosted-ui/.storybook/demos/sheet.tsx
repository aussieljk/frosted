import React from 'react';
import { Button, Sheet, Text, TextField } from '@aussieljk/frosted';

export default function SheetDemo() {
  return (
    <Sheet.Root>
      <Sheet.Trigger>
        <Button>Edit profile</Button>
      </Sheet.Trigger>

      <Sheet.Content>
        <Sheet.Header>
          <Sheet.Title>Edit profile</Sheet.Title>
          <Sheet.Description>Make changes to your profile.</Sheet.Description>
        </Sheet.Header>
        <Sheet.Body>
          <label>
            <Text render={<div />} size="2" weight="bold" style={{ marginBottom: 4 }}>
              Name
            </Text>
            <TextField.Input defaultValue="Freja Johnsen" placeholder="Enter your full name" />
          </label>

          <div style={{ display: 'flex', gap: 12, marginTop: 16, justifyContent: 'flex-end' }}>
            <Sheet.Close>
              <Button variant="soft" color="gray">
                Cancel
              </Button>
            </Sheet.Close>
            <Sheet.Close>
              <Button>Save</Button>
            </Sheet.Close>
          </div>
        </Sheet.Body>
      </Sheet.Content>
    </Sheet.Root>
  );
}

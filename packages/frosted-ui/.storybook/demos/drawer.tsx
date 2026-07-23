import React from 'react';
import { Button, Drawer, Text, TextField } from '@aussieljk/frosted';

export default function DrawerDemo() {
  return (
    <Drawer.Root>
      <Drawer.Trigger>
        <Button>Edit profile</Button>
      </Drawer.Trigger>

      <Drawer.Content>
        <Drawer.Header>
          <Drawer.Title>Edit profile</Drawer.Title>
        </Drawer.Header>
        <Drawer.Body>
          <Text render={<p />} size="2" style={{ marginBottom: 16 }}>
            Make changes to your profile, then save.
          </Text>

          <label>
            <Text render={<div />} size="2" weight="bold" style={{ marginBottom: 4 }}>
              Name
            </Text>
            <TextField.Input defaultValue="Freja Johnsen" placeholder="Enter your full name" />
          </label>

          <div style={{ display: 'flex', gap: 12, marginTop: 16, justifyContent: 'flex-end' }}>
            <Drawer.Close>
              <Button variant="soft" color="gray">
                Cancel
              </Button>
            </Drawer.Close>
            <Drawer.Close>
              <Button>Save</Button>
            </Drawer.Close>
          </div>
        </Drawer.Body>
      </Drawer.Content>
    </Drawer.Root>
  );
}

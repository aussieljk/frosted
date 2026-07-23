import React from 'react';
import { Button, Dialog, Text, TextField } from '@aussieljk/frosted';

export default function DialogDemo() {
  return (
    <Dialog.Root>
      <Dialog.Trigger nativeButton>
        <Button>Edit profile</Button>
      </Dialog.Trigger>

      <Dialog.Content className="max-w-[450px]">
        <Dialog.Title>Edit profile</Dialog.Title>
        <Dialog.Description>Make changes to your profile.</Dialog.Description>

        <label>
          <Text render={<div />} size="2" weight="bold" className="mb-1">
            Name
          </Text>
          <TextField.Root>
            <TextField.Input defaultValue="Freja Johnsen" placeholder="Enter your full name" />
          </TextField.Root>
        </label>

        <div className="mt-4 flex justify-end gap-3">
          <Dialog.Close>
            <Button variant="soft" color="gray">
              Cancel
            </Button>
          </Dialog.Close>
          <Dialog.Close>
            <Button>Save</Button>
          </Dialog.Close>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  );
}

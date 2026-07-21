import { Button, Dialog, Text, TextField } from '@aussieljk/frosted';

export default function DialogDemo() {
  return (
    <Dialog.Root>
      <Dialog.Trigger nativeButton>
        <Button>Edit profile</Button>
      </Dialog.Trigger>

      <Dialog.Content style={{ maxWidth: 450 }}>
        <Dialog.Title>Edit profile</Dialog.Title>
        <Dialog.Description>Make changes to your profile.</Dialog.Description>

        <label>
          <Text render={<div />} size="2" weight="bold" style={{ marginBottom: 4 }}>
            Name
          </Text>
          <TextField.Root>
            <TextField.Input defaultValue="Freja Johnsen" placeholder="Enter your full name" />
          </TextField.Root>
        </label>

        <div style={{ display: 'flex', gap: 12, marginTop: 16, justifyContent: 'flex-end' }}>
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

import React from 'react';
import { SegmentedControl, Text } from '@aussieljk/frosted';

export default function SegmentedControlDemo() {
  return (
    <SegmentedControl.Root defaultValue="account">
      <SegmentedControl.List>
        <SegmentedControl.Trigger value="account">Account</SegmentedControl.Trigger>
        <SegmentedControl.Trigger value="documents">Documents</SegmentedControl.Trigger>
        <SegmentedControl.Trigger value="settings">Settings</SegmentedControl.Trigger>
      </SegmentedControl.List>

      <SegmentedControl.Content value="account" className="px-1 py-3">
        <Text size="2">Make changes to your account.</Text>
      </SegmentedControl.Content>
      <SegmentedControl.Content value="documents" className="px-1 py-3">
        <Text size="2">Access and update your documents.</Text>
      </SegmentedControl.Content>
      <SegmentedControl.Content value="settings" className="px-1 py-3">
        <Text size="2">Edit your profile and preferences.</Text>
      </SegmentedControl.Content>
    </SegmentedControl.Root>
  );
}

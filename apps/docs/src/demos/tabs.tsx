import { Tabs, Text } from '@aussieljk/frosted';

export default function TabsDemo() {
  return (
    <Tabs.Root defaultValue="account" style={{ width: '100%', maxWidth: 400 }}>
      <Tabs.List>
        <Tabs.Trigger value="account">Account</Tabs.Trigger>
        <Tabs.Trigger value="documents">Documents</Tabs.Trigger>
        <Tabs.Trigger value="settings">Settings</Tabs.Trigger>
      </Tabs.List>

      <Tabs.Content value="account" style={{ padding: '12px 4px' }}>
        <Text size="2">Make changes to your account.</Text>
      </Tabs.Content>
      <Tabs.Content value="documents" style={{ padding: '12px 4px' }}>
        <Text size="2">Access and update your documents.</Text>
      </Tabs.Content>
      <Tabs.Content value="settings" style={{ padding: '12px 4px' }}>
        <Text size="2">Edit your profile and preferences.</Text>
      </Tabs.Content>
    </Tabs.Root>
  );
}

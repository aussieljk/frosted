import { Switch, Text } from '@aussieljk/frosted';

export default function SwitchDemo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
      <Switch size="1" defaultChecked />
      <Switch size="2" defaultChecked />
      <Switch size="3" defaultChecked />
      <Text render={<label />} size="2" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Switch color="orange" defaultChecked />
        Notifications
      </Text>
    </div>
  );
}

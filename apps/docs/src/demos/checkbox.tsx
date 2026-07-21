import { Checkbox, Text } from '@aussieljk/frosted';

export default function CheckboxDemo() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <Text render={<label />} size="2" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Checkbox defaultChecked />
        Agree to terms and conditions
      </Text>
      <Text render={<label />} size="2" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Checkbox color="green" defaultChecked />
        Subscribe to the newsletter
      </Text>
      <Text render={<label />} size="2" color="gray" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Checkbox disabled />
        Disabled option
      </Text>
    </div>
  );
}

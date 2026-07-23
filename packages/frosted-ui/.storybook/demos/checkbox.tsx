import React from 'react';
import { Checkbox, Text } from '@aussieljk/frosted';

export default function CheckboxDemo() {
  return (
    <div className="flex flex-col gap-2">
      <Text render={<label />} size="2" className="flex items-center gap-2">
        <Checkbox defaultChecked />
        Agree to terms and conditions
      </Text>
      <Text render={<label />} size="2" className="flex items-center gap-2">
        <Checkbox color="green" defaultChecked />
        Subscribe to the newsletter
      </Text>
      <Text render={<label />} size="2" color="gray" className="flex items-center gap-2">
        <Checkbox disabled />
        Disabled option
      </Text>
    </div>
  );
}

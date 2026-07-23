import React from 'react';
import { ToggleGroupNav } from '@aussieljk/frosted';

export default function ToggleGroupNavDemo() {
  return (
    <ToggleGroupNav.Root>
      <ToggleGroupNav.Link active href="#">
        Account
      </ToggleGroupNav.Link>
      <ToggleGroupNav.Link href="#">Documents</ToggleGroupNav.Link>
      <ToggleGroupNav.Link href="#">Settings</ToggleGroupNav.Link>
    </ToggleGroupNav.Root>
  );
}

import React from 'react';
import { TabsNav } from '@aussieljk/frosted';

export default function TabsNavDemo() {
  return (
    <TabsNav.Root className="w-full max-w-100">
      <TabsNav.Link active href="#">
        Account
      </TabsNav.Link>
      <TabsNav.Link href="#">Documents</TabsNav.Link>
      <TabsNav.Link href="#">Settings</TabsNav.Link>
    </TabsNav.Root>
  );
}

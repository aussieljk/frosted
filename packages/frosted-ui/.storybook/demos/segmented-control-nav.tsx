import React from 'react';
import { SegmentedControlNav } from '@aussieljk/frosted';

export default function SegmentedControlNavDemo() {
  return (
    <SegmentedControlNav.Root>
      <SegmentedControlNav.Link active href="#">
        Account
      </SegmentedControlNav.Link>
      <SegmentedControlNav.Link href="#">Documents</SegmentedControlNav.Link>
      <SegmentedControlNav.Link href="#">Settings</SegmentedControlNav.Link>
    </SegmentedControlNav.Root>
  );
}

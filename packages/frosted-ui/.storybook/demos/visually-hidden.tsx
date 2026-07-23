import React from 'react';
import { IconButton, IconProvider, Icons, Text, VisuallyHidden } from '@aussieljk/frosted';
import { lucideAdapter } from '@aussieljk/frosted/icons/lucide';

export default function VisuallyHiddenDemo() {
  return (
    <IconProvider library={lucideAdapter}>
      <div className="flex items-center gap-3">
        <IconButton variant="soft">
          <VisuallyHidden>Settings</VisuallyHidden>
          <Icons.Settings />
        </IconButton>
        <Text size="2" color="gray">
          Screen readers announce this button as &quot;Settings&quot;.
        </Text>
      </div>
    </IconProvider>
  );
}

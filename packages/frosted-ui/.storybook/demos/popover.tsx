import React from 'react';
import { Avatar, Button, Checkbox, Popover, TextArea } from '@aussieljk/frosted';

export default function PopoverDemo() {
  return (
    <Popover.Root>
      <Popover.Trigger>
        <Button variant="soft">Comment</Button>
      </Popover.Trigger>
      <Popover.Content style={{ width: 360 }}>
        <div style={{ display: 'flex', gap: 12 }}>
          <Avatar size="2" fallback="A" />
          <div style={{ flexGrow: 1 }}>
            <TextArea placeholder="Write a comment…" style={{ height: 80 }} />
            <div
              style={{
                display: 'flex',
                gap: 12,
                marginTop: 12,
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Checkbox size="2">Send to group</Checkbox>
              <Popover.Close>
                <Button size="1">Comment</Button>
              </Popover.Close>
            </div>
          </div>
        </div>
      </Popover.Content>
    </Popover.Root>
  );
}

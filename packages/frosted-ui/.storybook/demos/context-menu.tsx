import React from 'react';
import { ContextMenu } from '@aussieljk/frosted';

export default function ContextMenuDemo() {
  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger>
        <div
          style={{
            background: 'var(--gray-a2)',
            borderRadius: 'var(--radius-3)',
            width: 200,
            height: 150,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          Right-click here
        </div>
      </ContextMenu.Trigger>
      <ContextMenu.Content>
        <ContextMenu.Item shortcut="⌘ E">Edit</ContextMenu.Item>
        <ContextMenu.Item shortcut="⌘ D">Duplicate</ContextMenu.Item>
        <ContextMenu.Separator />
        <ContextMenu.Item shortcut="⌘ N">Archive</ContextMenu.Item>
        <ContextMenu.Separator />
        <ContextMenu.Item shortcut="⌘ ⌫" color="danger">
          Delete
        </ContextMenu.Item>
      </ContextMenu.Content>
    </ContextMenu.Root>
  );
}

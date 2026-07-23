import React from 'react';
import { Badge, Overlay } from '@aussieljk/frosted';

export default function OverlayDemo() {
  return (
    <Overlay alignment="topTrailing">
      <div style={{ width: 160, height: 160, borderRadius: 16, background: 'var(--accent-a4)' }} />
      <Overlay.Content>
        <Badge color="red" variant="solid" style={{ margin: 8 }}>
          99+
        </Badge>
      </Overlay.Content>
    </Overlay>
  );
}

import React from 'react';
import { Badge, Overlay } from '@aussieljk/frosted';

export default function OverlayDemo() {
  return (
    <Overlay alignment="topTrailing">
      <div className="size-40 rounded-2xl bg-accent-alpha-200" />
      <Overlay.Content>
        <Badge color="red" variant="solid" className="m-2">
          99+
        </Badge>
      </Overlay.Content>
    </Overlay>
  );
}

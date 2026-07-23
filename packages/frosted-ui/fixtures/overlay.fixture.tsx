import React from 'react';
import { Gallery } from '../cosmos/Gallery';
import Demo from '../demos/overlay.demo';
import { Badge, Overlay } from '../src/components';

function OverlayFixture() {
  const props = { alignment: 'topTrailing' } as const;
  return (
    <Overlay.Root {...props}>
      <div style={{ width: 160, height: 160, borderRadius: 16, background: 'var(--accent-alpha-200)' }} />
      <Overlay.Root.Content>
        <Badge color="red" style={{ margin: 8 }}>
          99+
        </Badge>
      </Overlay.Root.Content>
    </Overlay.Root>
  );
}

const examples = { Example: OverlayFixture };

export default <Gallery examples={examples} demo={Demo} />;

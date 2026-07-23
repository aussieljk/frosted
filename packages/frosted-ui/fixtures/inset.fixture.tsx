import React from 'react';
import { Gallery } from '../cosmos/Gallery';
import Demo from '../demos/inset.demo';
import { Card, Inset, Typography } from '../src/components';

function InsetFixture() {
  const props = { side: 'top', pb: 'current' } as const;
  return (
    <Card size="2" style={{ maxWidth: 280 }}>
      <Inset {...props}>
        <div style={{ height: 96, background: 'var(--accent-alpha-200)' }} />
      </Inset>
      <Typography.Text size="2">
        The tinted area bleeds to the card&apos;s edges; this text keeps the normal padding.
      </Typography.Text>
    </Card>
  );
}

const examples = { Example: InsetFixture };

export default <Gallery examples={examples} demo={Demo} />;

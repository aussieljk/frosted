import React from 'react';
import { Spinner, Switch } from '@aussieljk/frosted';

export default function SpinnerDemo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
      <Spinner size="1" />
      <Spinner size="3" />
      <Spinner size="5" />
      {/* `loading` swaps children for a spinner while preserving their dimensions */}
      <Spinner loading>
        <Switch defaultChecked />
      </Spinner>
    </div>
  );
}

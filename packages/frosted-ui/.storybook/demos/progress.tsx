import React from 'react';
import { Progress } from '@aussieljk/frosted';

export default function ProgressDemo() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 280 }}>
      <Progress value={25} size="1" aria-label="25% complete" />
      <Progress value={60} size="2" aria-label="60% complete" />
      <Progress value={85} size="3" color="green" aria-label="85% complete" />
    </div>
  );
}

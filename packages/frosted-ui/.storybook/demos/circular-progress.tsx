import React from 'react';
import { CircularProgress } from '@aussieljk/frosted';

export default function CircularProgressDemo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <CircularProgress value={25} size="3" aria-label="25% complete" />
      <CircularProgress value={60} size="5" aria-label="60% complete" />
      <CircularProgress value={85} size="7" color="green" aria-label="85% complete" />
      <CircularProgress value={100} size="7" color="green" aria-label="Complete" />
    </div>
  );
}

import React from 'react';
import { Slider } from '@aussieljk/frosted';

export default function SliderDemo() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', width: 300 }}>
      <Slider defaultValue={[50]} />
      <Slider defaultValue={[30]} size="1" color="orange" />
      <Slider defaultValue={[25, 75]} color="cyan" />
      <Slider defaultValue={[60]} disabled />
    </div>
  );
}

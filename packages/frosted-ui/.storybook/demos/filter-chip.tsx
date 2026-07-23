import React from 'react';
import { FilterChip } from '@aussieljk/frosted';

export default function FilterChipDemo() {
  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      <FilterChip defaultChecked>In stock</FilterChip>
      <FilterChip>On sale</FilterChip>
      <FilterChip defaultChecked color="orange">
        Free shipping
      </FilterChip>
      <FilterChip disabled>Disabled</FilterChip>
    </div>
  );
}

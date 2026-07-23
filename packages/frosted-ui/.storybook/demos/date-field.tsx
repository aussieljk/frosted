import React from 'react';
import { DateField } from '@aussieljk/frosted';
import { parseDate } from '@internationalized/date';

export default function DateFieldDemo() {
  return (
    <div style={{ width: 300 }}>
      <DateField aria-label="Birth date" defaultValue={parseDate('2020-02-03')} />
    </div>
  );
}

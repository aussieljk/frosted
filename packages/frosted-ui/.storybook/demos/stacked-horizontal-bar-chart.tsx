import React from 'react';
import { StackedHorizontalBarChart } from '@aussieljk/frosted';

export default function StackedHorizontalBarChartDemo() {
  return (
    <div className="w-80">
      <StackedHorizontalBarChart
        data={[
          { label: 'Completed', value: 60, color: 'green' },
          { label: 'In progress', value: 25, color: 'blue' },
          { label: 'Failed', value: 15, color: 'red' },
        ]}
      />
    </div>
  );
}

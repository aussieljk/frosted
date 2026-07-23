import React from 'react';
import { SegmentedControlRadioGroup, Text } from '@aussieljk/frosted';

export default function SegmentedControlRadioGroupDemo() {
  const [view, setView] = React.useState('day');

  return (
    <div className="flex flex-col items-center gap-3">
      <SegmentedControlRadioGroup.Root value={view} onValueChange={setView}>
        <SegmentedControlRadioGroup.Item value="day">Day</SegmentedControlRadioGroup.Item>
        <SegmentedControlRadioGroup.Item value="week">Week</SegmentedControlRadioGroup.Item>
        <SegmentedControlRadioGroup.Item value="month">Month</SegmentedControlRadioGroup.Item>
      </SegmentedControlRadioGroup.Root>
      <Text size="2" color="gray">
        Selected view: {view}
      </Text>
    </div>
  );
}

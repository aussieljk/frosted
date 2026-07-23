import React from 'react';
import { TextArea } from '@aussieljk/frosted';

export default function TextAreaDemo() {
  return (
    <div className="flex w-75 flex-col gap-3">
      <TextArea placeholder="Reply to comment…" />
      <TextArea variant="soft" placeholder="Soft variant" />
      <TextArea variant="soft" color="blue" size="3" placeholder="Blue, size 3" />
      <TextArea disabled placeholder="Disabled" />
    </div>
  );
}

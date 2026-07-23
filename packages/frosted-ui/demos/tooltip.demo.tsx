import React from 'react';
import { Button, Tooltip } from '@aussieljk/frosted';

export default function TooltipDemo() {
  return (
    <Tooltip content="This appears on hover">
      <Button variant="surface">Hover me</Button>
    </Tooltip>
  );
}

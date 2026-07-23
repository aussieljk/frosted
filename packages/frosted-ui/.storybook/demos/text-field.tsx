import React from 'react';
import { TextField } from '@aussieljk/frosted';

export default function TextFieldDemo() {
  return (
    <div className="flex w-70 flex-col gap-3">
      <TextField.Root>
        <TextField.Slot>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
        </TextField.Slot>
        <TextField.Input placeholder="Search the docs…" />
      </TextField.Root>

      <TextField.Root variant="soft" size="3">
        <TextField.Input placeholder="Soft variant, size 3" />
      </TextField.Root>
    </div>
  );
}

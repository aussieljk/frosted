import React from 'react';
import { Blockquote } from '@aussieljk/frosted';

export default function BlockquoteDemo() {
  return (
    <div className="flex max-w-120 flex-col gap-4">
      <Blockquote>
        Perfection is achieved, not when there is nothing more to add, but when there is nothing left to take away.
      </Blockquote>
      <Blockquote size="2" color="indigo">
        Styles come and go. Good design is a language, not a style.
      </Blockquote>
    </div>
  );
}

import React from 'react';
import { Gallery } from '../cosmos/Gallery';
import Demo from '../demos/blockquote.demo';
import { Blockquote } from '../src/components/typography/blockquote';

function BlockquoteFixture() {
  const children = 'I love how we have the freedom to explore skeuomorphism';
  const props = {};
  return <Blockquote {...props}>{children}</Blockquote>;
}

const examples = { Example: BlockquoteFixture };

export default <Gallery examples={examples} demo={Demo} />;

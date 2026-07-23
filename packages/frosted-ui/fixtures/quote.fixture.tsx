import React from 'react';
import { Gallery } from '../cosmos/Gallery';
import Demo from '../demos/quote.demo';
import { Quote } from '../src/components/typography/quote';
import { Text } from '../src/components/typography/text';

function QuoteFixture() {
  const args = {};
  return (
    <Text>
      His famous quote, <Quote {...args}>Styles come and go. Good design is a language, not a style</Quote>, elegantly
      summs up Massimo’s philosophy of design.
    </Text>
  );
}

const examples = { Example: QuoteFixture };

export default <Gallery examples={examples} demo={Demo} />;

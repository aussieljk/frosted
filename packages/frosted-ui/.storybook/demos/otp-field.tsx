import React from 'react';
import { OTPField } from '@aussieljk/frosted';

export default function OTPFieldDemo() {
  return (
    <OTPField.Root
      maxLength={6}
      render={({ slots }) => (
        <>
          <OTPField.Group>
            {slots.slice(0, 3).map((slot, index) => (
              <OTPField.Slot key={index} {...slot} />
            ))}
          </OTPField.Group>
          <OTPField.Separator />
          <OTPField.Group>
            {slots.slice(3).map((slot, index) => (
              <OTPField.Slot key={index} {...slot} />
            ))}
          </OTPField.Group>
        </>
      )}
    />
  );
}

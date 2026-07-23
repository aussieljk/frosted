import React from 'react';
import { Callout, IconProvider, Icons } from '@aussieljk/frosted';
import { lucideAdapter } from '@aussieljk/frosted/icons/lucide';

export default function CalloutDemo() {
  return (
    <IconProvider library={lucideAdapter}>
      <Callout.Root color="warning" className="max-w-105">
        <Callout.Icon>
          <Icons.Info />
        </Callout.Icon>
        <Callout.Title>Your trial ends in 3 days</Callout.Title>
        <Callout.Description>Upgrade to keep access to analytics and priority support.</Callout.Description>
        <Callout.Actions>
          <Callout.Action>Upgrade</Callout.Action>
          <Callout.Action variant="secondary">Remind me later</Callout.Action>
        </Callout.Actions>
      </Callout.Root>
    </IconProvider>
  );
}

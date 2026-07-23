import React, { type ReactNode } from 'react';
import { useFixtureSelect } from 'react-cosmos/client';
import { Toaster } from '../src/components/sonner';
import { Theme } from '../src/theme';
import { themePropDefs } from '../src/theme-options';

const accentColors = [...themePropDefs.accentColor.values] as string[];
const grayColors = [...themePropDefs.grayColor.values] as string[];

/**
 * Wraps every fixture (see the cosmos.decorator.tsx files in src/ and demos/) in the
 * frosted <Theme>, with theme/accent/gray exposed as fixture selects — the cosmos
 * equivalent of the old storybook toolbar globals.
 */
export function ThemeDecorator({ children }: { children: ReactNode }) {
  const [appearance] = useFixtureSelect('theme', { options: ['light', 'dark'], defaultValue: 'light' });
  const [accentColor] = useFixtureSelect('accent', { options: accentColors, defaultValue: 'blue' });
  const [grayColor] = useFixtureSelect('gray', { options: grayColors, defaultValue: 'gray' });

  // No font override here: components use --default-font-family (SF Pro via -apple-system, Inter elsewhere).
  return (
    <Theme
      appearance={appearance}
      accentColor={accentColor as (typeof themePropDefs.accentColor.values)[number]}
      grayColor={grayColor as (typeof themePropDefs.grayColor.values)[number]}
    >
      <div style={{ padding: 'var(--space-5)' }}>{children}</div>
      <Toaster />
    </Theme>
  );
}

import React, { type ReactNode } from 'react';
import { ThemeDecorator } from '../cosmos/ThemeDecorator';

export default function Decorator({ children }: { children: ReactNode }) {
  return <ThemeDecorator>{children}</ThemeDecorator>;
}

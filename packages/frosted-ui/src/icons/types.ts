import type * as React from 'react';

/**
 * Canonical icon names understood by frosted-ui. Every adapter maps these
 * names to the semantically-equivalent icon of its library, so
 * `<Icons.Search />` renders the right glyph no matter which icon library
 * the consumer installed.
 */
export const CANONICAL_ICON_NAMES = [
  'AlertCircle',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowUp',
  'Bell',
  'Calendar',
  'Camera',
  'Check',
  'ChevronDown',
  'ChevronLeft',
  'ChevronRight',
  'ChevronUp',
  'Clock',
  'Close',
  'Copy',
  'DotsHorizontal',
  'DotsVertical',
  'Download',
  'Edit',
  'ExternalLink',
  'Eye',
  'EyeOff',
  'File',
  'Filter',
  'Folder',
  'Globe',
  'Heart',
  'HelpCircle',
  'Home',
  'Image',
  'Info',
  'Link',
  'Lock',
  'LogIn',
  'LogOut',
  'Mail',
  'Menu',
  'Minus',
  'Moon',
  'Pause',
  'Play',
  'Phone',
  'Plus',
  'Refresh',
  'Search',
  'Settings',
  'Star',
  'Sun',
  'Trash',
  'Unlock',
  'Upload',
  'User',
  'Users',
  'Warning',
] as const;

export type CanonicalIconName = (typeof CANONICAL_ICON_NAMES)[number];

/**
 * The lowest-common-denominator props every icon library accepts. Adapter
 * components receive these; extra library-specific props (weight, stroke, …)
 * are configured by wrapping/pre-binding inside the adapter itself.
 */
export interface AdapterIconProps {
  className?: string;
  style?: React.CSSProperties;
  width?: number | string;
  height?: number | string;
  color?: string;
  strokeWidth?: number | string;
  'aria-hidden'?: boolean | 'true' | 'false';
  'aria-label'?: string;
  onClick?: React.MouseEventHandler;
}

export type AdapterIconComponent = React.ComponentType<AdapterIconProps>;

/** A mapping from canonical icon names to one icon library's components. */
export interface IconAdapter {
  /** Library identifier, e.g. `'lucide'` or `'phosphor'`. */
  name: string;
  /** Partial map: unmapped canonical names fall back to built-in behavior. */
  icons: Partial<Record<CanonicalIconName, AdapterIconComponent>>;
}

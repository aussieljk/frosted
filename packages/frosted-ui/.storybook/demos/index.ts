import type { ComponentType } from 'react';

/**
 * The demo registry: ordering and titles for the Examples page, and the ids MDX pages
 * reference from `<Demo id="…" />`.
 *
 * Demos are loaded lazily. Importing all 80 of them eagerly pulled the entire component
 * library into every docs page (~700 dev requests for a page showing one component), so
 * each entry resolves its module and its `?raw` source only when it is actually rendered.
 * A demo's id is always its filename in this directory.
 */

export interface DemoEntry {
  /** Unique id, referenced from MDX via `<Demo id="…" />`. Matches the filename. */
  id: string;
  /** Human readable title, used on the Examples page. */
  title: string;
}

export const demos: DemoEntry[] = [
  // Layout & structure
  { id: 'layout', title: 'Layout' },
  { id: 'h-stack', title: 'HStack' },
  { id: 'v-stack', title: 'VStack' },
  { id: 'z-stack', title: 'ZStack' },
  { id: 'grid', title: 'Grid' },
  { id: 'spacer', title: 'Spacer' },
  { id: 'inset', title: 'Inset' },
  { id: 'separator', title: 'Separator' },
  { id: 'overlay', title: 'Overlay' },
  { id: 'scroll-area', title: 'Scroll Area' },
  { id: 'portal', title: 'Portal' },
  { id: 'visually-hidden', title: 'Visually Hidden' },
  // Typography
  { id: 'text', title: 'Text' },
  { id: 'heading', title: 'Heading' },
  { id: 'link', title: 'Link' },
  { id: 'code', title: 'Code' },
  { id: 'kbd', title: 'Kbd' },
  { id: 'em', title: 'Em' },
  { id: 'strong', title: 'Strong' },
  { id: 'quote', title: 'Quote' },
  { id: 'blockquote', title: 'Blockquote' },
  // Icons
  { id: 'icons', title: 'Icons' },
  // Buttons
  { id: 'button', title: 'Button' },
  { id: 'icon-button', title: 'Icon Button' },
  // Forms
  { id: 'text-field', title: 'Text Field' },
  { id: 'text-area', title: 'Text Area' },
  { id: 'number-field', title: 'Number Field' },
  { id: 'otp-field', title: 'OTP Field' },
  { id: 'checkbox', title: 'Checkbox' },
  { id: 'switch', title: 'Switch' },
  { id: 'radio-group', title: 'Radio Group' },
  { id: 'radio-button-group', title: 'Radio Button Group' },
  { id: 'slider', title: 'Slider' },
  { id: 'select', title: 'Select' },
  { id: 'field', title: 'Field' },
  { id: 'fieldset', title: 'Fieldset' },
  { id: 'form', title: 'Form' },
  // Pickers
  { id: 'calendar', title: 'Calendar' },
  { id: 'date-field', title: 'Date Field' },
  { id: 'date-picker', title: 'Date Picker' },
  { id: 'date-range-picker', title: 'Date Range Picker' },
  { id: 'autocomplete', title: 'Autocomplete' },
  { id: 'combobox', title: 'Combobox' },
  { id: 'filter-chip', title: 'Filter Chip' },
  // Overlays
  { id: 'dialog', title: 'Dialog' },
  { id: 'alert-dialog', title: 'Alert Dialog' },
  { id: 'sheet', title: 'Sheet' },
  { id: 'drawer', title: 'Drawer' },
  { id: 'popover', title: 'Popover' },
  { id: 'hover-card', title: 'Hover Card' },
  { id: 'tooltip', title: 'Tooltip' },
  { id: 'toast', title: 'Toast' },
  { id: 'lightbox', title: 'Lightbox' },
  // Menus
  { id: 'dropdown-menu', title: 'Dropdown Menu' },
  { id: 'context-menu', title: 'Context Menu' },
  // Navigation
  { id: 'tabs', title: 'Tabs' },
  { id: 'tabs-nav', title: 'Tabs Nav' },
  { id: 'segmented-control', title: 'Segmented Control' },
  { id: 'segmented-control-nav', title: 'Segmented Control Nav' },
  { id: 'segmented-control-radio-group', title: 'Segmented Control Radio Group' },
  { id: 'breadcrumbs', title: 'Breadcrumbs' },
  { id: 'accordion', title: 'Accordion' },
  // Data display
  { id: 'card', title: 'Card' },
  { id: 'badge', title: 'Badge' },
  { id: 'avatar', title: 'Avatar' },
  { id: 'avatar-group', title: 'Avatar Group' },
  { id: 'avatar-stack', title: 'Avatar Stack' },
  { id: 'table', title: 'Table' },
  { id: 'data-list', title: 'Data List' },
  { id: 'callout', title: 'Callout' },
  { id: 'empty-state', title: 'Empty State' },
  { id: 'progress', title: 'Progress' },
  { id: 'circular-progress', title: 'Circular Progress' },
  { id: 'stacked-horizontal-bar-chart', title: 'Stacked Horizontal Bar Chart' },
  // Misc
  { id: 'skeleton', title: 'Skeleton' },
  { id: 'spinner', title: 'Spinner' },
  { id: 'shine', title: 'Shine' },
  { id: 'scroll-gallery', title: 'Scroll Gallery' },
  { id: 'widget-stack', title: 'Widget Stack' },
  { id: 'credit-card', title: 'Credit Card' },
];

export function getDemo(id: string): DemoEntry | undefined {
  return demos.find((demo) => demo.id === id);
}

/** A resolved demo: the live component and the source shown beneath it. */
export interface LoadedDemo {
  Component: ComponentType;
  source: string;
}

const modules = import.meta.glob<{ default: ComponentType }>('./*.tsx');
const sources = import.meta.glob<string>('./*.tsx', { query: '?raw', import: 'default' });

/** Resolves one demo's module and its source together. Rendered through `<Demo>`/`<DemoView>`. */
export async function loadDemo(id: string): Promise<LoadedDemo> {
  const path = `./${id}.tsx`;
  if (!modules[path]) throw new Error(`Unknown demo id: "${id}". Add .storybook/demos/${id}.tsx.`);

  const [module, source] = await Promise.all([modules[path](), sources[path]()]);
  return { Component: module.default, source };
}

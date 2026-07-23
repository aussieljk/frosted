import type { Preview } from '@storybook/react-vite';

import data from './generated/component-props.json';

interface PropInfo {
  name: string;
  type: string;
  required: boolean;
  default?: string;
  description?: string;
}

interface ComponentEntry {
  description?: string;
  props: PropInfo[];
}

const components = data.components as unknown as Record<string, ComponentEntry>;

// JSON keys use dotted part names (`Tabs.Root`) while displayNames are flat (`TabsRoot`).
const byFlatName = new Map<string, ComponentEntry>();
for (const [key, entry] of Object.entries(components)) {
  byFlatName.set(key.replace(/\./g, ''), entry);
}

const UNION_OF_STRING_LITERALS = /^'[^']*'(\s*\|\s*'[^']*')*$/;

function controlFor(prop: PropInfo): { control?: unknown; options?: string[] } {
  if (UNION_OF_STRING_LITERALS.test(prop.type)) {
    const options = prop.type.split('|').map((member) => member.trim().replace(/^'|'$/g, ''));
    if (options.length === 1) return {};
    return { control: { type: 'select' }, options };
  }
  if (prop.type === 'boolean') return { control: { type: 'boolean' } };
  if (prop.type === 'number') return { control: { type: 'number' } };
  if (prop.type === 'string') return { control: { type: 'text' } };
  return {};
}

type ArgTypesEnhancer = NonNullable<Preview['argTypesEnhancers']>[number];

/**
 * Backfills controls from `generated/component-props.json` (the same data `<PropsTable>` renders).
 * Storybook's own docgen is `react-docgen` (non-TS, see main.ts) and can't see the prop types, so
 * without this the playground has no enum dropdowns, defaults, or descriptions.
 * Anything set explicitly in a story's `argTypes` wins.
 */
export const enhanceArgTypesFromProps: ArgTypesEnhancer = (context) => {
  const component = context.component as { displayName?: string; name?: string } | undefined | null;
  const name = component?.displayName || component?.name;
  const entry = name ? byFlatName.get(name.replace(/\./g, '')) : undefined;
  const argTypes = context.argTypes ?? {};
  if (!entry) return argTypes;

  for (const prop of entry.props) {
    const existing = argTypes[prop.name] ?? { name: prop.name };
    const { control, options } = controlFor(prop);

    argTypes[prop.name] = {
      ...existing,
      description: existing.description || prop.description,
      options: existing.options ?? options,
      control: existing.control ?? (control as never),
      table: {
        type: { summary: prop.type },
        defaultValue: prop.default ? { summary: prop.default } : undefined,
        ...existing.table,
      },
    };
  }

  return argTypes;
};

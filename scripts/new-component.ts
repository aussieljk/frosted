#!/usr/bin/env bun
// Scaffold a new @aussieljk/frosted component and wire it into every place the repo
// expects: component files, the components barrel, the CSS aggregate, the
// storybook demo registry, and an authored storybook MDX docs page.
//
// Usage:
//   bun run new:component <kebab-name> [--namespace] [--no-docs]
//
//   --namespace  namespace-style component (<Name>.Root / <Name>.Item, `export * as`)
//   --no-docs    skip the demo + MDX docs page (the story then uses autodocs)

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const UI = join(ROOT, 'packages/frosted-ui');
const SB = join(UI, '.storybook');

const args = process.argv.slice(2);
const flags = new Set(args.filter((a) => a.startsWith('--')));
const name = args.find((a) => !a.startsWith('--'));
const namespace = flags.has('--namespace');
const withDocs = !flags.has('--no-docs');

if (!name || !/^[a-z][a-z0-9]*(-[a-z0-9]+)*$/.test(name)) {
  console.error('Usage: bun run new:component <kebab-name> [--namespace] [--no-docs]');
  process.exit(1);
}

const pascal = name.replace(/(^|-)(\w)/g, (_, __, c) => c.toUpperCase());
const camel = pascal[0].toLowerCase() + pascal.slice(1);
const title = pascal.replace(/([a-z])([A-Z])/g, '$1 $2');

const componentDir = join(UI, 'src/components', name);
if (existsSync(componentDir)) {
  console.error(`${componentDir} already exists`);
  process.exit(1);
}

// ---------------------------------------------------------------------------
// helpers

function edit(file: string, transform: (src: string) => string | null, description: string) {
  const src = readFileSync(file, 'utf8');
  const next = transform(src);
  if (next === null) {
    console.warn(`! could not update ${file} — ${description} must be added by hand`);
    return;
  }
  writeFileSync(file, next);
  console.log(`~ ${file.replace(ROOT, '')}`);
}

function create(file: string, content: string) {
  writeFileSync(file, content);
  console.log(`+ ${file.replace(ROOT, '')}`);
}

/** Insert `line` after the last line matching `pattern`, or return null. */
function insertAfterLast(src: string, pattern: RegExp, line: string): string | null {
  const lines = src.split('\n');
  const idx = lines.findLastIndex((l) => pattern.test(l));
  if (idx === -1) return null;
  lines.splice(idx + 1, 0, line);
  return lines.join('\n');
}

// ---------------------------------------------------------------------------
// component files

mkdirSync(componentDir, { recursive: true });

create(
  join(componentDir, `${name}.props.ts`),
  `import type { PropDef } from '../../helpers';

const sizes = ['1', '2'] as const;

const ${camel}PropDefs = {
  /**
   * The size of the ${title.toLowerCase()}.
   * @default '1'
   */
  size: { type: 'enum', values: sizes, default: '1' },
} satisfies {
  size: PropDef<(typeof sizes)[number]>;
};

export { ${camel}PropDefs };
`,
);

create(
  join(componentDir, `${name}.tsx`),
  namespace
    ? `'use client';

import classNames from 'classnames';
import * as React from 'react';

import type { GetPropDefTypes } from '../../helpers';
import { ${camel}PropDefs } from './${name}.props';

type ${pascal}RootOwnProps = GetPropDefTypes<typeof ${camel}PropDefs>;
interface ${pascal}RootProps extends React.ComponentPropsWithoutRef<'div'>, ${pascal}RootOwnProps {}

/**
 * TODO: describe the ${title} component.
 *
 * @example
 * <${pascal}.Root>
 *   <${pascal}.Item>Item</${pascal}.Item>
 * </${pascal}.Root>
 */
const ${pascal}Root = (props: ${pascal}RootProps) => {
  const { className, size = ${camel}PropDefs.size.default, ...rootProps } = props;
  return <div {...rootProps} className={classNames('fui-${pascal}Root', className, \`fui-r-size-\${size}\`)} />;
};
${pascal}Root.displayName = '${pascal}Root';

interface ${pascal}ItemProps extends React.ComponentPropsWithoutRef<'div'> {}

const ${pascal}Item = (props: ${pascal}ItemProps) => {
  const { className, ...itemProps } = props;
  return <div {...itemProps} className={classNames('fui-${pascal}Item', className)} />;
};
${pascal}Item.displayName = '${pascal}Item';

export { ${pascal}Item as Item, ${pascal}Root as Root };
export type { ${pascal}ItemProps as ItemProps, ${pascal}RootProps as RootProps };
`
    : `import classNames from 'classnames';
import * as React from 'react';

import type { GetPropDefTypes } from '../../helpers';
import { ${camel}PropDefs } from './${name}.props';

type ${pascal}OwnProps = GetPropDefTypes<typeof ${camel}PropDefs>;
interface ${pascal}Props extends React.ComponentPropsWithoutRef<'div'>, ${pascal}OwnProps {}

/**
 * TODO: describe the ${title} component.
 *
 * @example
 * <${pascal} size="2" />
 */
const ${pascal} = (props: ${pascal}Props) => {
  const { className, size = ${camel}PropDefs.size.default, ...rootProps } = props;
  return <div {...rootProps} className={classNames('fui-${pascal}', className, \`fui-r-size-\${size}\`)} />;
};
${pascal}.displayName = '${pascal}';

export { ${pascal} };
export type { ${pascal}Props };
`,
);

create(
  join(componentDir, `${name}.css`),
  `.fui-${pascal}${namespace ? 'Root' : ''} {
  /* TODO: styles */
}
`,
);

create(
  join(componentDir, `${name}.stories.tsx`),
  `import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';

import { ${pascal} } from '../../../src/components';

const meta = {
  title: 'Components/${title}',
  component: ${namespace ? `${pascal}.Root` : pascal},
  parameters: { layout: 'centered' },
  ${withDocs ? `// Docs page is authored in .storybook/stories/components/${name}.mdx.\n  tags: ['!autodocs'],` : `tags: ['autodocs'],`}
} satisfies Meta<typeof ${namespace ? `${pascal}.Root` : pascal}>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {${
    namespace
      ? `
  render: () => (
    <${pascal}.Root>
      <${pascal}.Item>Item</${pascal}.Item>
    </${pascal}.Root>
  ),
`
      : ''
  }};
`,
);

create(
  join(componentDir, 'index.ts'),
  `${namespace ? `export * as ${pascal} from './${name}';` : `export * from './${name}';`}
export * from './${name}.props';
`,
);

// ---------------------------------------------------------------------------
// wiring: barrel + CSS aggregate

edit(
  join(UI, 'src/components/index.ts'),
  (src) => {
    const line = `export * from './${name}';`;
    // Land at the end of the COMPONENTS section, just before the UTILITIES banner.
    if (src.includes('\n// UTILITIES')) return src.replace('\n// UTILITIES', `${line}\n\n// UTILITIES`);
    return `${src.trimEnd()}\n${line}\n`;
  },
  'barrel export',
);

edit(
  join(UI, 'src/styles/index.css'),
  (src) => insertAfterLast(src, /^@import '\.\.\/components\/.*';$/, `@import '../components/${name}/${name}.css';`),
  'CSS @import',
);

// ---------------------------------------------------------------------------
// storybook docs: demo + registry entry + authored MDX page

if (withDocs) {
  create(
    join(SB, 'demos', `${name}.tsx`),
    namespace
      ? `import React from 'react';
import { ${pascal} } from '@aussieljk/frosted';

export default function ${pascal}Demo() {
  return (
    <${pascal}.Root>
      <${pascal}.Item>Item</${pascal}.Item>
    </${pascal}.Root>
  );
}
`
      : `import React from 'react';
import { ${pascal} } from '@aussieljk/frosted';

export default function ${pascal}Demo() {
  return <${pascal} />;
}
`,
  );

  edit(
    join(SB, 'demos/index.ts'),
    (src) => {
      const withImports = insertAfterLast(
        src,
        /^import \w+Source from '\.\/.*\?raw';$/,
        `import ${pascal}Demo from './${name}';\nimport ${camel}Source from './${name}?raw';`,
      );
      if (!withImports) return null;
      const entry = `  { id: '${name}', title: '${title}', component: ${pascal}Demo, source: ${camel}Source },`;
      const end = withImports.lastIndexOf('\n];');
      if (end === -1) return null;
      return `${withImports.slice(0, end)}\n${entry}${withImports.slice(end)}`;
    },
    'demo registry entry',
  );

  create(
    join(SB, 'stories/components', `${name}.mdx`),
    `import { Controls, Meta, Primary, Stories } from '@storybook/addon-docs/blocks';

import * as ${pascal}Stories from '../../../src/components/${name}/${name}.stories';
import { Demo } from '../../components/demo';
import { PropsTable } from '../../components/props-table';

<Meta of={${pascal}Stories} />

# ${title}

TODO — one line describing ${title}.

<Demo id="${name}" />

## Usage

\`\`\`tsx
import { ${pascal} } from '@aussieljk/frosted';
\`\`\`

## Props

<PropsTable component="${namespace ? `${pascal}.Root` : pascal}" />

## Playground

<Primary />

<Controls />

## Stories

<Stories includePrimary={false} />
`,
  );
}

console.log(`
Done. Next steps:
  1. Implement ${pascal} in packages/frosted-ui/src/components/${name}/${name}.tsx (+ its .css and .props.ts)
  2. Flesh out the story and the demo${withDocs ? '' : ' (docs skipped — rerun without --no-docs or wire by hand)'}
  3. Run it (regenerates prop tables): bun run dev
`);

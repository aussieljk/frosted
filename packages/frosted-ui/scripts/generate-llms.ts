/**
 * Generates `.storybook/public/llms.txt` (an index) and `.storybook/public/llms-full.txt`
 * (every page inlined) from the storybook MDX docs, so the docs can be fed to an LLM.
 * Storybook serves `.storybook/public` at the site root, i.e. `/llms.txt`.
 *
 * MDX is reduced to plain markdown: the import preamble and `<Meta>` tag are dropped, the
 * interactive-only doc blocks are stripped, and the two custom blocks are expanded rather
 * than dropped — `<PropsTable component="X" />` becomes a markdown prop table (from the
 * generated JSON) and `<Demo id="x" />` becomes the demo's source.
 *
 * Run with `bun run generate:llms`. Depends on `bun run generate:props` having run first.
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const pkgDir = join(dirname(fileURLToPath(import.meta.url)), '..');
const storybookDir = join(pkgDir, '.storybook');
const storiesDir = join(storybookDir, 'stories');
const demosDir = join(storybookDir, 'demos');
const outDir = join(storybookDir, 'public');
const propsFile = join(storybookDir, 'generated/component-props.json');

const SITE = 'https://frosted.localhost';

// Doc blocks that only mean something in the live storybook UI.
const INTERACTIVE_BLOCKS = ['Primary', 'Controls', 'Stories', 'Canvas', 'ArgTypes', 'Story', 'AllExamples', 'img'];

interface PropInfo {
  name: string;
  type: string;
  required: boolean;
  default?: string;
  description?: string;
  deprecated?: boolean;
}

const propsData: { components: Record<string, { description?: string; props: PropInfo[] } | undefined> } = existsSync(
  propsFile,
)
  ? JSON.parse(readFileSync(propsFile, 'utf8'))
  : { components: {} };

/** Storybook's own id sanitizer, so index links match the real docs routes. */
function sanitize(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function escapeCell(value: string): string {
  return value
    .replace(/\|/g, '\\|')
    .replace(/\s*\n\s*/g, ' ')
    .trim();
}

/** `<PropsTable component="Button" />` -> a markdown table of Button's props. */
function renderPropsTable(component: string): string {
  const entry = propsData.components[component];
  if (!entry) return `_(no generated props for \`${component}\` — run \`bun run generate:props\`)_`;

  const rows = entry.props.map((prop) => {
    const name = prop.required ? `\`${prop.name}\` (required)` : `\`${prop.name}\``;
    const def = prop.default ? `\`${escapeCell(prop.default)}\`` : '—';
    return `| ${name} | \`${escapeCell(prop.type)}\` | ${def} | ${escapeCell(prop.description ?? '')} |`;
  });

  return [
    entry.description ? `${entry.description}\n` : '',
    '| Prop | Type | Default | Description |',
    '| --- | --- | --- | --- |',
    ...rows,
  ]
    .filter(Boolean)
    .join('\n');
}

/** `<Demo id="button" />` -> the demo's source in a tsx fence. */
function renderDemo(id: string): string {
  const file = join(demosDir, `${id}.tsx`);
  if (!existsSync(file)) return `_(unknown demo "${id}")_`;
  const source = readFileSync(file, 'utf8')
    .replace(/^import React from 'react';\n/, '')
    .trimEnd();
  return ['Example:', '', '```tsx', source, '```'].join('\n');
}

/**
 * The storybook title of a page: either its own `<Meta title="…" />`, or — for pages attached
 * to a CSF file with `<Meta of={X} />` — the title declared by that stories file.
 */
function storybookTitle(source: string, file: string): string | undefined {
  const own = source.match(/<Meta\s+title="([^"]+)"/)?.[1];
  if (own) return own;

  const ofName = source.match(/<Meta\s+of=\{(\w+)\}/)?.[1];
  if (!ofName) return undefined;
  const importPath = source.match(new RegExp(`import\\s+\\*\\s+as\\s+${ofName}\\s+from\\s+'([^']+)'`))?.[1];
  if (!importPath) return undefined;

  const resolved = resolve(dirname(file), `${importPath}.tsx`);
  if (!existsSync(resolved)) return undefined;
  return readFileSync(resolved, 'utf8').match(/^\s*title:\s*'([^']+)'/m)?.[1];
}

function mdxToMarkdown(source: string): string {
  // Everything up to and including the <Meta …/> tag is imports + storybook plumbing.
  const metaEnd = source.search(/<Meta[\s\S]*?\/>/);
  const body = metaEnd === -1 ? source : source.slice(source.indexOf('/>', metaEnd) + 2);

  return body
    .replace(/<PropsTable\s+component="([^"]+)"\s*\/>/g, (_, name) => renderPropsTable(name))
    .replace(/<Demo\s+id="([^"]+)"\s*\/>/g, (_, id) => renderDemo(id))
    .replace(new RegExp(`^<(${INTERACTIVE_BLOCKS.join('|')})\\b[^>]*/>\\s*$`, 'gm'), '')
    .replace(/^##\s+(Playground|Stories)\s*$/gm, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

interface Page {
  /** Sort key — Introduction first, then the numbered guides, then the rest by title. */
  order: string;
  title: string;
  url: string;
  /** First paragraph, used for the index. */
  summary: string;
  body: string;
}

function collect(dir: string): Page[] {
  const pages: Page[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      pages.push(...collect(full));
      continue;
    }
    if (!entry.name.endsWith('.mdx')) continue;

    const raw = readFileSync(full, 'utf8');
    const body = mdxToMarkdown(raw);
    const heading = body.match(/^#\s+(.+)$/m)?.[1]?.trim();
    const sbTitle = storybookTitle(raw, full);
    const title = heading ?? sbTitle ?? entry.name.replace(/\.mdx$/, '');
    const summary =
      body
        .split('\n')
        .find((line) => line.trim() && !line.startsWith('#') && !line.startsWith('<'))
        ?.trim() ?? '';

    const numbered = entry.name.match(/^(\d+)\./)?.[1];
    const order = entry.name === 'Introduction.mdx' ? '0' : numbered ? `1${numbered.padStart(3, '0')}` : `2${title}`;

    pages.push({
      order,
      title,
      url: sbTitle ? `${SITE}/?path=/docs/${sanitize(sbTitle)}--docs` : SITE,
      summary,
      body,
    });
  }
  return pages;
}

const pages = collect(storiesDir).sort((a, b) => a.order.localeCompare(b.order));

const index = [
  '# @aussieljk/frosted',
  '',
  'A React design system with a themeable component library, SwiftUI-style layout primitives,',
  'and pluggable icon sets. Published as `@aussieljk/frosted`.',
  '',
  `The full text of every page below is inlined at ${SITE}/llms-full.txt`,
  '',
  '## Docs',
  '',
  ...pages.map((page) => `- [${page.title}](${page.url})${page.summary ? `: ${page.summary}` : ''}`),
  '',
].join('\n');

const full = `${pages.map((page) => page.body).join('\n\n---\n\n')}\n`;

mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, 'llms.txt'), index);
writeFileSync(join(outDir, 'llms-full.txt'), full);

console.log(`Wrote llms.txt + llms-full.txt for ${pages.length} pages -> ${relative(pkgDir, outDir)}`);

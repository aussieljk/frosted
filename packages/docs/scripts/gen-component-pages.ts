/**
 * Generates one docs page per live demo in the frosted-ui package. The demos are the source of
 * truth for the current component API (the archived Storybook MDX describes an older, drifted
 * API), so each page renders the real `<Demo>` and nothing goes stale silently.
 *
 * Idempotent: only writes a page that doesn't exist yet, so hand-authored pages (button.mdx and
 * anything you enrich later) are preserved. Re-run after adding a demo:
 *
 *   bun run scripts/gen-component-pages.ts
 */
import { readdirSync, existsSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const demosDir = join(here, '../../frosted-ui/demos');
const outDir = join(here, '../content/docs/components');

// kebab -> display label, keeping the library's CamelStack names intact.
const SPECIAL: Record<string, string> = {
  'h-stack': 'HStack',
  'v-stack': 'VStack',
  'z-stack': 'ZStack',
  'input-otp': 'InputOTP',
  'aspect-ratio': 'AspectRatio',
};

function label(name: string): string {
  if (SPECIAL[name]) return SPECIAL[name];
  return name
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

mkdirSync(outDir, { recursive: true });

const demos = readdirSync(demosDir)
  .filter((f) => f.endsWith('.demo.tsx'))
  .map((f) => f.replace('.demo.tsx', ''))
  .sort();

let created = 0;
for (const name of demos) {
  const file = join(outDir, `${name}.mdx`);
  if (existsSync(file)) continue;

  const title = label(name);
  writeFileSync(
    file,
    `---
title: ${title}
description: ${title} component.
---

<Demo name="${name}" />
`,
  );
  created++;
}

console.log(
  `Component pages: ${created} created, ${demos.length - created} already existed (${demos.length} demos total).`,
);

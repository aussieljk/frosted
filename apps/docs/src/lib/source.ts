import { loader } from 'fumadocs-core/source';
import { docs } from 'collections/server';
import { lucideIconsPlugin } from 'fumadocs-core/source/lucide-icons';
import { getDemo } from '@/demos';
import { getComponentProps } from '@/components/props-table';
import { docsRoute } from './shared';

export const source = loader({
  source: docs.toFumadocsSource(),
  baseUrl: docsRoute,
  plugins: [lucideIconsPlugin()],
});

export function markdownPathToSlugs(segs: string[]) {
  if (segs.length === 0) return [];

  const out = [...segs];
  out[out.length - 1] = out[out.length - 1].replace(/\.md$/, '');
  if (out.length === 1 && out[0] === 'index') out.pop();
  return out;
}

export function slugsToMarkdownPath(slugs: string[]) {
  const segments = [...slugs];
  if (segments.length === 0) {
    segments.push('index.md');
  } else {
    segments[segments.length - 1] += '.md';
  }

  return {
    segments,
    url: `${docsRoute}/${segments.join('/')}`,
  };
}

export async function getLLMText(page: (typeof source)['$inferPage']) {
  const processed = await page.data.getText('processed');

  return `# ${page.data.title} (${page.url})

${inlinePropsTables(inlineDemoSources(processed))}`;
}

/** Replace `<Demo id="…" />` placeholders with the demo's actual source code. */
function inlineDemoSources(markdown: string) {
  return markdown.replace(/<Demo\s+id="([^"]+)"\s*\/>/g, (match, id: string) => {
    const demo = getDemo(id);
    if (!demo) return match;

    return ['Live example:', '', '```tsx', demo.source.trimEnd(), '```'].join('\n');
  });
}

/** Replace `<PropsTable component="…" />` placeholders with a markdown props table. */
function inlinePropsTables(markdown: string) {
  return markdown.replace(/<PropsTable\s+component="([^"]+)"\s*\/>/g, (match, component: string) => {
    const entry = getComponentProps(component);
    if (!entry) return match;

    const cell = (text: string) => text.replace(/\|/g, '\\|').replace(/\s+/g, ' ').trim();
    const rows = entry.props.map((prop) => {
      const cells = [
        `\`${prop.name}\`${prop.required ? ' *(required)*' : ''}${prop.deprecated ? ' *(deprecated)*' : ''}`,
        `\`${cell(prop.type)}\``,
        prop.default ? `\`${cell(prop.default)}\`` : '—',
        prop.description ? cell(prop.description) : '',
      ];
      return `| ${cells.join(' | ')} |`;
    });

    return ['| Prop | Type | Default | Description |', '| --- | --- | --- | --- |', ...rows].join('\n');
  });
}

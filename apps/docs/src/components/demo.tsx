import { Theme } from '@aussieljk/frosted';
import { DynamicCodeBlock } from 'fumadocs-ui/components/dynamic-codeblock';

import { getDemo, type DemoEntry } from '@/demos';

/** Renders a demo entry: live preview on top, its source code below. */
export function DemoView({ entry }: { entry: DemoEntry }) {
  const Component = entry.component;

  return (
    <div className="not-prose my-6 flex flex-col overflow-hidden rounded-xl border">
      <Theme
        appearance="inherit"
        accentColor="blue"
        grayColor="gray"
        className="flex min-h-40 items-center justify-center overflow-x-auto p-8"
      >
        <Component />
      </Theme>
      <div className="border-t [&_pre]:!my-0 [&_figure]:!my-0 [&_figure]:!rounded-none [&_figure]:!border-0">
        <DynamicCodeBlock lang="tsx" code={entry.source.trimEnd()} />
      </div>
    </div>
  );
}

/** MDX-facing component: `<Demo id="button" />`. */
export function Demo({ id }: { id: string }) {
  const entry = getDemo(id);
  if (!entry) throw new Error(`Unknown demo id: "${id}". Register it in src/demos/index.ts.`);

  return <DemoView entry={entry} />;
}

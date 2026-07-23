import { Source } from '@storybook/addon-docs/blocks';
import React, { lazy, Suspense, type ComponentType } from 'react';

import { Theme } from '../../src/theme';
import { getDemo, loadDemo, type DemoEntry } from '../demos';

// The chrome around a demo sits outside `Theme`, so it can't use frosted tokens.
const BORDER = '1px solid rgba(128, 128, 128, 0.3)';

/** The frame renders immediately, so the page keeps its layout while the demo resolves. */
function Frame({ children, pending }: { children?: React.ReactNode; pending?: boolean }) {
  return (
    <div
      // `bun run screenshot` waits for every demo to drop this attribute before capturing.
      data-demo-pending={pending ? '' : undefined}
      style={{ margin: '24px 0', border: BORDER, borderRadius: 12, overflow: 'hidden', minHeight: 224 }}
    >
      {children}
    </div>
  );
}

function DemoBody({ Component, source }: { Component: ComponentType; source: string }) {
  return (
    <>
      <Theme
        appearance="inherit"
        accentColor="blue"
        grayColor="gray"
        style={{
          display: 'flex',
          minHeight: 160,
          alignItems: 'center',
          justifyContent: 'center',
          overflowX: 'auto',
          padding: 32,
        }}
      >
        <Component />
      </Theme>
      <div style={{ borderTop: BORDER }}>
        {/* The explicit React import is a storybook build detail, not part of the example. */}
        <Source code={source.replace(/^import React from 'react';\n/, '').trimEnd()} language="tsx" />
      </div>
    </>
  );
}

// One lazy component per demo id, memoized so React sees a stable type across re-renders.
const loaders = new Map<string, ComponentType>();

function lazyDemo(id: string): ComponentType {
  let loader = loaders.get(id);
  if (!loader) {
    loader = lazy(async () => {
      const { Component, source } = await loadDemo(id);
      return { default: () => <DemoBody Component={Component} source={source} /> };
    });
    loaders.set(id, loader);
  }
  return loader;
}

/** Renders a demo entry: live preview on top, its source code below. */
export function DemoView({ entry }: { entry: DemoEntry }) {
  const LazyDemo = lazyDemo(entry.id);

  return (
    <Suspense fallback={<Frame pending />}>
      <Frame>
        <LazyDemo />
      </Frame>
    </Suspense>
  );
}

/** MDX-facing component: `<Demo id="button" />`. */
export function Demo({ id }: { id: string }) {
  const entry = getDemo(id);
  if (!entry) throw new Error(`Unknown demo id: "${id}". Register it in .storybook/demos/index.ts.`);

  return <DemoView entry={entry} />;
}

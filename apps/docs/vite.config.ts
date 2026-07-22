import react from '@vitejs/plugin-react';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import mdx from 'fumadocs-mdx/vite';
import { nitro } from 'nitro/vite';
import { fileURLToPath } from 'node:url';

const frostedSrc = fileURLToPath(new URL('../../packages/frosted-ui/src', import.meta.url));

export default defineConfig(({ command }) => ({
  plugins: [
    mdx(),
    tailwindcss(),
    tanstackStart({
      prerender: {
        enabled: true,
      },
    }),
    react(),
    // please see https://tanstack.com/start/latest/docs/framework/react/guide/hosting#nitro for guides on hosting
    nitro(),
  ],
  server: {
    // pre-transform the entry graph so the first page load doesn't pay the whole compile
    warmup: {
      clientFiles: ['./src/router.tsx', './src/routes/__root.tsx', './src/routes/index.tsx'],
    },
  },
  resolve: {
    tsconfigPaths: true,
    alias: [
      // In dev, consume frosted straight from source for instant HMR — no dist/, no
      // watch build. Production builds keep resolving the built package so the docs
      // exercise the same artifact that ships to npm. CSS subpaths (styles.css) are
      // untouched either way and come from the postcss watcher's output.
      ...(command === 'serve'
        ? [
            { find: /^@aussieljk\/frosted$/, replacement: `${frostedSrc}/index.ts` },
            { find: /^@aussieljk\/frosted\/icons$/, replacement: `${frostedSrc}/icons/index.ts` },
            { find: /^@aussieljk\/frosted\/icons\/(\w+)$/, replacement: `${frostedSrc}/icons/adapters/$1.ts` },
          ]
        : []),
      { find: 'tslib', replacement: 'tslib/tslib.es6.js' },
    ],
  },
}));

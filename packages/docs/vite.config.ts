import react from '@vitejs/plugin-react';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';
import tailwindcss from '@tailwindcss/vite';
import mdx from 'fumadocs-mdx/vite';
import { nitro } from 'nitro/vite';

// The live usage demos live in the frosted-ui package (`demos/*.demo.tsx`). They import the
// public `@aussieljk/frosted` entry, so they render exactly what a consumer would copy-paste.
// `@demos` lets the docs registry import both the component and its `?raw` source.
const demosDir = fileURLToPath(new URL('../frosted-ui/demos', import.meta.url));

export default defineConfig({
  server: {
    port: 3000,
  },
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
    nitro({
      preset: 'vercel',
    }),
  ],
  resolve: {
    tsconfigPaths: true,
    alias: {
      tslib: 'tslib/tslib.es6.js',
      '@demos': demosDir,
    },
  },
});

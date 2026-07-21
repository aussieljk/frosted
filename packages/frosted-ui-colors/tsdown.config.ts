import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  outDir: '.',
  clean: false,
  dts: false,
  outExtensions: (ctx) => ({ js: ctx.format === 'cjs' ? '.js' : '.mjs' }),
});

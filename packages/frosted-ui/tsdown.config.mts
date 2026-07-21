import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/**/*.{ts,tsx}', '!src/**/*.stories.*', '!src/**/*.test.*', '!src/test-setup.ts'],
  format: ['esm', 'cjs'],
  outDir: 'dist',
  unbundle: true,
  dts: true,
  sourcemap: true,
  platform: 'neutral',
});

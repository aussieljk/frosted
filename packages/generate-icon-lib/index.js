#!/usr/bin/env bun

/*
|-------------------------------------------------------------------------------
| CLI bootstrap. Bun executes the TypeScript sources directly — no compile step
| (this package isn't published). We only load .env config before starting.
*/
import path from 'node:path';
import dotenv from 'dotenv';

dotenv.config({
  path: path.resolve(process.cwd(), '.env'),
  quiet: true,
});

/*
|-------------------------------------------------------------------------------
| Start the CLI! Vroom vroom
| (Dynamic import so dotenv has populated process.env before the CLI runs.)
*/
await import('./src/cli.ts');

#!/usr/bin/env bun
// Diagnose the recurring environment problems in this repo.
//
// Under bunfig's hoisted linker, stale nested `packages/*/node_modules` dirs
// (leftovers from older installs — e.g. typescript 4.9.5) shadow the root
// binaries and make a package mysteriously use an ancient tsc.
//
// Usage: bun run doctor [--fix]   (--fix deletes the offending dirs)

import { existsSync, readdirSync, readFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const fix = process.argv.includes('--fix');

// Nested deps that are deliberate and must NOT be deleted.
const ALLOWED: Record<string, string[]> = {};

let problems = 0;

// --- bun version vs packageManager pin -------------------------------------
const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));
const pinned = (pkg.packageManager ?? '').replace(/^bun@/, '');
if (pinned && Bun.version !== pinned) {
  problems++;
  console.log(`✗ bun ${Bun.version} running, but packageManager pins bun@${pinned} (mise install / mise use)`);
}

// --- stale nested node_modules ---------------------------------------------
function versionOf(dir: string): string {
  try {
    return JSON.parse(readFileSync(join(dir, 'package.json'), 'utf8')).version ?? '?';
  } catch {
    return '?';
  }
}

for (const group of ['packages', 'tools']) {
  const groupDir = join(ROOT, group);
  if (!existsSync(groupDir)) continue;
  for (const ws of readdirSync(groupDir)) {
    const nm = join(groupDir, ws, 'node_modules');
    if (!existsSync(nm)) continue;
    const allowed = ALLOWED[`${group}/${ws}`] ?? [];
    const entries = readdirSync(nm).filter((e) => !e.startsWith('.') && !allowed.includes(e));
    if (entries.length === 0) continue;
    for (const entry of entries) {
      problems++;
      const detail = entry.startsWith('@') ? '' : ` (v${versionOf(join(nm, entry))})`;
      console.log(`✗ ${group}/${ws}/node_modules/${entry}${detail} — likely stale, shadows the hoisted root install`);
      if (fix) {
        rmSync(join(nm, entry), { recursive: true, force: true });
        console.log(`  deleted`);
      }
    }
  }
}

if (problems === 0) {
  console.log('✓ no problems found');
} else if (fix) {
  console.log('\nDeleted the flagged dirs — now run: bun install');
} else {
  console.log('\nRe-run with --fix to delete the flagged dirs, then run: bun install');
}

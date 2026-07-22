/**
 * Dev orchestrator — replaces `turbo run dev`.
 *
 * Starts all five dev processes in parallel (no build barrier: tsdown --watch and
 * postcss --watch both do an initial build on startup), prefixes their output with
 * short colored labels, polls the three portless URLs, and opens each in Safari as
 * it becomes ready. `generate:props` only blocks startup when its output is missing;
 * otherwise it refreshes in the background and Vite hot-reloads the JSON.
 *
 * Flags: --no-open (skip Safari).
 */
import { spawn, type ChildProcess } from 'node:child_process';
import { existsSync } from 'node:fs';
import { createInterface } from 'node:readline';
import { join, resolve } from 'node:path';

const root = resolve(import.meta.dir, '..');
const frostedDir = join(root, 'packages/frosted-ui');
const docsDir = join(root, 'apps/docs');
const playDir = join(root, 'apps/tailwind');

const noOpen = process.argv.includes('--no-open');
const startedAt = Date.now();

const c = {
  dim: (s: string) => `\x1b[2m${s}\x1b[0m`,
  bold: (s: string) => `\x1b[1m${s}\x1b[0m`,
  green: (s: string) => `\x1b[32m${s}\x1b[0m`,
  red: (s: string) => `\x1b[31m${s}\x1b[0m`,
  cyan: (s: string) => `\x1b[36m${s}\x1b[0m`,
  magenta: (s: string) => `\x1b[35m${s}\x1b[0m`,
  yellow: (s: string) => `\x1b[33m${s}\x1b[0m`,
  blue: (s: string) => `\x1b[34m${s}\x1b[0m`,
};

const elapsed = () => `${((Date.now() - startedAt) / 1000).toFixed(1)}s`;

// Lines nobody needs to see (banners, config dumps, telemetry notices).
// oxlint-disable-next-line no-control-regex
const stripAnsi = (s: string) => s.replace(/\x1b\[[0-9;]*m/g, '');
const NOISE = [
  /^\s*$/,
  /^portless$/, // portless prints its own banner…
  /^-- /, // …plus proxy/route status lines…
  /^-> |^Running: /, // …and the resolved command with its port mapping
  /^\s*[╭│╰]/, // storybook banner box
  /telemetry/i,
  /^ℹ (entry|target|tsconfig|config file): /, // tsdown startup config dump
  /^ℹ tsdown v/,
  /^ℹ (Build start|Cleaning \d+ files|Emit types)/,
  /^ℹ dist\//, // tsdown per-file size report (~800 lines per rebuild)
  /^ℹ \d+ files, total:/,
  /TypeScript 7\.0 does not yet have a stable API/,
];

interface Proc {
  name: string;
  paint: (s: string) => string;
  cwd: string;
  cmd: string[];
}

const procs: Proc[] = [
  { name: 'docs', paint: c.cyan, cwd: docsDir, cmd: ['portless', 'frosted', 'vite', 'dev', '--logLevel', 'warn'] },
  {
    name: 'play',
    paint: c.magenta,
    cwd: playDir,
    cmd: ['portless', 'play.frosted', 'vite', 'dev', '--logLevel', 'warn'],
  },
  {
    name: 'sb',
    paint: c.yellow,
    cwd: frostedDir,
    cmd: ['portless', 'storybook.frosted', 'sh', '-c', 'storybook dev -p "$PORT" --no-open --quiet'],
  },
  // --no-clean: wiping dist/ on watch startup breaks the vite apps until the rebuild lands
  { name: 'js', paint: c.blue, cwd: frostedDir, cmd: ['tsdown', '--watch', '--no-clean'] },
  {
    name: 'css',
    paint: c.green,
    cwd: frostedDir,
    cmd: ['postcss', 'src/styles/index.css', '-o', 'styles.css', '--watch'],
  },
];

const servers = [
  { name: 'docs', url: 'https://frosted.localhost' },
  { name: 'play', url: 'https://play.frosted.localhost' },
  { name: 'storybook', url: 'https://storybook.frosted.localhost' },
];

const children: ChildProcess[] = [];
let shuttingDown = false;

function shutdown(code: number) {
  if (shuttingDown) return;
  shuttingDown = true;
  for (const child of children) {
    if (child.pid) {
      try {
        process.kill(-child.pid, 'SIGTERM');
      } catch {}
    }
  }
  process.exit(code);
}

process.on('SIGINT', () => shutdown(0));
process.on('SIGTERM', () => shutdown(0));

function start({ name, paint, cwd, cmd }: Proc) {
  const label = paint(name.padEnd(4)) + c.dim('│') + ' ';
  const child = spawn(cmd[0], cmd.slice(1), {
    cwd,
    detached: true, // own process group, so shutdown() can kill grandchildren (vite under portless)
    env: {
      ...process.env,
      FORCE_COLOR: '1',
      PATH: `${join(cwd, 'node_modules/.bin')}:${join(root, 'node_modules/.bin')}:${process.env.PATH}`,
    },
  });
  for (const stream of [child.stdout!, child.stderr!]) {
    createInterface({ input: stream }).on('line', (line) => {
      const plain = stripAnsi(line).trim();
      if (NOISE.some((re) => re.test(plain))) return;
      console.log(label + line);
    });
  }
  child.on('exit', (code) => {
    if (shuttingDown) return;
    console.log(c.red(`✗ ${name} exited unexpectedly (${code}) — shutting down`));
    shutdown(code ?? 1);
  });
  children.push(child);
}

async function waitAndOpen({ name, url }: { name: string; url: string }) {
  while (!shuttingDown) {
    try {
      const res = await fetch(url, { tls: { rejectUnauthorized: false } } as RequestInit);
      if (res.status < 400) break; // portless answers 404 for unregistered routes, 5xx while the backend boots
    } catch {}
    await Bun.sleep(250);
  }
  if (shuttingDown) return;
  console.log(`${c.green('✓')} ${c.bold(name.padEnd(9))} ${url}  ${c.dim(elapsed())}`);
  if (!noOpen) spawn('open', ['-a', 'Safari', url]);
}

// --- go ---

console.log(`\n${c.bold('❄ frosted dev')}\n`);

// First run only: the apps consume dist/ and styles.css, and only a full build
// applies fix-namespace-exports and produces theme.css.
if (!existsSync(join(frostedDir, 'dist/index.js')) || !existsSync(join(frostedDir, 'theme.css'))) {
  console.log(c.dim('first run — building @aussieljk/frosted…'));
  const build = Bun.spawnSync(['bun', 'run', 'build'], { cwd: frostedDir, stdio: ['ignore', 'inherit', 'inherit'] });
  if (build.exitCode !== 0) process.exit(build.exitCode);
}

// Prop tables: block only when missing, otherwise refresh in the background.
const propsJson = join(docsDir, 'src/generated/component-props.json');
const generateProps = () => spawn('bun', ['scripts/generate-props.ts'], { cwd: docsDir, stdio: 'ignore' });
if (!existsSync(propsJson)) {
  console.log(c.dim('generating prop tables…'));
  await new Promise((done) => generateProps().on('exit', done));
} else {
  generateProps().on('exit', (code) => {
    if (!shuttingDown && code === 0)
      console.log(`${c.green('✓')} ${c.bold('props')}     refreshed  ${c.dim(elapsed())}`);
  });
}

procs.forEach(start);
const ready = Promise.all(servers.map(waitAndOpen));

ready.then(() => {
  if (!shuttingDown) console.log(c.dim(`\nall ready in ${elapsed()} — ctrl-c to stop\n`));
});

/**
 * Dev orchestrator — `bun dev [docs|sb] [--no-open] [--kill]`.
 *
 * Starts the dev processes in parallel, prefixes their output with short colored
 * labels, polls the portless URLs, and opens each in Safari as it becomes ready.
 *
 * - No arguments starts everything; `bun dev docs` / `bun dev sb` starts one site
 *   (the CSS watchers always run — both sites consume the built styles.css).
 * - Docs consume frosted straight from src/ (vite alias), so no dist/ watch build
 *   runs here at all; storybook reads src/ natively.
 * - `generate:props` is skipped when frosted src is unchanged since the last run,
 *   and refreshes in the background otherwise (Vite hot-reloads the JSON).
 * - Stale dev processes from a previous session (they squat the portless routes)
 *   are killed on startup; `--kill` does only that and exits.
 */
import { spawn, type ChildProcess } from 'node:child_process';
import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { createInterface } from 'node:readline';
import { join, resolve } from 'node:path';

const root = resolve(import.meta.dir, '..');
const frostedDir = join(root, 'packages/frosted-ui');
const docsDir = join(root, 'apps/docs');

const flags = process.argv.slice(2).filter((a) => a.startsWith('--'));
const targets = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const noOpen = flags.includes('--no-open');
const killOnly = flags.includes('--kill');
const startedAt = Date.now();

const c = {
  dim: (s: string) => `\x1b[2m${s}\x1b[0m`,
  bold: (s: string) => `\x1b[1m${s}\x1b[0m`,
  green: (s: string) => `\x1b[32m${s}\x1b[0m`,
  red: (s: string) => `\x1b[31m${s}\x1b[0m`,
  cyan: (s: string) => `\x1b[36m${s}\x1b[0m`,
  yellow: (s: string) => `\x1b[33m${s}\x1b[0m`,
  blue: (s: string) => `\x1b[34m${s}\x1b[0m`,
  magenta: (s: string) => `\x1b[35m${s}\x1b[0m`,
};

const elapsed = () => `${((Date.now() - startedAt) / 1000).toFixed(1)}s`;

// Lines nobody needs to see (banners, route chatter, telemetry notices).
// oxlint-disable-next-line no-control-regex
const stripAnsi = (s: string) => s.replace(/\x1b\[[0-9;]*m/g, '');
const NOISE = [
  /^\s*$/,
  /^portless$/, // portless prints its own banner…
  /^-- /, // …plus proxy/route status lines…
  /^-> |^Running: /, // …and the resolved command with its port mapping
  /^\s*[╭│╰┌└]/, // storybook banner box
  /telemetry/i,
];

interface Proc {
  name: string;
  paint: (s: string) => string;
  cwd: string;
  cmd: string[];
}

const allProcs: Record<string, Proc[]> = {
  docs: [
    { name: 'docs', paint: c.cyan, cwd: docsDir, cmd: ['portless', 'frosted', 'vite', 'dev', '--logLevel', 'warn'] },
  ],
  sb: [
    {
      name: 'sb',
      paint: c.yellow,
      cwd: frostedDir,
      cmd: ['portless', 'storybook.frosted', 'sh', '-c', 'storybook dev -p "$PORT" --no-open --quiet'],
    },
  ],
  css: [
    {
      name: 'css',
      paint: c.green,
      cwd: frostedDir,
      cmd: ['postcss', 'src/styles/index.css', '-o', 'styles.css', '--watch'],
    },
    {
      name: 'thm',
      paint: c.blue,
      cwd: frostedDir,
      cmd: ['postcss', 'src/styles/theme.css', '-o', 'theme.css', '--watch'],
    },
  ],
};

const allServers = {
  docs: { name: 'docs', url: 'https://frosted.localhost' },
  sb: { name: 'storybook', url: 'https://storybook.frosted.localhost' },
};

const aliases: Record<string, keyof typeof allServers> = { docs: 'docs', sb: 'sb', storybook: 'sb' };
const selected = targets.length ? targets.map((t) => aliases[t]) : (['docs', 'sb'] as const);
if (selected.some((s) => !s)) {
  console.error(`usage: bun dev [docs|sb] [--no-open] [--kill]`);
  process.exit(1);
}
const procs = [...selected.flatMap((s) => allProcs[s]), ...allProcs.css];
const servers = selected.map((s) => allServers[s]);

// --- stale sessions ---

// A previous dev session left running (or orphaned) squats the portless routes and
// the proxy then serves the old code — kill anything of ours before starting.
function killStale(): number {
  const ps = Bun.spawnSync(['ps', '-eo', 'pid=,command=']).stdout.toString();
  const mine = new Set([process.pid, process.ppid]);
  let killed = 0;
  for (const line of ps.split('\n')) {
    const match = line.match(/^\s*(\d+)\s+(.*)/);
    if (!match) continue;
    const [, pid, command] = match;
    if (mine.has(Number(pid))) continue;
    if (!command.includes(`${root}/node_modules/.bin/`)) continue; // never touches the global proxy
    if (!/\.bin\/(portless|vite|storybook|tsdown|postcss|concurrently)/.test(command)) continue;
    try {
      process.kill(Number(pid), 'SIGTERM');
      killed++;
    } catch {}
  }
  return killed;
}

// --- process management ---

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
      SB_DISABLE_TELEMETRY: '1',
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

// --- prop tables ---

// Fingerprint of everything generate-props reads; when unchanged, skip the ~7s
// regeneration entirely. Count catches deletions, max-mtime catches edits.
function propsFingerprint(): string {
  let maxMtime = statSync(join(docsDir, 'scripts/generate-props.ts')).mtimeMs;
  let count = 0;
  for (const entry of readdirSync(join(frostedDir, 'src'), { recursive: true, withFileTypes: true })) {
    if (!entry.isFile()) continue;
    count++;
    const mtime = statSync(join(entry.parentPath, entry.name)).mtimeMs;
    if (mtime > maxMtime) maxMtime = mtime;
  }
  return `${count}:${maxMtime}`;
}

async function refreshProps() {
  const json = join(docsDir, 'src/generated/component-props.json');
  const stampFile = join(docsDir, 'src/generated/.props-stamp');
  const stamp = propsFingerprint();
  const fresh = existsSync(json) && existsSync(stampFile) && readFileSync(stampFile, 'utf8') === stamp;
  if (fresh) return;

  const generate = () =>
    new Promise<void>((done) => {
      spawn('bun', ['scripts/generate-props.ts'], { cwd: docsDir, stdio: 'ignore' }).on('exit', (code) => {
        if (code === 0) {
          writeFileSync(stampFile, stamp);
          if (!shuttingDown) console.log(`${c.green('✓')} ${c.bold('props')}     refreshed  ${c.dim(elapsed())}`);
        }
        done();
      });
    });

  // Block only when docs can't start without the JSON; otherwise refresh behind vite.
  if (!existsSync(json)) {
    console.log(c.dim('generating prop tables…'));
    await generate();
  } else {
    generate();
  }
}

// --- go ---

const stale = killStale();
if (killOnly) {
  console.log(stale ? `killed ${stale} stale dev process${stale === 1 ? '' : 'es'}` : 'no stale dev processes');
  process.exit(0);
}

console.log(`\n${c.bold('❄ frosted dev')}\n`);
if (stale) console.log(c.dim(`killed ${stale} stale dev process${stale === 1 ? '' : 'es'} from a previous session`));

// The apps import the built styles.css/theme.css; the watchers recreate them, but
// on a pristine checkout build once up-front so the very first request can't 404.
if (!existsSync(join(frostedDir, 'styles.css')) || !existsSync(join(frostedDir, 'theme.css'))) {
  console.log(c.dim('first run — building css…'));
  const build = Bun.spawnSync(['bun', 'run', 'build:css'], {
    cwd: frostedDir,
    stdio: ['ignore', 'inherit', 'inherit'],
  });
  if (build.exitCode !== 0) process.exit(build.exitCode);
}

if (selected.includes('docs')) await refreshProps();

procs.forEach(start);
Promise.all(servers.map(waitAndOpen)).then(() => {
  if (!shuttingDown) console.log(c.dim(`\nall ready in ${elapsed()} — ctrl-c to stop\n`));
});

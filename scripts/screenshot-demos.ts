/**
 * Screenshot every fixture in the cosmos — `bun run screenshot [options]`.
 *
 * There is one fixture per component (packages/frosted-ui/fixtures/<Component>.fixture.tsx) and
 * it renders every example of that component, so one screenshot covers the whole component.
 *
 * Fixtures are enumerated with the react-cosmos Node API, and each one is rendered isolated
 * via the vite renderer URL.
 * Driven by the `agent-browser` CLI (headless chromium over CDP), N sessions in parallel.
 * Starts `bun run dev` itself when cosmos isn't already up, and stops it again after.
 *
 * Options:
 *   --out <dir>          output directory (default: screenshots/)
 *   --url <base>         cosmos base url (default: $COSMOS_URL or https://frosted.localhost)
 *   --concurrency <n>    parallel browser sessions (default: cores - 2)
 *   --filter <substr>    only capture ids containing <substr>
 *   --shard <i>/<n>      capture only this slice of the work, for splitting across machines
 *   --static             serve packages/frosted-ui/cosmos-export as-is, without rebuilding
 *   --dev                use the dev server instead of the export
 *
 * By default the static export is used, rebuilt first when it is older than any source file —
 * serving files beats having vite transform every fixture.
 */
import { existsSync, mkdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { cpus } from 'node:os';
import { join, resolve } from 'node:path';
import { getCosmosConfigAtPath, getFixtures } from 'react-cosmos';

const root = resolve(import.meta.dir, '..');
const frostedDir = join(root, 'packages/frosted-ui');

const c = {
  dim: (s: string) => `\x1b[2m${s}\x1b[0m`,
  bold: (s: string) => `\x1b[1m${s}\x1b[0m`,
  green: (s: string) => `\x1b[32m${s}\x1b[0m`,
  red: (s: string) => `\x1b[31m${s}\x1b[0m`,
  cyan: (s: string) => `\x1b[36m${s}\x1b[0m`,
};

// ---------------------------------------------------------------- options

const argv = process.argv.slice(2);
const flag = (name: string, fallback?: string) => {
  const i = argv.indexOf(`--${name}`);
  return i === -1 ? fallback : argv[i + 1];
};

let base = (flag('url', process.env.COSMOS_URL ?? 'https://frosted.localhost') as string).replace(/\/$/, '');
const useStatic = argv.includes('--static');
const useDev = argv.includes('--dev');
const outDir = resolve(root, flag('out', 'screenshots') as string);
// Every worker is a chromium of its own competing with the vite dev server, so leave it cores.
const concurrency = Number(flag('concurrency', String(Math.max(2, cpus().length - 2))));
// `--filter foo --shard 1/4` = the ids matching `foo`, every 4th one, offset 1.
const substring = flag('filter');
const [shard, shards] = (flag('shard', '0/1') as string).split('/').map(Number);
const select = <T extends { id: string }>(items: T[]) =>
  items.filter(({ id }) => !substring || id.includes(substring)).filter((_, i) => i % shards! === shard!);

// ---------------------------------------------------------------- agent-browser

interface AbResult {
  ok: boolean;
  out: string;
}

/** Run one agent-browser command against a named session. */
async function ab(session: string, args: string[], timeoutMs = 60_000): Promise<AbResult> {
  const proc = Bun.spawn(['agent-browser', '--session', session, ...args], { stdout: 'pipe', stderr: 'pipe' });
  const timer = setTimeout(() => proc.kill(), timeoutMs);
  const out = await new Response(proc.stdout).text();
  await proc.exited;
  clearTimeout(timer);
  return { ok: proc.exitCode === 0, out: out.trim() };
}

/** `eval` prints its result JSON-encoded; strings come back double-encoded. */
async function evaluate(session: string, js: string): Promise<unknown> {
  const { ok, out } = await ab(session, ['eval', js]);
  if (!ok) return undefined;
  try {
    const value = JSON.parse(out);
    return typeof value === 'string' && /^[[{"]/.test(value) ? JSON.parse(value) : value;
  } catch {
    return undefined;
  }
}

/**
 * Resolves once the renderer has painted the fixture — polling in the page rather than
 * from bun, so waiting costs one round trip instead of one per poll. Every fixture is
 * wrapped in <Theme> by the cosmos decorators, so a `.frosted-ui` element in the DOM is
 * the "fixture actually mounted" signal; a vite error overlay is the failure signal.
 */
const READY = (timeoutMs = 20_000) => `(async () => {
  const deadline = Date.now() + ${timeoutMs};
  while (Date.now() < deadline) {
    if (document.querySelector('vite-error-overlay')) return 'error';
    const themeRoot = document.querySelector('.frosted-ui');
    if (themeRoot) {
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
      return 'ready';
    }
    await new Promise((r) => setTimeout(r, 25));
  }
  return 'timeout';
})()`;

// ---------------------------------------------------------------- cosmos

const probe = async () => {
  try {
    const res = await fetch(`${base}/cosmos.fixtures.json`, { tls: { rejectUnauthorized: false } });
    return res.ok;
  } catch {
    return false;
  }
};

const staticDir = join(frostedDir, 'cosmos-export');

/**
 * Serving an export beats the dev server on a full sweep — vite transforming modules costs
 * more than reading files. The catch was always staleness, so this is used automatically only
 * when the export is newer than every source file it was made from; otherwise we fall back to
 * the dev server. `--static` forces it regardless, `--dev` opts out.
 */
function staticExportIsFresh(): boolean {
  const index = join(staticDir, 'cosmos.fixtures.json');
  if (!existsSync(index)) return false;

  const builtAt = statSync(index).mtimeMs;
  const sources = new Bun.Glob('packages/frosted-ui/{src,demos,cosmos,fixtures}/**/*.{ts,tsx,css,json}');
  for (const file of sources.scanSync({ cwd: root, absolute: true })) {
    if (statSync(file).mtimeMs > builtAt) return false;
  }
  return true;
}

function serveStatic(): () => void {
  if (!existsSync(join(staticDir, 'cosmos.fixtures.json'))) {
    throw new Error(`no static export at ${staticDir} — run \`bun run build:cosmos\` first`);
  }
  const server = Bun.serve({
    port: 0,
    fetch: async (req) => {
      const path = new URL(req.url).pathname;
      const file = Bun.file(join(staticDir, path === '/' ? 'index.html' : path));
      return (await file.exists()) ? new Response(file) : new Response('not found', { status: 404 });
    },
  });
  base = `http://localhost:${server.port}`;
  console.log(c.dim(`serving ${staticDir} at ${base}`));
  return () => server.stop(true);
}

/** Serves the static export (building it first when stale); `--dev` opts into the dev server. */
async function ensureCosmos(): Promise<() => void> {
  if (useStatic) return serveStatic();
  if (!useDev) {
    if (staticExportIsFresh()) {
      console.log(
        c.dim('using the static export (up to date with src/, demos/, cosmos/ and fixtures/) — `--dev` to override'),
      );
      return serveStatic();
    }
    // Building costs seconds and the sweep then runs off files; screenshotting through the
    // dev server instead means vite transforms every fixture, and N parallel chromiums can
    // trigger a mid-session re-optimize that blanks the renderer for the rest of the run.
    console.log(c.dim('static export is stale — building it (bun run build:cosmos) …'));
    const built = Bun.spawnSync(['bun', 'run', 'build:cosmos'], { cwd: root, stdout: 'ignore', stderr: 'inherit' });
    if (built.exitCode === 0) return serveStatic();
    console.log(c.dim('build:cosmos failed — falling back to the dev server'));
  }
  if (await probe()) {
    console.log(c.dim(`cosmos already running at ${base}`));
    return () => {};
  }

  console.log(c.dim(`starting cosmos (bun run dev) …`));
  const dev = Bun.spawn(['bun', 'run', 'dev', '--no-open'], { cwd: root, stdout: 'ignore', stderr: 'ignore' });

  const deadline = Date.now() + 180_000;
  while (Date.now() < deadline) {
    await Bun.sleep(1000);
    if (await probe()) {
      console.log(c.dim(`cosmos up at ${base}`));
      // dev.ts's own children (portless, cosmos) outlive a kill of the wrapper, so tear the
      // whole session down the same way `bun run dev --kill` does.
      return () => {
        dev.kill();
        Bun.spawnSync(['bun', 'run', 'dev', '--kill'], { cwd: root, stdout: 'ignore', stderr: 'ignore' });
      };
    }
  }
  dev.kill();
  throw new Error(`cosmos never came up at ${base}`);
}

interface Target {
  id: string;
  url: string;
}

/**
 * Every fixture cosmos knows about. Only the renderer URL base is taken from the server's
 * /cosmos.fixtures.json; the fixtures themselves are enumerated in-process with the
 * react-cosmos Node API (bun runs the TSX natively).
 */
async function fixtureTargets(): Promise<Target[]> {
  const res = await fetch(`${base}/cosmos.fixtures.json`, { tls: { rejectUnauthorized: false } });
  const { rendererUrl } = (await res.json()) as { rendererUrl: string };
  const absoluteRendererUrl = new URL(rendererUrl, base).href;

  const config = await getCosmosConfigAtPath(join(frostedDir, 'cosmos.config.json'));
  const fixtures = await getFixtures(config, { rendererUrl: absoluteRendererUrl });

  // The tree is flat, so the path is just the component name: fixtures/Button → "Button".
  return fixtures.map((fixture) => {
    const id = fixture.treePath.filter((p) => p !== 'fixtures').join('-');
    return { id, url: `${fixture.rendererUrl}&locked=true` };
  });
}

// ---------------------------------------------------------------- capture

interface Shot {
  id: string;
  file: string;
}

const failures: string[] = [];
let done = 0;
let total = 0;

const progress = (id: string) => {
  done += 1;
  process.stdout.write(`\r${c.dim(`[${done}/${total}]`)} ${id.slice(0, 60).padEnd(60)}`);
};

/**
 * Each worker owns one browser session and loads fixtures through it. Cosmos runs in lazy
 * mode, so a load only transforms the fixture's own module graph; on a warmed dev server
 * (or the static export) that is fast enough to skip smarter swapping.
 */
async function capture(targets: Target[]): Promise<Shot[]> {
  const shots: Shot[] = [];
  const missed: Target[] = [];
  let next = 0;

  const shoot = async (session: string, target: Target) => {
    await ab(session, ['open', target.url]);
    const state = await evaluate(session, READY());
    const file = join(outDir, `${target.id}.png`);
    const shot = state === 'ready' ? await ab(session, ['screenshot', '--full', file]) : { ok: false };
    if (shot.ok) shots.push({ id: target.id, file: `${target.id}.png` });
    return shot.ok ? null : `${target.id} (${state ?? 'no response'})`;
  };

  await Promise.all(
    Array.from({ length: Math.min(concurrency, targets.length) }, async (_, worker) => {
      const session = `frosted-shot-${worker}`;

      while (next < targets.length) {
        const target = targets[next++]!;
        if (await shoot(session, target)) missed.push(target);
        progress(target.id);
      }
      await ab(session, ['close']);
    }),
  );

  // A dev server under N parallel chromiums can blank a renderer (a mid-session vite
  // re-optimize does it), which is transient — one serial retry recovers those rather
  // than leaving holes in the sweep.
  if (missed.length) {
    process.stdout.write(`\r${' '.repeat(72)}\r`);
    console.log(c.dim(`retrying ${missed.length} that didn't paint…`));
    total += missed.length;
    const session = 'frosted-shot-retry';
    for (const target of missed) {
      const failure = await shoot(session, target);
      if (failure) failures.push(failure);
      progress(target.id);
    }
    await ab(session, ['close']);
  }

  return shots;
}

// ---------------------------------------------------------------- gallery

/** A contact sheet, because a hundred pngs in a folder are no fun to review. */
function writeGallery(shots: Shot[]) {
  const grid = `
    <div class="grid">
      ${shots
        .map(
          (s) =>
            `<figure><a href="${s.file}"><img loading="lazy" src="${s.file}" alt="${s.id}"></a><figcaption>${s.id}</figcaption></figure>`,
        )
        .join('\n      ')}
    </div>`;

  writeFileSync(
    join(outDir, 'index.html'),
    `<!doctype html>
<meta charset="utf-8">
<title>frosted — fixture screenshots</title>
<style>
  body { font: 14px/1.5 system-ui, sans-serif; margin: 32px; background: #fafafa; color: #111; }
  h1 small { color: #888; font-weight: 400; }
  .grid { display: grid; gap: 16px; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); }
  figure { margin: 0; background: #fff; border: 1px solid #e4e4e7; border-radius: 10px; overflow: hidden; }
  /* Each shot is a full component gallery, so crop to the top rather than shrinking it away. */
  img { display: block; width: 100%; height: 260px; object-fit: cover; object-position: top; background: #fff; }
  figcaption { border-top: 1px solid #e4e4e7; padding: 6px 10px; font-size: 12px; color: #555; word-break: break-all; }
</style>
<h1>frosted — fixture screenshots <small>${shots.length}</small></h1>
${grid}
`,
  );
}

// ---------------------------------------------------------------- main

const startedAt = Date.now();
const stopCosmos = await ensureCosmos();

try {
  if (existsSync(outDir)) rmSync(outDir, { recursive: true });
  mkdirSync(outDir, { recursive: true });

  const targets = select(await fixtureTargets());
  total = targets.length;

  const shots = await capture(targets);
  writeGallery(shots);

  const seconds = ((Date.now() - startedAt) / 1000).toFixed(1);
  process.stdout.write(`\r${' '.repeat(72)}\r`);
  console.log(`${c.green('✓')} ${c.bold(`${shots.length} screenshots`)} in ${seconds}s`);
  console.log(`  ${c.cyan(join(outDir, 'index.html'))}`);
  if (failures.length) {
    console.log(c.red(`  ${failures.length} failed:`));
    for (const failure of failures.slice(0, 20)) console.log(c.dim(`    ${failure}`));
    if (failures.length > 20) console.log(c.dim(`    … and ${failures.length - 20} more`));
  }
} finally {
  stopCosmos();
}

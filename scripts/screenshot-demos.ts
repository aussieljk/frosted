/**
 * Screenshot every demo in the storybook — `bun run screenshot [options]`.
 *
 * Two kinds of "demo" live in this storybook, and both are captured:
 *   - stories   — every entry in storybook's index, rendered isolated in iframe.html
 *   - demos     — the registry in .storybook/demos, which only exists inside docs pages,
 *                 so they're captured off the Examples page one section at a time
 *
 * Driven by the `agent-browser` CLI (headless chromium over CDP), N sessions in parallel.
 * Starts `bun run dev` itself when storybook isn't already up, and stops it again after.
 *
 * Options:
 *   --out <dir>          output directory (default: screenshots/)
 *   --url <base>         storybook base url (default: $STORYBOOK_URL or https://frosted.localhost)
 *   --concurrency <n>    parallel browser sessions for stories (default: 6)
 *   --filter <substr>    only capture ids containing <substr>
 *   --only <kind>        `stories` or `demos`
 *   --shard <i>/<n>      capture only this slice of the work, for splitting across machines
 *   --static             serve packages/frosted-ui/storybook-static instead of the dev server
 */
import { existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { cpus } from 'node:os';
import { join, resolve } from 'node:path';

const root = resolve(import.meta.dir, '..');

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

let base = (flag('url', process.env.STORYBOOK_URL ?? 'https://frosted.localhost') as string).replace(/\/$/, '');
const useStatic = argv.includes('--static');
const outDir = resolve(root, flag('out', 'screenshots') as string);
// Every worker is a chromium of its own competing with the vite dev server, so leave it cores.
const concurrency = Number(flag('concurrency', String(Math.max(2, cpus().length - 2))));
const only = flag('only');
const wantStories = only !== 'demos';
const wantDemos = only !== 'stories';

// `--filter foo --shard 1/4` = the ids matching `foo`, every 4th one, offset 1.
const substring = flag('filter');
const [shard, shards] = (flag('shard', '0/1') as string).split('/').map(Number);
const select = (ids: string[]) =>
  ids.filter((id) => !substring || id.includes(substring)).filter((_, i) => i % shards! === shard!);

// The docs page the demo registry renders on, and the preview box inside each demo card.
const EXAMPLES_ID = 'examples--docs';
const PREVIEW = (id: string) => `section[id="${id}"] > div > div.frosted-ui`;

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
 * Resolves once storybook has rendered whatever the page was pointed at — polling in the page
 * rather than from bun, so waiting costs one round trip instead of one per poll.
 */
const READY = (timeoutMs = 20_000) => `(async () => {
  const deadline = Date.now() + ${timeoutMs};
  while (Date.now() < deadline) {
    const cls = document.body.classList;
    if (cls.contains('sb-show-errordisplay') || cls.contains('sb-show-nopreview')) return 'error';
    const roots = [...document.querySelectorAll('#storybook-root, #storybook-docs')];
    // Demos load lazily (see .storybook/components/demo.tsx), so a rendered docs page can still
    // be showing empty frames — wait for every one of them to resolve before calling it ready.
    const pending = document.querySelectorAll('[data-demo-pending]').length > 0;
    if (!pending && cls.contains('sb-show-main') && roots.some((root) => root.childElementCount > 0)) {
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
      return 'ready';
    }
    await new Promise((r) => setTimeout(r, 25));
  }
  return 'timeout';
})()`;

/**
 * Storybook can swap the rendered story over its own channel, which skips re-booting the whole
 * preview bundle for every id — the difference between ~1.5s and ~0.2s per screenshot. The hook
 * survives the swap because the preview never reloads; `open` is only used to boot the page.
 */
const INSTALL_HOOK = `(() => {
  const channel = window.__STORYBOOK_ADDONS_CHANNEL__;
  if (!channel) return 'no-channel';
  window.__shot = { rendered: null, failed: false };
  channel.on('storyRendered', (id) => { window.__shot.rendered = id; });
  channel.on('storyErrored', () => { window.__shot.failed = true; });
  channel.on('storyThrewException', () => { window.__shot.failed = true; });
  return 'ok';
})()`;

const SWITCH = (id: string, timeoutMs = 20_000) => `(async () => {
  const state = window.__shot;
  if (!state) return 'no-hook';
  state.rendered = null;
  state.failed = false;
  window.__STORYBOOK_ADDONS_CHANNEL__.emit('setCurrentStory', { storyId: ${JSON.stringify(id)}, viewMode: 'story' });
  const deadline = Date.now() + ${timeoutMs};
  while (Date.now() < deadline) {
    if (state.rendered === ${JSON.stringify(id)}) {
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
      return 'ready';
    }
    if (state.failed) return 'error';
    await new Promise((r) => setTimeout(r, 20));
  }
  return 'timeout';
})()`;

// ---------------------------------------------------------------- storybook

const probe = async () => {
  try {
    const res = await fetch(`${base}/index.json`, { tls: { rejectUnauthorized: false } });
    return res.ok;
  } catch {
    return false;
  }
};

/**
 * `--static` serves the last `bun run build-storybook` output instead of the dev server, which is
 * worth ~30% on a full sweep — vite transforming modules is a bigger cost than serving files. It
 * screenshots whatever that build contains, so it's opt-in rather than automatic.
 */
function serveStatic(): () => void {
  const dir = join(root, 'packages/frosted-ui/storybook-static');
  if (!existsSync(join(dir, 'index.json'))) {
    throw new Error(`no static build at ${dir} — run \`bun run build:storybook\` first`);
  }
  const server = Bun.serve({
    port: 0,
    fetch: async (req) => {
      const path = new URL(req.url).pathname;
      const file = Bun.file(join(dir, path === '/' ? 'index.html' : path));
      return (await file.exists()) ? new Response(file) : new Response('not found', { status: 404 });
    },
  });
  base = `http://localhost:${server.port}`;
  console.log(c.dim(`serving ${dir} at ${base}`));
  return () => server.stop(true);
}

/** Starts `bun run dev` when storybook isn't up; returns a teardown for that case only. */
async function ensureStorybook(): Promise<() => void> {
  if (useStatic) return serveStatic();
  if (await probe()) {
    console.log(c.dim(`storybook already running at ${base}`));
    return () => {};
  }

  console.log(c.dim(`starting storybook (bun run dev) …`));
  const dev = Bun.spawn(['bun', 'run', 'dev', '--no-open'], { cwd: root, stdout: 'ignore', stderr: 'ignore' });

  const deadline = Date.now() + 180_000;
  while (Date.now() < deadline) {
    await Bun.sleep(1000);
    if (await probe()) {
      console.log(c.dim(`storybook up at ${base}`));
      // dev.ts's own children (portless, storybook) outlive a kill of the wrapper, so tear the
      // whole session down the same way `bun run dev --kill` does.
      return () => {
        dev.kill();
        Bun.spawnSync(['bun', 'run', 'dev', '--kill'], { cwd: root, stdout: 'ignore', stderr: 'ignore' });
      };
    }
  }
  dev.kill();
  throw new Error(`storybook never came up at ${base}`);
}

/** Every story id storybook knows about, in sidebar order. */
async function storyIds(): Promise<string[]> {
  const index = (await (await fetch(`${base}/index.json`, { tls: { rejectUnauthorized: false } })).json()) as {
    entries: Record<string, { id: string; type: string }>;
  };
  return Object.values(index.entries)
    .filter((entry) => entry.type === 'story')
    .map((entry) => entry.id);
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
 * Each worker boots one preview page and then swaps stories through it, screenshotting full page
 * so nothing tall gets cropped. A swap that never renders falls back to a hard load of that story,
 * which also re-arms the hook if the page died under us.
 */
async function captureStories(ids: string[]): Promise<Shot[]> {
  const dir = join(outDir, 'stories');
  mkdirSync(dir, { recursive: true });

  const shots: Shot[] = [];
  let next = 0;

  await Promise.all(
    Array.from({ length: Math.min(concurrency, ids.length) }, async (_, worker) => {
      const session = `frosted-shot-${worker}`;
      let hooked = false;

      const load = async (id: string) => {
        await ab(session, ['open', `${base}/iframe.html?viewMode=story&id=${id}`]);
        const state = await evaluate(session, READY());
        hooked = state === 'ready' && (await evaluate(session, INSTALL_HOOK)) === 'ok';
        return state;
      };

      while (next < ids.length) {
        const id = ids[next++]!;
        let state = hooked ? await evaluate(session, SWITCH(id)) : 'no-hook';
        if (state !== 'ready') state = await load(id);

        const file = join(dir, `${id}.png`);
        const shot = state === 'ready' ? await ab(session, ['screenshot', '--full', file]) : { ok: false };
        if (shot.ok) shots.push({ id, file: `stories/${id}.png` });
        else failures.push(`${id} (${state ?? 'no response'})`);
        progress(id);
      }
      await ab(session, ['close']);
    }),
  );

  return shots;
}

/**
 * The registry demos only render inside docs pages, so the Examples page is loaded once and each
 * demo is isolated in turn — hiding its siblings puts the target near the top of the page, which
 * is where agent-browser's element clip is accurate.
 */
async function captureDemos(): Promise<Shot[]> {
  const dir = join(outDir, 'demos');
  mkdirSync(dir, { recursive: true });

  const session = 'frosted-shot-demos';
  await ab(session, ['open', `${base}/iframe.html?viewMode=docs&id=${EXAMPLES_ID}`]);
  // Tall enough that the isolated demo never runs past the viewport, where the element clip breaks.
  await ab(session, ['set', 'viewport', '1440', '1400']);
  if ((await evaluate(session, READY(60_000))) !== 'ready') {
    failures.push(`${EXAMPLES_ID} (docs page never rendered)`);
    await ab(session, ['close']);
    return [];
  }

  const ids = select(
    ((await evaluate(session, `JSON.stringify([...document.querySelectorAll('section[id]')].map((s) => s.id))`)) ??
      []) as string[],
  );
  total += ids.length;

  const shots: Shot[] = [];
  for (const id of ids) {
    await evaluate(
      session,
      `(async () => {
        for (const section of document.querySelectorAll('section[id]')) {
          section.style.display = section.id === ${JSON.stringify(id)} ? '' : 'none';
        }
        window.scrollTo(0, 0);
        await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
        return 'ok';
      })()`,
    );
    const file = join(dir, `${id}.png`);
    const shot = await ab(session, ['screenshot', PREVIEW(id), file]);
    if (shot.ok) shots.push({ id, file: `demos/${id}.png` });
    else failures.push(`demo:${id}`);
    progress(id);
  }

  await ab(session, ['close']);
  return shots;
}

// ---------------------------------------------------------------- gallery

/** A contact sheet, because 600 pngs in a folder are no fun to review. */
function writeGallery(groups: { title: string; shots: Shot[] }[]) {
  const section = ({ title, shots }: { title: string; shots: Shot[] }) => `
    <h2>${title} <small>${shots.length}</small></h2>
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
<title>frosted — demo screenshots</title>
<style>
  body { font: 14px/1.5 system-ui, sans-serif; margin: 32px; background: #fafafa; color: #111; }
  h2 { margin-top: 40px; } h2 small { color: #888; font-weight: 400; }
  .grid { display: grid; gap: 16px; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); }
  figure { margin: 0; background: #fff; border: 1px solid #e4e4e7; border-radius: 10px; overflow: hidden; }
  img { display: block; width: 100%; height: 180px; object-fit: contain; background: #fff; }
  figcaption { border-top: 1px solid #e4e4e7; padding: 6px 10px; font-size: 12px; color: #555; word-break: break-all; }
</style>
<h1>frosted — demo screenshots</h1>
${groups
  .filter((g) => g.shots.length)
  .map(section)
  .join('\n')}
`,
  );
}

// ---------------------------------------------------------------- main

const startedAt = Date.now();
const stopStorybook = await ensureStorybook();

try {
  if (existsSync(outDir)) rmSync(outDir, { recursive: true });
  mkdirSync(outDir, { recursive: true });

  const ids = wantStories ? select(await storyIds()) : [];
  total += ids.length;

  const demos = wantDemos ? await captureDemos() : [];
  const stories = ids.length ? await captureStories(ids) : [];

  writeGallery([
    { title: 'Demos', shots: demos },
    { title: 'Stories', shots: stories },
  ]);

  const seconds = ((Date.now() - startedAt) / 1000).toFixed(1);
  process.stdout.write(`\r${' '.repeat(72)}\r`);
  console.log(
    `${c.green('✓')} ${c.bold(`${demos.length + stories.length} screenshots`)} in ${seconds}s ` +
      c.dim(`(${demos.length} demos, ${stories.length} stories)`),
  );
  console.log(`  ${c.cyan(join(outDir, 'index.html'))}`);
  if (failures.length) {
    console.log(c.red(`  ${failures.length} failed:`));
    for (const failure of failures.slice(0, 20)) console.log(c.dim(`    ${failure}`));
    if (failures.length > 20) console.log(c.dim(`    … and ${failures.length - 20} more`));
  }
} finally {
  stopStorybook();
}

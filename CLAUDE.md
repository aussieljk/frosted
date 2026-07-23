# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build/Lint Commands

### Monorepo

- **Install**: `bun install`
- **Dev server**: `bun run dev [--no-open] [--kill]` (`scripts/dev.ts`; react-cosmos through [portless](https://www.npmjs.com/package/portless), opens Safari when ready; `--kill` clears stale sessions)
- **Build**: `bun run build --filter=<app>`
- **Lint**: `bun run lint --filter=<app>`
- **Typecheck**: `bun run typecheck` (turbo, all packages; TypeScript 7)
- **Full check**: `bun run check` (lint, typecheck, build, publint, attw)
- **Screenshot every fixture**: `bun run screenshot [--static] [--out <dir>] [--filter <substr>] [--concurrency <n>] [--shard <i>/<n>]` (`scripts/screenshot-demos.ts`; headless via the `agent-browser` CLI, starts cosmos itself if it isn't running, writes `screenshots/` + a contact-sheet `index.html`). One shot per component, since a fixture page holds every example. `--static` serves the last `build:cosmos` export instead of the dev server (faster, but only as fresh as that build); `--shard` splits the work across machines.
- **Scaffold a component**: `bun run new:component <kebab-name> [--namespace] [--no-docs]` (`--no-docs` skips the usage demo)
- **Env problems**: `bun run doctor [--fix]` (stale nested node_modules, bun version)

### Dev URL (portless — no port numbers)

The react-cosmos playground is the only site; it runs from this laptop under the `frosted.localhost` tenant:

- **Cosmos playground**: <https://frosted.localhost> (`packages/frosted-ui`)
- **Renderer iframe**: <https://frosted-renderer.localhost> — a static portless alias to the vite dev server on 5050 (port pinned in `cosmos.config.json`, alias re-registered by `dev.ts` on every boot). Both URLs must be https: Safari (unlike Chrome) blocks plain-http `localhost` iframes inside an https page. Because the renderer sits behind the TLS proxy, `vite.config.ts` points the HMR websocket at `wss://…:443` — same trick the storybook config needed.

### The package (`@aussieljk/frosted`, in `packages/frosted-ui`)

- **Build**: `bun run --filter="@aussieljk/frosted" build`
- **Lint**: `bun run --filter="@aussieljk/frosted" lint`
- **Cosmos (standalone)**: `bun run --filter="@aussieljk/frosted" cosmos`
- **Static export**: `bun run build:cosmos` (from the root; writes `packages/frosted-ui/cosmos-export`)

## Code Style Guidelines

- **TypeScript**: Strict typing, ES2020 modules, 120 char line width, 2-space indentation
- **React**: Functional components with hooks, JSX format
- **CSS**: Tailwind CSS v4, PostCSS with nesting/custom media/imports
- **Formatting**: Single quotes, semicolons required, trailing commas in multiline
- **Project**: Bun workspaces with Turborepo (`packages/*`, `tools/*`), Vite everywhere (no Next.js, no tests, no CI)
- **Commits**: Semantic commit messages (feat, fix, docs, style, refactor, perf, test, chore)
- **Quality**: oxlint for linting (root `.oxlintrc.json`), oxfmt for formatting (`bun run format`; lefthook pre-commit runs both on staged files), react-cosmos for the component workbench

## Publishing

The main package publishes to npm as `@aussieljk/frosted` (see `packages/frosted-ui`). Publishing happens locally from this laptop, and there is no CI/CD.

**The version stays on 0.0.1 forever.** Every release is a prerelease of it — `0.0.1-1`, `0.0.1-2`, … — so the patch number never reaches 0.0.2. To release, from `packages/frosted-ui`:

```sh
bun run release   # npm version prerelease --no-git-tag-version && npm publish --tag latest
```

`bun run prod` (from the root, `scripts/prod.ts`) is the full pipeline: refuses to run on a dirty tree, then `release` (bump + publish), commits and pushes the version bump, then `vercel --prod` (deploys the cosmos export per root `vercel.json`).

`--tag latest` is required: npm refuses to publish a prerelease to the default tag, and without it `latest` would never move, so plain `bun add @aussieljk/frosted` would fail to resolve.

`prepublishOnly` runs `scripts/check-version.ts` (hard-fails on any version that isn't `0.0.1-<n>`), then lint + build.

Never publish a plain `0.0.1`: it outranks every later `0.0.1-N`, and `^0.0.1` ranges don't match prereleases, so consumers would be stuck on that one release. Installing normally (`bun add @aussieljk/frosted`) resolves the `latest` dist-tag and records `^0.0.1-N`, which does pick up subsequent `0.0.1-N` releases.

## Cosmos (component workbench)

- **The sidebar is a flat list of components, and there is no nesting.** One fixture file per component in `packages/frosted-ui/fixtures/<name>.fixture.tsx`, each default-exporting a single `<Gallery>` element that renders *every* example of that component on one page. Keep it that way: cosmos builds the sidebar from file paths, so a subdirectory under `fixtures/` (or a second fixture file for one component) re-introduces a tree node, and a default-exported *object* re-introduces per-variant sub-nodes.
- **How a fixture page is put together**: `const examples = { Name() {…}, Other: <X /> }` (function or element values both work) plus the component's usage demo, handed to `<Gallery examples={examples} demo={Demo} />` (`cosmos/Gallery.tsx`), which labels each section and rules a line between them. The demo leads, then the examples in declared order.
- **Usage demos live in `packages/frosted-ui/demos/<name>.demo.tsx`** and import from `@aussieljk/frosted` (aliased to `src/` in `vite.config.ts`) because their source is meant to be copy-pasteable. The `.demo.tsx` suffix keeps cosmos from indexing them as fixtures of their own — they reach the playground only through the component's Gallery. `demos/icons.demo.tsx` and `demos/layout.demo.tsx` have no component of their own, so `fixtures/icons.fixture.tsx` / `fixtures/layout.fixture.tsx` render the demo alone.
- **`cosmos.config.json` runs `lazy: true`** deliberately — eager mode imports every fixture (and therefore the whole library) into the renderer on first load, which is exactly the slow-boot problem the old setup was tuned to avoid.
- **No prop controls.** Fixtures render fixed examples; the props panel holds only the decorator's theme selects. A generated prop table (`cosmos/controls.ts` + `tools/props-gen`) used to seed one cosmos input per prop; it was deleted along with the controls-driven fixtures — restore it from git history if the playground ever wants live props again.
- **Theme/accent/gray selects** on every fixture come from the shared decorator (`cosmos/ThemeDecorator.tsx`, wired via `fixtures/cosmos.decorator.tsx`), which also mounts the `Toaster`. Global CSS enters through `globalImports` in `cosmos.config.json` → `cosmos/preview.css` (tailwind + built `styles.css` + `theme.css` — the dev script keeps both watched).
- **`index.html` at the package root is the cosmos renderer template** — the vite plugin rewrites its script tag to a virtual entry at serve time; the `/src/main.tsx` reference in it is never actually resolved.
- **Enumerate fixtures programmatically** with `getFixtures()` from `react-cosmos` (bun runs the TSX imports natively) — that's how `scripts/screenshot-demos.ts` gets its list; the dev server's `/cosmos.fixtures.json` only carries the renderer URL base.

## Sharp Edges

Non-obvious constraints — breaking any of these fails silently or in confusing ways:

- **`scripts/fix-namespace-exports.ts` must run after every tsdown build** (wired into `build:js`). Rolldown lowers `export * as Tabs` into materialized getter objects, which break React Server Components (`<Tabs.Root>` renders undefined: "Element type is invalid … got: undefined").
- **Dev never builds or watches `dist/`** — cosmos reads `src/` natively, and `vite.config.ts` aliases `@aussieljk/frosted` (and `/icons/*`) to `src/` so demo source can name the public package. Only the postcss watchers (`styles.css`, `theme.css`) run during dev. If you change the package's public entry points, check those aliases still cover them.
- **`sideEffects` in `packages/frosted-ui/package.json` must stay `["./dist/icons/adapters/*"]`**, not `false`. The icon adapter subpaths (`@aussieljk/frosted/icons/lucide` etc.) register themselves on import; `sideEffects: false` silently tree-shakes them.
- **TypeScript 7 (native compiler) is the repo default**, and it has no JS compiler API — anything needing it (the old `tools/props-gen`, now deleted) has to scope its own classic-TS pin in a workspace of its own.
- **`.stylelintrc.js` must stay `.js`** — stylelint's TS config loader calls classic-TS APIs that the TS7 native compiler doesn't export.
- **`src/styles/tokens/tailwind-color.css` is hand-maintained runtime CSS** (per-palette oklch seeds + `:where()` blocks computing all 12 steps via color-mix/relative color syntax). There is no generator anymore; edit it by hand. Tailwind palettes are prefixed `tw-` (`tw-indigo`) to coexist with the Radix scales.
- **Icon adapters in `src/icons/adapters/` are generated** — edit `scripts/icon-map.ts` and run `bun run generate:icon-adapters`; never edit the adapters directly.
- **`lucide-react` is v1.x** — the adapter uses v1 names (`House`, `Funnel`, `TriangleAlert`); pre-1.0 aliases like `Home` no longer exist despite the permissive peer range.
- **The vite renderer must dep-optimize in one pass** — `vite.config.ts` lists the fixture globs as `optimizeDeps.entries` and the full react-aria surface in `include`; a dep discovered mid-session forces a re-optimize that leaves two copies of react-aria's focus-visible global in the page ("Illegal invocation", blank renderer). The same reason `resolve.dedupe` is set.
- **`react-cosmos-plugin-vite` is patched** (`patches/`, wired via `patchedDependencies`): upstream derives the vite port from `rendererUrl`, which breaks when the rendererUrl is a reverse-proxied https URL with no explicit port — the patch falls back to `vite.port` from `cosmos.config.json`. Bumping the cosmos version requires re-checking the patch still applies.
- **If something is mysteriously broken, run `bun run doctor`** — under the hoisted linker, stale nested `packages/*/node_modules` dirs from older installs can shadow the root binaries (a package silently using an ancient `tsc`). `doctor --fix` deletes them.

## History

The repo used Storybook (docs site + stories) until 2026-07-23. The authored MDX docs pages are archived under `packages/frosted-ui/docs/` (no longer rendered by anything), and `packages/frosted-ui/docs/WHAT-WE-LOST-DROPPING-STORYBOOK.md` records exactly what the migration to react-cosmos gave up.

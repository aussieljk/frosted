# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build/Lint Commands

### Monorepo

- **Install**: `bun install`
- **Dev server**: `bun run dev` — runs the docs site (`@aussieljk/docs`, `vite dev` on port 3000). The library is consumed as a built package, so build it first (`bun run build --filter=@aussieljk/frosted`) or run `turbo` which orders it for you.
- **Build**: `bun run build --filter=<app>`
- **Lint**: `bun run lint --filter=<app>`
- **Typecheck**: `bun run typecheck` (turbo for the packages, then root `tsconfig.json` for `scripts/` + `ci/`; TypeScript 7)
- **Full check**: `bun run check` — everything CI runs (workflows in sync, format, lint, typecheck, build, publint, attw)
- **Format**: `bun run format` / `bun run format:check` (oxfmt, JS/TS only — oxfmt would otherwise rewrite the generated workflow YAML and the markdown)
- **Regenerate the workflows**: `bun run workflows` (see [CI/CD](#cicd))
- **Scaffold a component**: `bun run new:component <kebab-name> [--namespace] [--no-docs]` (`--no-docs` skips the usage demo; generates the component files + a docs page in `packages/docs`)
- **Env problems**: `bun run doctor [--fix]` (stale nested node_modules, bun version)

### The library (`@aussieljk/frosted`, in `packages/frosted-ui`)

- **Build**: `bun run --filter="@aussieljk/frosted" build`
- **Lint**: `bun run --filter="@aussieljk/frosted" lint`

The library ships no site of its own — it's built (tsdown + postcss) and consumed by the docs app.

## Code Style Guidelines

- **TypeScript**: Strict typing, ES2020 modules, 120 char line width, 2-space indentation
- **React**: Functional components with hooks, JSX format
- **CSS**: Tailwind CSS v4, PostCSS with nesting/custom media/imports
- **Formatting**: Single quotes, semicolons required, trailing commas in multiline
- **Project**: Bun workspaces with Turborepo (`packages/*`), Vite everywhere (no Next.js, no tests)
- **Commits**: Semantic commit messages (feat, fix, docs, style, refactor, perf, test, chore)
- **Quality**: oxlint for linting (root `.oxlintrc.json`), oxfmt for formatting (`bun run format`; lefthook pre-commit runs both on staged files), Fumadocs (TanStack Start) for the docs site

## Publishing

The main package publishes to npm as `@aussieljk/frosted` (see `packages/frosted-ui`). Releases normally run from the **Release** workflow (Actions → Release → Run workflow); `bun run prod` does the same thing from this laptop.

**The version stays on 0.0.1 forever.** Every release is a prerelease of it — `0.0.1-1`, `0.0.1-2`, … — so the patch number never reaches 0.0.2. To release, from `packages/frosted-ui`:

```sh
bun run release   # npm version prerelease --no-git-tag-version && npm publish --tag latest
```

The pipeline is two root scripts, shared by `bun run prod` and the Release workflow so there is only one implementation:

- `scripts/release.ts` — refuses a dirty tree, writes `~/.npmrc` from `NPM_TOKEN` when running in CI, runs the package's `release` (bump + publish), refreshes `bun.lock` (**it records the workspace version** — skip this and the next `bun install --frozen-lockfile` fails in CI), commits and pushes.
- `scripts/deploy.ts` — `vercel pull` / `build` / `deploy --prebuilt`, so the site is built on the runner rather than by Vercel. Production with `--prod` or on a master push; otherwise a preview whose URL it comments on the PR.

`--tag latest` is required: npm refuses to publish a prerelease to the default tag, and without it `latest` would never move, so plain `bun add @aussieljk/frosted` would fail to resolve.

`prepublishOnly` runs `scripts/check-version.ts` (hard-fails on any version that isn't `0.0.1-<n>`), then lint + build.

Never publish a plain `0.0.1`: it outranks every later `0.0.1-N`, and `^0.0.1` ranges don't match prereleases, so consumers would be stuck on that one release. Installing normally (`bun add @aussieljk/frosted`) resolves the `latest` dist-tag and records `^0.0.1-N`, which does pick up subsequent `0.0.1-N` releases.

## CI/CD

**The workflows are written in TypeScript, not YAML.** `ci/workflows.ts` is the source; `bun run workflows` renders it to `.github/workflows/*.yml`, and CI fails if the YAML on disk has drifted (`bun run workflows:check`, the first step of the check job). Never hand-edit a file under `.github/workflows` — it will be overwritten, and the generator deletes any `.yml` there that isn't in the `workflows` map.

- `ci/dsl.ts` — the typed subset of the Actions schema, the step builders, and the YAML renderer (`Bun.YAML.stringify`, no dependency).
- `ci/workflows.ts` — the two workflows.
- `ci/generate.ts` — `bun run workflows` / `bun run workflows:check`.

Keep every `run:` a single line: Bun's YAML writer emits multi-line strings as quoted scalars with `\n` escapes instead of `|` blocks. Anything longer belongs in a `scripts/*.ts`, which is the point — the workflows stay a list of named one-liners and the logic is typechecked TypeScript.

**Workflows**

- **CI** — every PR and every push to master. `check` job: workflows-in-sync, format, lint, typecheck, build (turbo builds the library and the docs site), package health (publint + attw). Then `deploy`: preview on PRs (URL commented on the PR), production on master.
- **Release** — manual `workflow_dispatch` on master, with a `deploy` input. Runs `bun run check`, then `scripts/release.ts` and `scripts/deploy.ts --prod`.

**Runners are [Blacksmith](https://docs.blacksmith.sh/blacksmith-runners/overview)** (`blacksmith-4vcpu-ubuntu-2404`) — a drop-in `runs-on` swap. Blacksmith serves the stock `actions/cache` from a colocated cache, so there is nothing vendor-specific in the workflows and `actions/*` stays upstream. `Runner` in `ci/dsl.ts` types the full label set. `actionlint` flags these labels as unknown; that's expected.

**Except the release job, which runs on `ubuntu-latest` on purpose.** npm's trusted publishing only accepts cloud-hosted runners, and Blacksmith registers its boxes through GitHub's org-level *self-hosted* runner API — so an OIDC token minted on a Blacksmith runner is refused by the registry. Releases are manual and rare, so the slower runner costs nothing. Don't "unify" `RELEASE_RUNNER` with `RUNNER`.

**npm auth is trusted publishing (OIDC) — there is no npm token anywhere.** The release job's `id-token: write` mints an OIDC token that npm trades for short-lived, scoped publish rights, and provenance is attached automatically (public repo + public package). It is configured on npmjs.com under the package's Settings → Trusted publisher: org `ljknight-com`, repo `frosted`, workflow `release.yml`, no environment. Consequences worth knowing:

- **Never set `NODE_AUTH_TOKEN` in the release job** — npm would quietly take the legacy token path and skip trusted publishing. `release.ts` hard-fails if it sees one.
- Needs npm ≥ 11.5.1 and node ≥ 22.14.0, hence `setup-node` with node 24 (which ships npm 11). `release.ts` re-checks and self-upgrades npm as a backstop.
- The workflow **filename** is part of the trust config. Renaming `release.yml` breaks publishing until npmjs.com is updated to match.
- `repository.url` in the package must match the GitHub repo exactly, or provenance fails.
- Local `bun run prod` is unaffected — it publishes with your `npm login` session.

**Secrets** (Settings → Secrets and variables → Actions):

| Secret | Where it comes from |
| --- | --- |
| `VERCEL_TOKEN` | <https://vercel.com/account/tokens> |
| `VERCEL_ORG_ID` | `orgId` in `.vercel/project.json` (gitignored, so it has to be a secret) |
| `VERCEL_PROJECT_ID` | `projectId` in `.vercel/project.json` |

A PR from a fork has no secrets, so `deploy.ts` skips with a warning instead of failing.

The release commit is pushed with `GITHUB_TOKEN`, whose pushes deliberately do not trigger further workflow runs — so a release does not kick off a second CI + production deploy.

## Docs site (`packages/docs` — Fumadocs on TanStack Start)

The docs site is the only site: Fumadocs (`@fumadocs/base-ui` theme — a natural fit since the library is built on Base UI) running on TanStack Start (Vite), deployed to Vercel via nitro's `vercel` preset (`.vercel/output`, Build Output API). It consumes the **built** `@aussieljk/frosted` package (not `src/`), so a demo renders exactly what a consumer copy-pastes.

- **Content is MDX in `content/docs/`.** `index.mdx` is Getting Started; `guides/*` are the prose guides (ordered by `guides/meta.json`); `components/*` is one page per component (ordered by `components/meta.json`). Top-level order is `content/docs/meta.json`.
- **`<Demo name="...">`** (`src/components/demo.tsx`) renders a live demo from `packages/frosted-ui/demos/<name>.demo.tsx`, wrapped in `<Theme>`, with copy-paste source. The registry (`src/demos/registry.ts`) auto-discovers every demo via `import.meta.glob` (aliased `@demos` → the package's `demos/`), so a new demo needs no wiring. Previews render **client-only** — many components touch browser globals (CSS.supports, portals) that throw during prerender.
- **Component pages are generated** from the demos: `bun run scripts/gen-component-pages.ts` (idempotent — only creates missing pages, so hand-authored ones like `button.mdx` survive). The demos are the source of truth for the current API; the archived Storybook MDX under `packages/frosted-ui/docs/` describes an older, drifted API.
- **Prop tables** (`<PropsTable component="...">`, Fumadocs `TypeTable`) read `src/generated/props.json`, produced by `bun run scripts/gen-props.ts`. That generator **imports each `*.props.ts` at runtime** (bun runs the TS natively) — no TypeScript compiler API, so it sidesteps the TS7-native limitation that killed the old `tools/props-gen`. Descriptions come from a regex over the source (following one re-export hop). `props.json` is committed; re-run after prop changes. `<PropsTable>` resolves names hyphen/case-insensitively (`HStack`, `IconButton`, `Theme`).
- **`llms.txt` / `llms-full.txt` / per-page `.md`** and Orama search come from the template routes (`src/routes/`), so the machine-readable docs artifact is served again.
- **`routeTree.gen.ts` is committed** (TanStack generates it; `tsc` needs it), and `.source` (fumadocs-mdx) is gitignored — regenerated by the `postinstall` (`fumadocs-mdx`) and the vite `mdx()` plugin.

## Sharp Edges

Non-obvious constraints — breaking any of these fails silently or in confusing ways:

- **`scripts/fix-namespace-exports.ts` must run after every tsdown build** (wired into `build:js`). Rolldown lowers `export * as Tabs` into materialized getter objects, which break React Server Components (`<Tabs.Root>` renders undefined: "Element type is invalid … got: undefined").
- **The docs site consumes the *built* package** — `bun run dev` (the docs `vite dev`) resolves `@aussieljk/frosted` to `dist/`, so build the library first (or let turbo order it). Unlike the old cosmos setup there is no `src/` alias; changing the package's public entry points means rebuilding before the docs pick them up.
- **`sideEffects` in `packages/frosted-ui/package.json` must stay `["./dist/icons/adapters/*"]`**, not `false`. The icon adapter subpaths (`@aussieljk/frosted/icons/lucide` etc.) register themselves on import; `sideEffects: false` silently tree-shakes them.
- **TypeScript 7 (native compiler) is the library default**, and it has no JS compiler API — anything needing it can't use the library's `tsc`. The docs prop generator works around this by importing the `*.props.ts` at *runtime* under bun rather than parsing them (see the Docs site section). The docs package pins its own classic TypeScript for `tsc --noEmit`.
- **`.stylelintrc.js` must stay `.js`** — stylelint's TS config loader calls classic-TS APIs that the TS7 native compiler doesn't export.
- **`src/styles/tokens/tailwind-color.css` is hand-maintained runtime CSS** (per-palette oklch seeds + `:where()` blocks computing all 12 steps via color-mix/relative color syntax). There is no generator anymore; edit it by hand. Tailwind palettes are prefixed `tw-` (`tw-indigo`) to coexist with the Radix scales.
- **Icon adapters in `src/icons/adapters/` are generated** — edit `scripts/icon-map.ts` and run `bun run generate:icon-adapters`; never edit the adapters directly.
- **`lucide-react` is v1.x** — the adapter uses v1 names (`House`, `Funnel`, `TriangleAlert`); pre-1.0 aliases like `Home` no longer exist despite the permissive peer range.
- **Demo previews are client-only** (`src/components/demo.tsx` gates on a mounted flag). Many frosted components touch browser globals (`CSS.supports`, portals, `ResizeObserver`) that throw under SSR/prerender, so the page shell prerenders but the live preview waits for mount. Don't "optimize" this by rendering the demo during SSR — the prerender will start erroring again.
- **If something is mysteriously broken, run `bun run doctor`** — under the hoisted linker, stale nested `packages/*/node_modules` dirs from older installs can shadow the root binaries (a package silently using an ancient `tsc`). `doctor --fix` deletes them.

## History

The repo used Storybook (docs site + stories) until 2026-07-23, then react-cosmos (a component workbench, no docs site) until 2026-07-24, when it moved to the current Fumadocs docs site and **removed react-cosmos entirely** — fixtures, cosmos config, the screenshot pipeline, and `scripts/dev.ts` all went with it. The archived Storybook MDX under `packages/frosted-ui/docs/` (including `WHAT-WE-LOST-DROPPING-STORYBOOK.md`) describes an older API and is kept for reference only; the docs are now generated from the demos + `*.props.ts`.

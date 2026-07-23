# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build/Lint Commands

### Monorepo

- **Install**: `bun install`
- **Dev server**: `bun run dev [--no-open] [--kill]` (`scripts/dev.ts`; storybook through [portless](https://www.npmjs.com/package/portless), opens Safari when ready; `--kill` clears stale sessions)
- **Build**: `bun run build --filter=<app>`
- **Lint**: `bun run lint --filter=<app>`
- **Typecheck**: `bun run typecheck` (turbo, all packages; TypeScript 7)
- **Full check**: `bun run check` (lint, typecheck, build, publint, attw)
- **Screenshot every demo**: `bun run screenshot [--static] [--out <dir>] [--only stories|demos] [--filter <substr>] [--concurrency <n>] [--shard <i>/<n>]` (`scripts/screenshot-demos.ts`; headless via the `agent-browser` CLI, starts storybook itself if it isn't running, writes `screenshots/` + a contact-sheet `index.html`). ~600 shots in ~1 min on an idle laptop. `--static` serves the last `build:storybook` output instead of the dev server (~30% faster, but only as fresh as that build); `--shard` splits the work across machines.
- **Scaffold a component**: `bun run new:component <kebab-name> [--namespace] [--no-docs]`
- **Regenerate prop tables**: `bun run generate:props` (also runs automatically from `bun run dev`)
- **Env problems**: `bun run doctor [--fix]` (stale nested node_modules, bun version)

### Dev URL (portless — no port numbers)

Storybook is the only site; it runs from this laptop under the `frosted.localhost` tenant:

- **Storybook**: <https://frosted.localhost> (`packages/frosted-ui`)
- **Machine-readable docs**: <https://frosted.localhost/llms.txt> and `/llms-full.txt`

### The package (`@aussieljk/frosted`, in `packages/frosted-ui`)

- **Build**: `bun run --filter="@aussieljk/frosted" build`
- **Lint**: `bun run --filter="@aussieljk/frosted" lint`
- **Storybook**: `bun run --filter="@aussieljk/frosted" storybook`

## Code Style Guidelines

- **TypeScript**: Strict typing, ES2020 modules, 120 char line width, 2-space indentation
- **React**: Functional components with hooks, JSX format
- **CSS**: Tailwind CSS v4, PostCSS with nesting/custom media/imports
- **Formatting**: Single quotes, semicolons required, trailing commas in multiline
- **Project**: Bun workspaces with Turborepo (`packages/*`, `tools/*`), Vite everywhere (no Next.js, no tests, no CI)
- **Commits**: Semantic commit messages (feat, fix, docs, style, refactor, perf, test, chore)
- **Quality**: oxlint for linting (root `.oxlintrc.json`), oxfmt for formatting (`bun run format`; lefthook pre-commit runs both on staged files), Storybook for component docs

## Publishing

The main package publishes to npm as `@aussieljk/frosted` (see `packages/frosted-ui`). Publishing happens locally from this laptop, and there is no CI/CD.

**The version stays on 0.0.1 forever.** Every release is a prerelease of it — `0.0.1-1`, `0.0.1-2`, … — so the patch number never reaches 0.0.2. To release, from `packages/frosted-ui`:

```sh
bun run release   # npm version prerelease --no-git-tag-version && npm publish --tag latest
```

`--tag latest` is required: npm refuses to publish a prerelease to the default tag, and without it `latest` would never move, so plain `bun add @aussieljk/frosted` would fail to resolve.

`prepublishOnly` runs `scripts/check-version.ts` (hard-fails on any version that isn't `0.0.1-<n>`), then lint + build.

Never publish a plain `0.0.1`: it outranks every later `0.0.1-N`, and `^0.0.1` ranges don't match prereleases, so consumers would be stuck on that one release. Installing normally (`bun add @aussieljk/frosted`) resolves the `latest` dist-tag and records `^0.0.1-N`, which does pick up subsequent `0.0.1-N` releases.

## Sharp Edges

Non-obvious constraints — breaking any of these fails silently or in confusing ways:

- **`scripts/fix-namespace-exports.ts` must run after every tsdown build** (wired into `build:js`). Rolldown lowers `export * as Tabs` into materialized getter objects, which break React Server Components (`<Tabs.Root>` renders undefined: "Element type is invalid … got: undefined").
- **Dev never builds or watches `dist/`** — storybook reads `src/` natively, and `.storybook/main.ts` aliases `@aussieljk/frosted` (and `/icons/*`) to `src/` so demo source can name the public package. Only the postcss watchers (`styles.css`, `theme.css`) run during dev. If you change the package's public entry points, check those aliases still cover them.
- **`sideEffects` in `packages/frosted-ui/package.json` must stay `["./dist/icons/adapters/*"]`**, not `false`. The icon adapter subpaths (`@aussieljk/frosted/icons/lucide` etc.) register themselves on import; `sideEffects: false` silently tree-shakes them.
- **TypeScript 7 (native compiler) is the repo default**, and it has no JS compiler API. `tools/props-gen` exists solely to scope a classic-TS pin (`typescript@6`) for prop-table generation, which needs the compiler API. Don't "clean up" that package or its nested `node_modules/typescript` — `doctor.ts` allowlists it deliberately.
- **`.stylelintrc.js` must stay `.js`** — stylelint's TS config loader calls classic-TS APIs that the TS7 native compiler doesn't export.
- **`src/styles/tokens/tailwind-color.css` is hand-maintained runtime CSS** (per-palette oklch seeds + `:where()` blocks computing all 12 steps via color-mix/relative color syntax). There is no generator anymore; edit it by hand. Tailwind palettes are prefixed `tw-` (`tw-indigo`) to coexist with the Radix scales.
- **Icon adapters in `src/icons/adapters/` are generated** — edit `scripts/icon-map.ts` and run `bun run generate:icon-adapters`; never edit the adapters directly.
- **`lucide-react` is v1.x** — the adapter uses v1 names (`House`, `Funnel`, `TriangleAlert`); pre-1.0 aliases like `Home` no longer exist despite the permissive peer range.
- **Docs demos live in the registry** (`packages/frosted-ui/.storybook/demos/index.ts`), consumed by both the `Examples` page and per-page `<Demo id>` blocks — add demos there, never inline them in MDX. Demos import from `@aussieljk/frosted` (aliased to `src/` in `.storybook/main.ts`) because their source is shown to users verbatim. **A demo's id must equal its filename** — the registry is metadata only (`id` + `title`) and resolves `./<id>.tsx` lazily via `import.meta.glob`. Importing all 80 eagerly dragged the whole library into every docs page. Anything that screenshots a docs page must wait for `[data-demo-pending]` to disappear (`scripts/screenshot-demos.ts` does).
- **A component with an authored MDX docs page must set `tags: ['!autodocs']`** in its story meta. `.storybook/stories/components/<name>.mdx` attaches via `<Meta of={…Stories} />`; leaving autodocs on as well makes storybook fail on duplicate docs entries. Components without an MDX page keep `tags: ['autodocs']`.
- **Prop tables are generated, not written** — `bun run generate:props` extracts them from the TS types into `.storybook/generated/component-props.json`, which `<PropsTable component="Button" />` renders. The `<name>PropDefs` naming convention is what backfills defaults and descriptions. Storybook's own docgen can't see any of this, which is why the generator exists — so `typescript.reactDocgen` is `false` in `main.ts`. It contributed nothing and cost ~4x on cold page loads; `.storybook/enhance-arg-types.ts` backfills the playground controls from the same generated JSON. Re-enabling it is a pure regression.
- **`llms.txt` / `llms-full.txt` are generated from the MDX** by `bun run generate:llms` into `.storybook/public/` (served at the site root). It expands `<PropsTable>` and `<Demo>` into real markdown, so it regenerates whenever the prop tables do.
- **If something is mysteriously broken, run `bun run doctor`** — under the hoisted linker, stale nested `packages/*/node_modules` dirs from older installs can shadow the root binaries (a package silently using an ancient `tsc`). `doctor --fix` deletes them.

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build/Lint Commands

### Monorepo

- **Install**: `bun install`
- **Dev server**: `bun run dev` (docs + playground + storybook, all through [portless](https://www.npmjs.com/package/portless))
- **Build**: `bun run build --filter=<app>`
- **Lint**: `bun run lint --filter=<app>`
- **Typecheck**: `bun run typecheck` (turbo, all packages; TypeScript 7)
- **Full check**: `bun run check` (lint, typecheck, build, publint, attw)
- **Scaffold a component**: `bun run new:component <kebab-name> [--namespace] [--no-docs]`
- **Env problems**: `bun run doctor [--fix]` (stale nested node_modules, bun version)

### Dev URLs (portless, one tenant — no port numbers)

Everything runs from this laptop under the `frosted.localhost` tenant; each site's header links to the others:

- **Docs**: <https://frosted.localhost> (`apps/docs`, Vite + TanStack Start)
- **Storybook**: <https://storybook.frosted.localhost> (`packages/frosted-ui`)
- **Playground**: <https://play.frosted.localhost> (`apps/tailwind`, Vite; `/` dashboard, `/main.html` marketing)

### Frosted UI Package (`@aussieljk/frosted`, in `packages/frosted-ui`)

- **Dev server**: `bun run --filter="@aussieljk/frosted" dev`
- **Build**: `bun run --filter="@aussieljk/frosted" build`
- **Lint**: `bun run --filter="@aussieljk/frosted" lint`
- **Storybook**: `bun run --filter="@aussieljk/frosted" storybook`

## Code Style Guidelines

- **TypeScript**: Strict typing, ES2020 modules, 120 char line width, 2-space indentation
- **React**: Functional components with hooks, JSX format
- **CSS**: Tailwind CSS v4, PostCSS with nesting/custom media/imports
- **Formatting**: Single quotes, semicolons required, trailing commas in multiline
- **Project**: Bun workspaces with Turborepo, Vite for all applications (no Next.js, no tests, no CI)
- **Commits**: Semantic commit messages (feat, fix, docs, style, refactor, perf, test, chore)
- **Quality**: oxlint for linting (root `.oxlintrc.json`), oxfmt for formatting (`bun run format`; lefthook pre-commit runs both on staged files), Storybook for component docs

## Publishing

The main package publishes to npm as `@aussieljk/frosted` (see `packages/frosted-ui`). Publishing happens locally from this laptop: bump the version in `packages/frosted-ui/package.json`, then `npm publish` from that directory (`prepublishOnly` runs lint + build). There is no CI/CD.

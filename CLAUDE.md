# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build/Test/Lint Commands

### Monorepo
- **Install**: `bun install`
- **Dev server**: `bun run dev --filter=<app>` (Example: `bun run dev --filter=tailwind`)
- **Build**: `bun run build --filter=<app>`
- **Lint**: `bun run lint --filter=<app>`

### Frosted UI Package (`@aussieljk/frosted`, in `packages/frosted-ui`)
- **Dev server**: `bun run --filter="@aussieljk/frosted" dev`
- **Build**: `bun run --filter="@aussieljk/frosted" build`
- **Test**: `bun run --filter="@aussieljk/frosted" test`
- **Lint**: `bun run --filter="@aussieljk/frosted" lint`
- **Storybook**: `bun run --filter="@aussieljk/frosted" storybook`

## Code Style Guidelines

- **TypeScript**: Strict typing, ES2020 modules, 120 char line width, 2-space indentation
- **React**: Functional components with hooks, JSX format
- **CSS**: Tailwind CSS v4, PostCSS with nesting/custom media/imports
- **Formatting**: Single quotes, semicolons required, trailing commas in multiline
- **Project**: Bun workspaces with Turborepo, NextJS for applications
- **Commits**: Semantic commit messages (feat, fix, docs, style, refactor, perf, test, chore)
- **Quality**: ESLint for linting, Prettier for formatting, Storybook for component docs

## Publishing

The main package publishes to npm as `@aussieljk/frosted` (see `packages/frosted-ui`). To publish: build the package, then run `npm publish` from `packages/frosted-ui` (`prepublishOnly` runs lint + build automatically).

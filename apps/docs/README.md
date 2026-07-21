# docs

Documentation site for `@aussieljk/frosted` — Fumadocs on TanStack Start (Vite).

```bash
# from the repo root
bun install
bun run dev --filter=docs     # dev server on http://localhost:3000
bun run build --filter=docs   # builds @aussieljk/frosted first via turbo
```

- Content lives in `content/docs/**.mdx`.
- Live demos live in `src/demos/` — each demo is a small component registered in
  `src/demos/index.ts` (with its source via a `?raw` import). Use it in MDX with
  `<Demo id="…" />`; the `/examples` page renders the whole registry.
- LLM routes: `/llms.txt`, `/llms-full.txt`, and per-page markdown at `<page>.md`
  (also served via `Accept: text/markdown` content negotiation).

import tailwindcss from '@tailwindcss/vite';
import type { StorybookConfig } from '@storybook/react-vite';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { mergeConfig } from 'vite';

const srcDir = resolve(dirname(fileURLToPath(import.meta.url)), '../src');

// Under portless the dev server sits behind an HTTPS proxy on 443, but vite still tells the
// browser to open its HMR socket on the private port — so the socket never connects. Vite's
// only way to recover from optimizing newly-discovered deps is a full-reload over that socket,
// so without this the first load of a docs page dies on "Failed to fetch dynamically imported
// module" and stays broken until a manual refresh.
const portlessUrl = process.env.PORTLESS_URL;
const ws = portlessUrl ? { protocol: 'wss', host: new URL(portlessUrl).hostname, clientPort: 443 } : undefined;

const config: StorybookConfig = {
  // Scoped to where these actually live — `./**/*` also walked demos/, components/, generated/
  // and public/ on every boot, and storybook indexes whatever it finds before serving anything.
  stories: [
    './stories/**/*.mdx',
    './stories/**/*.stories.@(js|jsx|mjs|ts|tsx)',
    '../src/components/**/*.stories.@(ts|tsx)',
  ],

  addons: ['@storybook/addon-docs'],

  // ./public holds the generated llms.txt / llms-full.txt; ./assets holds the checked-in
  // favicon.svg (public/ is gitignored and wiped by `clean`). Both are served at the site root,
  // and storybook picks up favicon.svg from there instead of shipping its own logo.
  staticDirs: ['./public', './assets'],

  core: {
    disableTelemetry: true,
    // Kills the "what's new in Storybook" notification toast.
    disableWhatsNewNotifications: true,
  },

  features: {
    // The "Get started" onboarding checklist widget in the sidebar (publish your
    // Storybook, install the Vitest addon, …) and its "Onboarding guide" menu entry.
    sidebarOnboardingChecklist: false,
    menuOnboardingChecklist: false,
  },

  // Storybook hardcodes "<story> ⋅ Storybook" as the document title and has no option for
  // it, so rewrite it as it is set. The CSS drops the two Storybook-branded entries in the
  // sidebar settings menu ("About your Storybook", "Documentation") — hiding the whole <li>
  // rather than the link so the menu doesn't keep their empty rows.
  managerHead: (head) => `${head}
    <style>
      li:has(> #list-item-about),
      li:has(> #list-item-documentation) { display: none !important; }
    </style>
    <script>
      const retitle = () => {
        const stripped = document.title.replace(/\\s*[⋅-]\\s*Storybook$/, '');
        const wanted = !stripped || stripped.toLowerCase() === 'storybook' ? '@aussieljk/frosted' : stripped;
        if (document.title !== wanted) document.title = wanted;
      };
      new MutationObserver(retitle).observe(document.querySelector('title'), { childList: true });
      retitle();
    </script>`,

  // Storybook inlines @font-face rules for Nunito Sans into the preview and uses the family for
  // its own loading placeholders (.sb-loader, .sb-previewBlock, …), so every preview boot fetches
  // two woff2 files for chrome that flashes past. Re-declaring the same three faces as local
  // aliases keeps them looking right and drops the network cost — everything else is SF Pro
  // already (see fonts.ts). Storybook's own rules come first, so these win.
  previewHead: (head) => `${head}
    <style>
      @font-face { font-family: 'Nunito Sans'; font-weight: 400; font-style: normal; src: local('SF Pro Text'), local('Helvetica Neue'); }
      @font-face { font-family: 'Nunito Sans'; font-weight: 400; font-style: italic; src: local('SF Pro Text Italic'), local('Helvetica Neue Italic'); }
      @font-face { font-family: 'Nunito Sans'; font-weight: 700; font-style: normal; src: local('SF Pro Text Bold'), local('Helvetica Neue Bold'); }
    </style>`,

  framework: {
    name: '@storybook/react-vite',
    options: {},
  },

  typescript: {
    // Off entirely: react-docgen parses every component on every transform, and none of its
    // output is used — prop tables come from generated/component-props.json (`generate:props`)
    // and controls are backfilled from the same file by enhance-arg-types.ts. The TS-aware
    // variant isn't an option either (it needs the classic compiler API, which TS7 dropped).
    reactDocgen: false,
  },

  // The demos in .storybook/demos are shown to users as copy-pasteable source, so they import
  // from the public package name; alias it to src/ (never dist/) the way the docs app did.
  viteFinal: (config) =>
    mergeConfig(config, {
      // The demos are authored in Tailwind utilities; .storybook/preview.css is the entry
      // that pairs tailwind with the frosted tokens + theme mapping.
      plugins: [tailwindcss()],
      resolve: {
        alias: [
          { find: /^@aussieljk\/frosted\/icons\/(.+)$/, replacement: `${srcDir}/icons/adapters/$1` },
          { find: /^@aussieljk\/frosted$/, replacement: srcDir },
        ],
        // react-aria keeps global state (focus-visible in particular) in module scope, so two
        // copies in one page throw "Illegal invocation" and blank the preview.
        dedupe: ['react', 'react-dom', 'react-aria', 'react-aria-components', '@base-ui/react'],
      },
      server: { ws },
      // Build-only, and worth being precise about: this does NOT reduce the total payload (7.1 MB
      // either way) and does not shrink the big `iframe` chunk. What it does is collect react and
      // the base-ui/react-aria stack — which rolldown otherwise smears across library chunks like
      // `components` and `theme-options` — into two chunks that only change when those deps do,
      // so a library change stops invalidating ~830 kB of otherwise stable cache.
      //
      // Deliberately no group for @storybook/* itself: storybook already splits its manager and
      // preview code, and forcing them together produced one 2 MB chunk instead.
      build: {
        rolldownOptions: {
          output: {
            advancedChunks: {
              groups: [
                { name: 'react', test: /node_modules[/\\](react|react-dom|scheduler)[/\\]/ },
                {
                  name: 'ui-vendor',
                  test: /node_modules[/\\](@base-ui|react-aria|@react-aria|@react-stately|@internationalized)/,
                },
              ],
            },
          },
        },
      },
      // Everything here exists to make the dep optimizer finish in ONE pass. Vite's scanner can't
      // read .mdx, and a dep discovered later forces a re-optimize mid-session — which leaves the
      // live page holding two generations of the same pre-bundled chunk. For react-aria that means
      // two copies of its focus-visible global and an "Illegal invocation" that blanks the preview,
      // so the story globs and the full react-aria surface are listed explicitly rather than left
      // to discovery.
      optimizeDeps: {
        entries: [
          '.storybook/demos/*.tsx',
          '.storybook/components/*.tsx',
          '.storybook/stories/**/*.stories.tsx',
          'src/components/**/*.stories.tsx',
        ],
        include: ['@base-ui/react', 'react-aria-components'],
      },
    }),
};
export default config;

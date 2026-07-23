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
const hmr = portlessUrl ? { protocol: 'wss', host: new URL(portlessUrl).hostname, clientPort: 443 } : undefined;

const config: StorybookConfig = {
  stories: ['./**/*.mdx', './**/*.stories.@(js|jsx|mjs|ts|tsx)', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],

  addons: ['@storybook/addon-links', '@storybook/addon-docs'],

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
      resolve: {
        alias: [
          { find: /^@aussieljk\/frosted\/icons\/(.+)$/, replacement: `${srcDir}/icons/adapters/$1` },
          { find: /^@aussieljk\/frosted$/, replacement: srcDir },
        ],
      },
      server: { hmr },
      // The docs pages reach the whole library through .storybook/demos, but vite's dep scanner
      // can't read .mdx — so without these entries those deps are discovered one request at a
      // time, forcing a re-optimize mid-render. Scanning them up front keeps first load stable.
      optimizeDeps: { entries: ['.storybook/demos/*.tsx', '.storybook/components/*.tsx'] },
    }),
};
export default config;

import chalk from 'chalk';
import isOnline from 'is-online';
import * as _ from 'lodash';
import { PropertyName } from 'lodash';
import nodeFetch, { Response } from 'node-fetch';
import { Config as SvgoConfig, PluginConfig as SvgoPluginConfig } from 'svgo';
import { CodedError, ERRORS, GeneratorMode, RequestInitWithRetry } from './types';
import { unmount } from './view';

export function handleError(err, exit = true) {
  unmount();
  console.log('');
  if (err instanceof CodedError) {
    console.error(
      `${chalk.red.bold('ERROR: ')}${chalk.bgRed.black.bold.inverse(` ${err.code} `)}
${err.message}
${chalk.dim(
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  !(err.hideStack && err.stack) ? err.stack!.replace(/^.*\n/, '') : '',
)}`.trim(),
    );
  } else {
    console.log(`${chalk.red.bold('ERROR: ')}${chalk.bgRed.black.bold.inverse(' UNHANDLED ')}\n`);
    console.error(err);
  }

  if (exit) {
    process.exit(1);
  }
}

let currentOnlineCheck: null | Promise<boolean> = null;

const defaultRetry = {
  delay: 1000,
  retries: 2,
};

export function fetch(url: string, fetchOptions: RequestInitWithRetry = {}): Promise<Response> {
  const retryOptions = { ...defaultRetry, ...fetchOptions.retry };
  return new Promise((resolve, reject) => {
    const attemptFetch = (remainingRetries: number) => {
      nodeFetch(url, fetchOptions)
        .then((res) => {
          resolve(res);
        })
        .catch(async (err) => {
          if (remainingRetries > 0) {
            await asyncDelay(retryOptions.delay);
            attemptFetch(--remainingRetries);
          } else {
            if (!currentOnlineCheck) {
              currentOnlineCheck = isOnline();
            }
            const isOn = await currentOnlineCheck;
            currentOnlineCheck = null;
            if (!isOn) {
              reject(
                new CodedError(ERRORS.NETWORK_OFFLINE, 'An internet connection is required to find and render Icons.'),
              );
            } else {
              reject(err);
            }
          }
        });
    };

    attemptFetch(retryOptions.retries);
  });
}

function asyncDelay(timeout: number) {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, timeout);
  });
}

export function pushObjLeafNodesToArr(obj: object, arr: string[], accessor: PropertyName[] = []) {
  _.forEach(accessor.length ? _.get(obj, accessor) : obj, (v, k) => {
    if (v == null) return;
    const currentAccessor = accessor.concat(k);
    if (typeof v === 'object') {
      pushObjLeafNodesToArr(obj, arr, currentAccessor);
    }
    if (typeof v === 'string') {
      arr.push(_.get(obj, currentAccessor));
    }
  });
}

const svgoCache: Partial<Record<GeneratorMode, SvgoConfig>> = {};
let pictogramRemergeSvgo: SvgoConfig | null = null;

/**
 * Returns an SVGO config that runs ONLY the path-merging plugins. Used by
 * the pictograms switched-fallback branch in services.ts to re-merge adjacent
 * same-color paths after `analyzePictogramAlignment` has finished comparing
 * variants. We can't leave `mergePaths`/`collapseGroups` on in `getSvgo`
 * because they collapse different sets of paths in each variant (since each
 * variant has different fills), which destroys the per-element correspondence
 * the alignment analyzer relies on. Once we've decided a pictogram cannot be
 * merged into a single component, though, each variant SVG is rendered
 * independently and we can safely collapse same-color path runs back down.
 */
export function getPictogramRemergeSvgo() {
  if (pictogramRemergeSvgo) return pictogramRemergeSvgo;
  // In SVGO 4, an explicit `plugins` array REPLACES the default preset entirely,
  // so only the plugins listed here run. That's exactly what we want: dangerous
  // defaults like `removeViewBox` (strips `viewBox="0 0 240 240"` from the root
  // SVG, breaking consumer scaling) and `convertPathData` (rewrites `d`
  // attributes and can shift paths) simply never run because we don't list them.
  pictogramRemergeSvgo = {
    plugins: [
      'moveElemsAttrsToGroup',
      'moveGroupAttrsToElems',
      'collapseGroups',
      'mergePaths',
    ],
  };
  return pictogramRemergeSvgo;
}

export function getSvgo(mode: GeneratorMode = 'icons') {
  if (svgoCache[mode]) return svgoCache[mode];
  const dataAttr = mode === 'pictograms' ? 'data-fui-pictogram' : 'data-fui-icon';
  // For pictograms we MUST preserve the per-variant element-by-element
  // correspondence so `analyzePictogramAlignment` can decide whether the
  // background variants share geometry. SVGO's `mergePaths` plugin merges
  // adjacent paths that share fill/stroke — which collapses *different sets
  // of paths* in each variant (since each variant has different fills),
  // producing artificial path-count mismatches that prevent merging.
  // `collapseGroups` similarly drops `<g>` wrappers asymmetrically when
  // moved attributes happen to match. Disable both for pictograms so the
  // post-SVGO output preserves the original Figma topology 1:1 across
  // variants. They stay enabled for monochromatic icons where there's only
  // a single variant to reason about.
  // In SVGO 4, an explicit `plugins` array REPLACES the default preset, so this
  // list is exhaustive: anything not listed (notably `removeViewBox` and
  // `convertPathData`, which we previously had to disable explicitly) does not run.
  const isPictograms = mode === 'pictograms';
  const plugins: SvgoPluginConfig[] = [
    'removeDoctype',
    'removeXMLProcInst',
    'removeComments',
    'removeMetadata',
    'removeEditorsNSData',
    'cleanupAttrs',
    'minifyStyles',
    'convertStyleToAttrs',
    'cleanupIds',
    'removeUselessDefs',
    'cleanupNumericValues',
    'convertColors',
    'removeUnknownsAndDefaults',
    'removeNonInheritableGroupAttrs',
    'removeUselessStrokeAndFill',
    'cleanupEnableBackground',
    'removeHiddenElems',
    'removeEmptyText',
    'convertShapeToPath',
    ...(isPictograms ? [] : (['moveElemsAttrsToGroup', 'moveGroupAttrsToElems', 'collapseGroups'] as SvgoPluginConfig[])),
    'convertTransform',
    'removeEmptyAttrs',
    'removeEmptyContainers',
    ...(isPictograms ? [] : (['mergePaths'] as SvgoPluginConfig[])),
    'removeUnusedNS',
    'removeTitle',
    'removeDesc',
    {
      name: 'addAttributesToSVGElement',
      params: {
        attributes: [
          {
            [dataAttr]: 'true',
          },
        ],
      },
    },
  ];
  svgoCache[mode] = { plugins };
  return svgoCache[mode];
}

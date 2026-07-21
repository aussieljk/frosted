import type { GetPropDefTypes, PropDef } from './helpers';
import {
  radixColorScales,
  radixColorScalesBright,
  radixColorScalesMetal,
  radixColorScalesRegular,
  //
  radixGetMatchingGrayScale,
  //
  radixGrayScalePure,
  radixGrayScales,
  radixGrayScalesDesaturated,
} from './helpers/radix-colors';
import {
  isTailwindColorScale,
  tailwindColorScales,
  tailwindGetMatchingGrayScale,
  tailwindGrayScales,
} from './helpers/tailwind-colors';
import { matchingGrayFromColor } from './helpers/tailwind-palette';

const colorPanelElevationColors = ['color-panel-elevation'] as const;
const semanticColors = ['danger', 'warning', 'success', 'info'] as const;
const appearances = ['inherit', 'light', 'dark'] as const;
const accentColors = [...radixColorScales, 'gray', ...tailwindColorScales] as const;
const grayColors = [...radixGrayScales, ...tailwindGrayScales, 'auto'] as const;
const dangerColors = ['tomato', 'red', 'ruby'] as const;
const warningColors = ['yellow', 'amber'] as const;
const successColors = ['teal', 'jade', 'green', 'grass'] as const;
const infoColors = ['blue', 'sky'] as const;

const themePropDefs = {
  hasBackground: { type: 'boolean', default: true },
  appearance: { type: 'enum', values: appearances, default: 'inherit' },
  accentColor: { type: 'enum', values: accentColors, default: 'blue' },
  grayColor: { type: 'enum', values: grayColors, default: 'gray' },
  dangerColor: { type: 'enum', values: dangerColors, default: 'red' },
  warningColor: { type: 'enum', values: warningColors, default: 'amber' },
  successColor: { type: 'enum', values: successColors, default: 'green' },
  infoColor: { type: 'enum', values: infoColors, default: 'sky' },
} satisfies {
  hasBackground: PropDef<boolean>;
  appearance: PropDef<(typeof appearances)[number]>;
  accentColor: PropDef<(typeof accentColors)[number]>;
  grayColor: PropDef<(typeof grayColors)[number]>;
  dangerColor: PropDef<(typeof dangerColors)[number]>;
  warningColor: PropDef<(typeof warningColors)[number]>;
  successColor: PropDef<(typeof successColors)[number]>;
  infoColor: PropDef<(typeof infoColors)[number]>;
};

type ThemeProps = GetPropDefTypes<typeof themePropDefs>;

type ThemeAppearance = NonNullable<ThemeProps['appearance']>;
/** A named scale, or any CSS color string (`#hex`, `rgb()`, `oklch()`) for a custom accent. */
type ThemeAccentColor = NonNullable<ThemeProps['accentColor']> | (string & {});
/** A named gray scale, `'auto'`, or any CSS color string for a custom gray. */
type ThemeGrayColor = NonNullable<ThemeProps['grayColor']> | (string & {});
type ThemeDangerColor = NonNullable<ThemeProps['dangerColor']>;
type ThemeWarningColor = NonNullable<ThemeProps['warningColor']>;
type ThemeSuccessColor = NonNullable<ThemeProps['successColor']>;
type ThemeInfoColor = NonNullable<ThemeProps['infoColor']>;

type ThemeOptions = {
  appearance: ThemeAppearance;
  accentColor: ThemeAccentColor;
  grayColor: ThemeGrayColor;
  dangerColor: ThemeDangerColor;
  warningColor: ThemeWarningColor;
  successColor: ThemeSuccessColor;
  infoColor: ThemeInfoColor;
};

const themeAccentColorsGrouped = [
  {
    label: 'Regulars',
    values: [...radixColorScalesRegular] as ThemeAccentColor[],
  },
  {
    label: 'Brights',
    values: [...radixColorScalesBright] as ThemeAccentColor[],
  },
  { label: 'Metals', values: [...radixColorScalesMetal] as ThemeAccentColor[] },
  { label: 'Gray', values: ['gray'] as ThemeAccentColor[] },
  { label: 'Tailwind', values: [...tailwindColorScales] as ThemeAccentColor[] },
];

const themeAccentColorsOrdered = [
  'gray',
  'gold',
  'bronze',
  'brown',
  'yellow',
  'amber',
  'tomato',
  'red',
  'ruby',
  'crimson',
  'pink',
  'plum',
  'purple',
  'violet',
  'iris',
  'cyan',
  'teal',
  'jade',
  'green',
  'grass',
  'mint',
  'sky',
  // Whop Brand Colors
  'blue',
  'orange',
  'indigo',
  'magenta',
  'lemon',
  'lime',
  // Tailwind CSS v4 palettes
  ...tailwindColorScales,
] as ThemeAccentColor[];

const themeGrayColorsGrouped = [
  { label: 'Pure', values: [radixGrayScalePure] as ThemeGrayColor[] },
  {
    label: 'Desaturated',
    values: ['auto', ...radixGrayScalesDesaturated] as ThemeGrayColor[],
  },
  { label: 'Tailwind', values: [...tailwindGrayScales] as ThemeGrayColor[] },
];

/** `true` when the value is not one of the named accent scales, i.e. a custom CSS color. */
function isCustomAccentColor(accentColor: ThemeAccentColor): boolean {
  return !(accentColors as readonly string[]).includes(accentColor);
}

/** `true` when the value is not `'auto'` or a named gray scale, i.e. a custom CSS color. */
function isCustomGrayColor(grayColor: ThemeGrayColor): boolean {
  return !(grayColors as readonly string[]).includes(grayColor);
}

function getMatchingGrayColor(
  accentColor: ThemeAccentColor,
): (typeof radixGrayScales)[number] | (typeof tailwindGrayScales)[number] {
  if (accentColor === 'gray') return 'gray';
  if (isTailwindColorScale(accentColor)) return tailwindGetMatchingGrayScale(accentColor);
  if (isCustomAccentColor(accentColor)) return matchingGrayFromColor(accentColor);
  return radixGetMatchingGrayScale(accentColor as (typeof radixColorScales)[number]);
}

export {
  colorPanelElevationColors,
  dangerColors,
  getMatchingGrayColor,
  infoColors,
  isCustomAccentColor,
  isCustomGrayColor,
  semanticColors,
  successColors,
  //
  themeAccentColorsGrouped,
  themeAccentColorsOrdered,
  themeGrayColorsGrouped,
  themePropDefs,
  warningColors,
};
export type { ThemeOptions };

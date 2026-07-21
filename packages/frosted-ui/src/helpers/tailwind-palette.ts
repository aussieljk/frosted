/**
 * Maps Tailwind CSS v4 style palettes (11 stops, 50–950) onto the 12-step
 * Radix-style scales that frosted-ui components consume.
 *
 * The heavy lifting happens at runtime in CSS: the shared
 * `:where([data-accent-color])` / `:where([data-gray-color])` blocks in
 * src/styles/tokens/tailwind-color.css compute `--accent-1..12`,
 * `--accent-a1..a12`, surfaces and contrast from five oklch seed stops
 * (50/300/500/800/950) plus two scalars per palette.
 *
 * This module produces those seeds:
 * - `createPaletteCss` emits a tiny seed block for a full custom palette
 * - `createPaletteFromColor` expands one CSS color into a Tailwind-style palette
 * - `createAccentSeedStyle` / `createGraySeedStyle` return inline-style var maps,
 *   used by `<Theme accentColor="#8b5cf6">` for arbitrary custom colors
 */

type TailwindPaletteStop = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950;

/** A Tailwind-style palette: 11 CSS colors (hex, rgb() or oklch()) keyed by stop. */
type TailwindPalette = Record<TailwindPaletteStop, string>;

const tailwindPaletteStops = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;

/* * * * * * * * * * * * * * * * * * * */
/*             Color math              */
/* * * * * * * * * * * * * * * * * * * */

interface Oklab {
  L: number;
  a: number;
  b: number;
}

interface Rgb {
  r: number;
  g: number;
  b: number;
}

const WHITE: Oklab = { L: 1, a: 0, b: 0 };

function srgbToLinear(c: number): number {
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

function linearToSrgb(c: number): number {
  return c <= 0.0031308 ? c * 12.92 : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
}

function rgbToOklab({ r, g, b }: Rgb): Oklab {
  const lr = srgbToLinear(r / 255);
  const lg = srgbToLinear(g / 255);
  const lb = srgbToLinear(b / 255);

  const l = Math.cbrt(0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb);
  const m = Math.cbrt(0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb);
  const s = Math.cbrt(0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb);

  return {
    L: 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    a: 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    b: 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  };
}

function oklabToLinearRgb({ L, a, b }: Oklab): { r: number; g: number; b: number } {
  const l = Math.pow(L + 0.3963377774 * a + 0.2158037573 * b, 3);
  const m = Math.pow(L - 0.1055613458 * a - 0.0638541728 * b, 3);
  const s = Math.pow(L - 0.0894841775 * a - 1.291485548 * b, 3);

  return {
    r: 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    g: -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    b: -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  };
}

function isInGamut(color: Oklab): boolean {
  const { r, g, b } = oklabToLinearRgb(color);
  const eps = 0.000005;
  return r >= -eps && r <= 1 + eps && g >= -eps && g <= 1 + eps && b >= -eps && b <= 1 + eps;
}

/** Convert to sRGB, reducing chroma (hue-preserving) when the color is out of gamut. */
function oklabToRgb(color: Oklab): Rgb {
  let mapped = color;
  if (!isInGamut(color)) {
    let lo = 0;
    let hi = 1;
    for (let i = 0; i < 30; i++) {
      const t = (lo + hi) / 2;
      mapped = { L: color.L, a: color.a * t, b: color.b * t };
      if (isInGamut(mapped)) lo = t;
      else hi = t;
    }
    mapped = { L: color.L, a: color.a * lo, b: color.b * lo };
  }

  const lin = oklabToLinearRgb(mapped);
  const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
  return {
    r: Math.round(clamp01(linearToSrgb(clamp01(lin.r))) * 255),
    g: Math.round(clamp01(linearToSrgb(clamp01(lin.g))) * 255),
    b: Math.round(clamp01(linearToSrgb(clamp01(lin.b))) * 255),
  };
}

function oklchToOklab(L: number, C: number, hDeg: number): Oklab {
  const h = (hDeg * Math.PI) / 180;
  return { L, a: C * Math.cos(h), b: C * Math.sin(h) };
}

function oklabChroma(c: Oklab): number {
  return Math.sqrt(c.a * c.a + c.b * c.b);
}

function oklabHueDeg(c: Oklab): number {
  return (Math.atan2(c.b, c.a) * 180) / Math.PI;
}

function mix(from: Oklab, to: Oklab, t: number): Oklab {
  return {
    L: from.L + (to.L - from.L) * t,
    a: from.a + (to.a - from.a) * t,
    b: from.b + (to.b - from.b) * t,
  };
}

function parseColor(input: string): Oklab {
  const str = input.trim().toLowerCase();

  const hexMatch = str.match(/^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/);
  if (hexMatch) {
    let hex = hexMatch[1];
    if (hex.length === 3) hex = hex.replace(/./g, (ch) => ch + ch);
    return rgbToOklab({
      r: parseInt(hex.slice(0, 2), 16),
      g: parseInt(hex.slice(2, 4), 16),
      b: parseInt(hex.slice(4, 6), 16),
    });
  }

  const oklchMatch = str.match(/^oklch\(\s*([\d.]+)(%?)\s+([\d.]+)\s+([\d.]+|none)\s*(?:\/[^)]+)?\)$/);
  if (oklchMatch) {
    const L = parseFloat(oklchMatch[1]) / (oklchMatch[2] === '%' ? 100 : 1);
    const C = parseFloat(oklchMatch[3]);
    const h = oklchMatch[4] === 'none' ? 0 : parseFloat(oklchMatch[4]);
    return oklchToOklab(L, C, h);
  }

  const rgbMatch = str.match(/^rgba?\(\s*(\d+)[\s,]+(\d+)[\s,]+(\d+)\s*(?:[/,][^)]+)?\)$/);
  if (rgbMatch) {
    return rgbToOklab({ r: Number(rgbMatch[1]), g: Number(rgbMatch[2]), b: Number(rgbMatch[3]) });
  }

  throw new Error(`Unsupported color "${input}". Use #hex, rgb() or oklch().`);
}

function toHexByte(v: number): string {
  return Math.min(255, Math.max(0, Math.round(v))).toString(16).padStart(2, '0');
}

function rgbToHex({ r, g, b }: Rgb): string {
  return `#${toHexByte(r)}${toHexByte(g)}${toHexByte(b)}`;
}

function wcagLuminance({ r, g, b }: Rgb): number {
  return 0.2126 * srgbToLinear(r / 255) + 0.7152 * srgbToLinear(g / 255) + 0.0722 * srgbToLinear(b / 255);
}

function contrastWithWhite(c: Rgb): number {
  return 1.05 / (wcagLuminance(c) + 0.05);
}

/* * * * * * * * * * * * * * * * * * * */
/*         Palette → seed vars         */
/* * * * * * * * * * * * * * * * * * * */

/** The five stops the runtime CSS interpolates the 12-step scales from. */
const seedStops = [50, 300, 500, 800, 950] as const;

interface PaletteSeeds {
  /** Seed colors, verbatim from the palette. */
  colors: Record<(typeof seedStops)[number], string>;
  /** OKLab lightness of the 800 stop (used by the dark background formula). */
  l800: number;
  /** Step-9 text color: `white`, or a dark hex for bright palettes. */
  contrast: string;
}

function paletteSeeds(palette: TailwindPalette): PaletteSeeds {
  const stops = tailwindPaletteStops.map((stop) => {
    const value = palette[stop];
    if (typeof value !== 'string') throw new Error(`Palette is missing stop ${stop}.`);
    return parseColor(value);
  });
  const p500 = stops[5];
  const p800 = stops[8];

  // Solid step 9 (= stop 500) is shared between modes, so one contrast var covers both.
  // The threshold splits palettes the way Radix does: yellow/amber/lime get dark text.
  const darkText = rgbToHex(oklabToRgb(mix(stops[9], stops[10], 0.6)));
  const contrast = contrastWithWhite(oklabToRgb(p500)) >= 2.16 ? 'white' : darkText;

  const colors = {} as PaletteSeeds['colors'];
  for (const stop of seedStops) colors[stop] = palette[stop].trim();
  return { colors, l800: Number(p800.L.toFixed(4)), contrast };
}

function seedDeclarations(prefix: 'ftw-accent' | 'ftw-gray', seeds: PaletteSeeds): Record<string, string> {
  const vars: Record<string, string> = {};
  for (const stop of seedStops) vars[`--${prefix}-seed-${stop}`] = seeds.colors[stop];
  vars[`--${prefix}-seed-l800`] = String(seeds.l800);
  if (prefix === 'ftw-accent') vars[`--${prefix}-seed-contrast`] = seeds.contrast;
  return vars;
}

// Dark app-background steps: replicated from the --ftw-g-d1/-d2 formulas in
// src/styles/tokens/tailwind-color.css (used where CSS can't, e.g. <body> background).
const grayDark3Weight = 0.818;

function darkBackgroundStep1(palette: TailwindPalette): Rgb {
  const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));
  const p950 = parseColor(palette[950]);
  const l800 = parseColor(palette[800]).L;
  const l = p950.L;
  const l3 = (1 - grayDark3Weight) * l800 + grayDark3Weight * l;
  const t2 = Math.min(clamp(0.87 * l, 0.16, 0.215), l3 - 0.012);
  const t1 = Math.min(clamp(0.72 * l, 0.13, 0.185), t2 - 0.022);
  const f = t1 / Math.max(l, 0.01);
  return oklabToRgb({ L: p950.L * f, a: p950.a * f, b: p950.b * f });
}

/* * * * * * * * * * * * * * * * * * * */
/*            CSS generation           */
/* * * * * * * * * * * * * * * * * * * */

interface CreatePaletteCssOptions {
  /**
   * Also emit a `[data-gray-color='{name}']` seed block (and `--{name}-1` page
   * background tokens) so the palette can be used as the Theme `grayColor`.
   */
  gray?: boolean;
}

/**
 * Generate the frosted-ui CSS for one Tailwind-style palette. The returned CSS is
 * self-contained: inject it once (a css file or a <style> tag) and `name` becomes usable
 * everywhere a scale name works, e.g. `<Theme accentColor={'my-brand' as never}>` or
 * `data-accent-color="my-brand"` on any subtree.
 *
 * It now emits only a small seed block per palette; the shared runtime blocks in
 * src/styles/tokens/tailwind-color.css (part of styles.css) expand the seeds into the
 * full 12-step light/dark scales with `color-mix()` and relative color syntax.
 */
function createPaletteCss(name: string, palette: TailwindPalette, options: CreatePaletteCssOptions = {}): string {
  if (!/^[a-z][a-z0-9-]*$/.test(name)) {
    throw new Error(`Invalid palette name "${name}". Use lowercase letters, digits and dashes.`);
  }

  const seeds = paletteSeeds(palette);
  const block = (selector: string, vars: Record<string, string>) =>
    `${selector} {\n${Object.entries(vars)
      .map(([k, v]) => `  ${k}: ${v};`)
      .join('\n')}\n}`;

  const accentBlock = block(`[data-accent-color='${name}']`, seedDeclarations('ftw-accent', seeds));
  if (!options.gray) return `${accentBlock}\n`;

  // Step-1 tokens exist globally so theme.tsx can point the page background
  // (`hasBackground`) at `var(--${name}-1)` from outside any [data-gray-color] scope.
  const light1 = rgbToHex(oklabToRgb(mix(parseColor(palette[50]), WHITE, 0.6)));
  const dark1 = rgbToHex(darkBackgroundStep1(palette));
  return [
    accentBlock,
    block(`[data-gray-color='${name}']`, seedDeclarations('ftw-gray', seeds)),
    block(':root,\n.light,\n.light-theme', { [`--${name}-1`]: light1 }),
    block('.dark,\n.dark-theme', { [`--${name}-1`]: dark1 }),
  ].join('\n\n') + '\n';
}

/* * * * * * * * * * * * * * * * * * * */
/*      Custom colors for <Theme>      */
/* * * * * * * * * * * * * * * * * * * */

/**
 * Inline-style custom properties that make an arbitrary CSS color usable as the
 * accent under `data-accent-color="custom"`. Used by `<Theme accentColor="#8b5cf6">`.
 * Supports `#hex`, `rgb()` and `oklch()` colors.
 */
function createAccentSeedStyle(color: string): Record<string, string> {
  return seedDeclarations('ftw-accent', paletteSeeds(createPaletteFromColor(color)));
}

/**
 * Inline-style custom properties that make an arbitrary CSS color usable as the
 * gray scale under `data-gray-color="custom"`. Used by `<Theme grayColor="#3f3f46">`.
 */
function createGraySeedStyle(color: string): Record<string, string> {
  return seedDeclarations('ftw-gray', paletteSeeds(createPaletteFromColor(color)));
}

/**
 * The dark-mode page background (scale step 1) for an arbitrary gray color, as a hex
 * string. theme.tsx applies this to `<body>`, which no CSS scale scope reaches.
 */
function darkPageBackgroundFromColor(color: string): string {
  return rgbToHex(darkBackgroundStep1(createPaletteFromColor(color)));
}

/**
 * Pick the gray scale that pairs best with an arbitrary accent color, mirroring
 * `tailwindGetMatchingGrayScale`'s hue groupings. Falls back to `gray` for
 * achromatic or unparseable colors.
 */
function matchingGrayFromColor(color: string): 'gray' | 'tw-stone' | 'tw-neutral' | 'tw-slate' | 'tw-zinc' {
  try {
    const c = parseColor(color);
    if (oklabChroma(c) < 0.02) return 'gray';
    const hue = ((oklabHueDeg(c) % 360) + 360) % 360;
    if (hue >= 20 && hue < 115) return 'tw-stone'; // warm: red/orange/amber/yellow
    if (hue >= 115 && hue < 190) return 'tw-neutral'; // greens
    if (hue >= 190 && hue < 280) return 'tw-slate'; // cool: cyan/sky/blue/indigo
    return 'tw-zinc'; // purples/pinks
  } catch {
    return 'gray';
  }
}

/* * * * * * * * * * * * * * * * * * * */
/*     Single-color custom accents     */
/* * * * * * * * * * * * * * * * * * * */

// Reference lightness/chroma curves shaped like Tailwind v4's chromatic palettes.
const referenceLightness = [0.977, 0.936, 0.885, 0.808, 0.704, 0.637, 0.577, 0.505, 0.444, 0.396, 0.266];
const referenceChroma = [0.013, 0.032, 0.062, 0.114, 0.191, 0.237, 0.245, 0.213, 0.177, 0.141, 0.092];

/**
 * Expand a single CSS color into a full Tailwind-style 50–950 palette (constant hue,
 * Tailwind-shaped lightness/chroma curves; the seed color is kept verbatim at the
 * nearest stop). Feed the result to `createPaletteCss` for a fully custom accent.
 */
function createPaletteFromColor(color: string): TailwindPalette {
  const seed = parseColor(color);
  const chroma = oklabChroma(seed);
  const hue = oklabHueDeg(seed);

  let nearest = 0;
  for (let i = 1; i < referenceLightness.length; i++) {
    if (Math.abs(seed.L - referenceLightness[i]) < Math.abs(seed.L - referenceLightness[nearest])) nearest = i;
  }

  const chromaScale = Math.min(chroma / Math.max(referenceChroma[nearest], 0.001), 0.32 / Math.max(...referenceChroma));

  const palette = {} as TailwindPalette;
  tailwindPaletteStops.forEach((stop, i) => {
    const c = i === nearest ? seed : oklchToOklab(referenceLightness[i], referenceChroma[i] * chromaScale, hue);
    palette[stop] = rgbToHex(oklabToRgb(c));
  });
  return palette;
}

export {
  createAccentSeedStyle,
  createGraySeedStyle,
  createPaletteCss,
  createPaletteFromColor,
  darkPageBackgroundFromColor,
  matchingGrayFromColor,
  tailwindPaletteStops,
};
export type { CreatePaletteCssOptions, TailwindPalette, TailwindPaletteStop };

/**
 * Maps Tailwind CSS v4 style palettes (11 stops, 50–950) onto the 12-step
 * Radix-style scales that frosted-ui components consume.
 *
 * For every palette we emit, per appearance (light + dark):
 * - `--{name}-1..12` solid steps
 * - `--{name}-a1..a12` alpha steps (composited over white in light mode, black in dark mode)
 * - `--{name}-surface`, `--{name}-9-contrast` and, for gray palettes, `--{name}-2-translucent`
 * - a `[data-accent-color='{name}']` mapping block (and `[data-gray-color]` for grays)
 *
 * The same logic powers the build-time generator (scripts/generate-tailwind-colors.ts)
 * and the public custom-palette API (`createPaletteCss`, `createPaletteFromColor`).
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

/** Scale a color towards black so its oklab lightness becomes `targetL` (chroma scales along). */
function scaleTowardsBlack(c: Oklab, targetL: number): Oklab {
  const f = c.L <= 0 ? 0 : targetL / c.L;
  return { L: c.L * f, a: c.a * f, b: c.b * f };
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

/**
 * Compute the Radix-style alpha equivalent of a solid color: the most transparent
 * rgba color that composites back to `target` over the mode's base (white/black).
 */
function alphaHex(target: Rgb, mode: 'light' | 'dark'): string {
  const channels = [target.r, target.g, target.b];
  const alpha =
    mode === 'light'
      ? Math.max(...channels.map((c) => (255 - c) / 255))
      : Math.max(...channels.map((c) => c / 255));

  const a = Math.max(alpha, 1 / 255);
  const fg = channels.map((c) => (mode === 'light' ? (c - (1 - a) * 255) / a : c / a));
  return `#${fg.map(toHexByte).join('')}${toHexByte(a * 255)}`;
}

/* * * * * * * * * * * * * * * * * * * */
/*        Palette → 12 steps           */
/* * * * * * * * * * * * * * * * * * * */

/**
 * Light mode mapping (Radix semantic roles → Tailwind stops):
 * 1 app bg (50 washed towards white) · 2 subtle bg (50) · 3 hover bg (100) · 4 active bg (100/200)
 * 5 (200) · 6 subtle border (200/300) · 7 border (300) · 8 strong border (400)
 * 9 solid (500) · 10 solid hover (500→600) · 11 text (700) · 12 high-contrast text (900/950)
 */
function buildLightSteps(p: Oklab[]): Oklab[] {
  return [
    mix(p[0], WHITE, 0.6),
    p[0],
    p[1],
    mix(p[1], p[2], 0.5),
    p[2],
    mix(p[2], p[3], 0.5),
    p[3],
    p[4],
    p[5],
    mix(p[5], p[6], 0.65),
    p[7],
    mix(p[9], p[10], 0.6),
  ];
}

/**
 * Dark mode mapping: 1–2 backgrounds are 950 pulled towards black (clamped so every
 * palette lands at a similar app-background lightness), 3–8 climb 950→700, 9 keeps the
 * same solid as light mode, 10 brightens on hover (500→400), 11 text (400), 12 (200→100).
 */
function buildDarkSteps(p: Oklab[]): Oklab[] {
  const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

  // Reach a target lightness without inflating chroma: darken by scaling towards
  // black, but lighten by nudging towards the 900 stop instead.
  const darkBackground = (targetL: number): Oklab => {
    if (targetL <= p[10].L) return scaleTowardsBlack(p[10], targetL);
    const t = (targetL - p[10].L) / Math.max(p[9].L - p[10].L, 0.001);
    return mix(p[10], p[9], Math.min(t, 1));
  };

  const l950 = p[10].L;
  const step3L = mix(p[10], p[9], 0.35).L;
  const step2L = Math.min(clamp(l950 * 0.87, 0.16, 0.215), step3L - 0.012);
  const step1L = Math.min(clamp(l950 * 0.72, 0.13, 0.185), step2L - 0.022);

  return [
    darkBackground(step1L),
    darkBackground(step2L),
    mix(p[10], p[9], 0.35),
    mix(p[10], p[9], 0.7),
    p[9],
    mix(p[9], p[8], 0.5),
    p[8],
    mix(p[8], p[7], 0.65),
    p[5],
    mix(p[5], p[4], 0.5),
    p[4],
    mix(p[2], p[1], 0.4),
  ];
}

/* * * * * * * * * * * * * * * * * * * */
/*            CSS generation           */
/* * * * * * * * * * * * * * * * * * * */

interface CreatePaletteCssOptions {
  /**
   * Also emit `--{name}-2-translucent` and a `[data-gray-color='{name}']` mapping block
   * so the palette can be used as the Theme `grayColor`.
   */
  gray?: boolean;
}

/**
 * Generate the full frosted-ui CSS for one Tailwind-style palette. The returned CSS is
 * self-contained: inject it once (a css file or a <style> tag) and `name` becomes usable
 * everywhere a scale name works, e.g. `<Theme accentColor={'my-brand' as never}>` or
 * `data-accent-color="my-brand"` on any subtree, plus raw `var(--my-brand-9)` tokens.
 */
function createPaletteCss(name: string, palette: TailwindPalette, options: CreatePaletteCssOptions = {}): string {
  if (!/^[a-z][a-z0-9-]*$/.test(name)) {
    throw new Error(`Invalid palette name "${name}". Use lowercase letters, digits and dashes.`);
  }

  const stops = tailwindPaletteStops.map((stop) => {
    const value = palette[stop];
    if (typeof value !== 'string') throw new Error(`Palette "${name}" is missing stop ${stop}.`);
    return parseColor(value);
  });

  const light = buildLightSteps(stops).map(oklabToRgb);
  const dark = buildDarkSteps(stops).map(oklabToRgb);

  const lightVars = light.map((c, i) => `  --${name}-${i + 1}: ${rgbToHex(c)};`).join('\n');
  const darkVars = dark.map((c, i) => `  --${name}-${i + 1}: ${rgbToHex(c)};`).join('\n');
  const lightAlphaVars = light.map((c, i) => `  --${name}-a${i + 1}: ${alphaHex(c, 'light')};`).join('\n');
  const darkAlphaVars = dark.map((c, i) => `  --${name}-a${i + 1}: ${alphaHex(c, 'dark')};`).join('\n');

  // Solid step 9 is shared between modes, so one contrast var covers both. The threshold
  // splits the built-in palettes the way Radix does: yellow/amber/lime get dark text.
  const contrast = contrastWithWhite(light[8]) >= 2.16 ? 'white' : rgbToHex(light[11]);

  // Surfaces: step 2 corrected for its alpha so it composites back to step 2 over the page bg.
  const surfaceAlpha = (c: Rgb, a: number, base: number): string => {
    const solve = (ch: number) => (ch - (1 - a) * base) / a;
    return `#${toHexByte(solve(c.r))}${toHexByte(solve(c.g))}${toHexByte(solve(c.b))}${toHexByte(a * 255)}`;
  };
  const lightSurface = surfaceAlpha(light[1], 0.8, 255);
  const darkSurface = surfaceAlpha(dark[1], 0.5, 0);

  const translucent = options.gray ? `\n  --${name}-2-translucent: ${rgbToHex(dark[1])}d9;` : '';

  const steps = Array.from({ length: 12 }, (_, i) => i + 1);
  const accentSolid = steps
    .map((i) => `  --accent-${i}: var(--${name}-${i});${i === 9 ? `\n  --accent-9-contrast: var(--${name}-9-contrast);` : ''}`)
    .join('\n');
  const accentAlpha = steps.map((i) => `  --accent-a${i}: var(--${name}-a${i});`).join('\n');

  const grayBlock = options.gray
    ? `

.frosted-ui:where([data-gray-color='${name}']) {
  --gray-surface: var(--${name}-surface);

${steps.map((i) => `  --gray-${i}: var(--${name}-${i});${i === 2 ? `\n  --gray-2-translucent: var(--${name}-2-translucent);` : ''}`).join('\n')}

${steps.map((i) => `  --gray-a${i}: var(--${name}-a${i});`).join('\n')}
}`
    : '';

  return `:root,
.light,
.light-theme {
${lightVars}

${lightAlphaVars}

  --${name}-surface: ${lightSurface};
  --${name}-9-contrast: ${contrast};
}

.dark,
.dark-theme {
${darkVars}

${darkAlphaVars}

  --${name}-surface: ${darkSurface};${translucent}
}

[data-accent-color='${name}'] {
  --color-surface-accent: var(--${name}-surface);

${accentSolid}

${accentAlpha}
}${grayBlock}
`;
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

export { createPaletteCss, createPaletteFromColor, tailwindPaletteStops };
export type { CreatePaletteCssOptions, TailwindPalette, TailwindPaletteStop };

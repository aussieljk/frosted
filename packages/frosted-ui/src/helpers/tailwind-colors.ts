/**
 * Tailwind CSS v4 palettes exposed as frosted-ui scales. Every palette is prefixed
 * with `tw-` so it never collides with the built-in Radix scales (`red` vs `tw-red`).
 * The palettes are computed at runtime from per-palette oklch seeds in
 * src/styles/tokens/tailwind-color.css (see that file for the architecture).
 */

// prettier-ignore
const tailwindColorScalesChromatic = [
  'tw-red',
  'tw-orange',
  'tw-amber',
  'tw-yellow',
  'tw-lime',
  'tw-green',
  'tw-emerald',
  'tw-teal',
  'tw-cyan',
  'tw-sky',
  'tw-blue',
  'tw-indigo',
  'tw-violet',
  'tw-purple',
  'tw-fuchsia',
  'tw-pink',
  'tw-rose',
] as const;

const tailwindGrayScales = ['tw-slate', 'tw-gray', 'tw-zinc', 'tw-neutral', 'tw-stone'] as const;

const tailwindColorScales = [...tailwindColorScalesChromatic, ...tailwindGrayScales] as const;

type TailwindColorScale = (typeof tailwindColorScales)[number];
type TailwindGrayScale = (typeof tailwindGrayScales)[number];

function isTailwindColorScale(color: string): color is TailwindColorScale {
  return (tailwindColorScales as readonly string[]).includes(color);
}

function tailwindGetMatchingGrayScale(colorScale: TailwindColorScale): TailwindGrayScale {
  switch (colorScale) {
    // Warm hues pair with the warm gray.
    case 'tw-red':
    case 'tw-orange':
    case 'tw-amber':
    case 'tw-yellow':
      return 'tw-stone';
    // Greens pair with the pure gray.
    case 'tw-lime':
    case 'tw-green':
    case 'tw-emerald':
    case 'tw-teal':
      return 'tw-neutral';
    // Cool hues pair with the blue-tinted gray.
    case 'tw-cyan':
    case 'tw-sky':
    case 'tw-blue':
    case 'tw-indigo':
      return 'tw-slate';
    // Purples/pinks pair with the slightly cool gray.
    case 'tw-violet':
    case 'tw-purple':
    case 'tw-fuchsia':
    case 'tw-pink':
    case 'tw-rose':
      return 'tw-zinc';
    case 'tw-slate':
    case 'tw-gray':
    case 'tw-zinc':
    case 'tw-neutral':
    case 'tw-stone':
      return colorScale;
  }
}

export {
  isTailwindColorScale,
  tailwindColorScales,
  tailwindColorScalesChromatic,
  tailwindGetMatchingGrayScale,
  tailwindGrayScales,
};
export type { TailwindColorScale, TailwindGrayScale };

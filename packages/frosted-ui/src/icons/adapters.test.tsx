/**
 * Pins every adapter against silent icon renames on library upgrades: for each
 * adapter and every canonical name it maps, `<Icons.X />` must server-render to
 * a real `<svg>` with sane attributes. Also re-runs the generator's export
 * validation against the installed library versions.
 */
import * as React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { ICON_MAP, type IconLibrary } from '../../scripts/icon-map';
import { validateIconMap } from '../../scripts/validate-icon-map';
import { frostedAdapter } from './adapters/frosted';
import { heroiconsAdapter } from './adapters/heroicons';
import { hugeiconsAdapter } from './adapters/hugeicons';
import { lucideAdapter } from './adapters/lucide';
import { phosphorAdapter } from './adapters/phosphor';
import { tablerAdapter } from './adapters/tabler';
import { IconProvider, Icons } from './registry';
import { CANONICAL_ICON_NAMES, type CanonicalIconName, type IconAdapter } from './types';

const ADAPTERS: Record<IconLibrary, IconAdapter> = {
  lucide: lucideAdapter,
  phosphor: phosphorAdapter,
  heroicons: heroiconsAdapter,
  tabler: tablerAdapter,
  hugeicons: hugeiconsAdapter,
  frosted: frostedAdapter,
};

const MAP_NAMES = Object.keys(ICON_MAP).sort() as CanonicalIconName[];

describe('icon-map', () => {
  it('CANONICAL_ICON_NAMES matches the icon-map source of truth', () => {
    expect([...CANONICAL_ICON_NAMES]).toEqual(MAP_NAMES);
  });

  it('every mapped export exists in the installed library versions', async () => {
    await expect(validateIconMap()).resolves.toEqual([]);
  }, 30_000);
});

for (const [library, adapter] of Object.entries(ADAPTERS) as Array<[IconLibrary, IconAdapter]>) {
  describe(`${library} adapter`, () => {
    const mappedNames = MAP_NAMES.filter((name) => ICON_MAP[name][library] != null);
    const unmappedNames = MAP_NAMES.filter((name) => ICON_MAP[name][library] == null);

    it('maps exactly the canonical names declared in icon-map', () => {
      expect(Object.keys(adapter.icons).sort()).toEqual(mappedNames);
    });

    it.each(mappedNames)('renders <Icons.%s /> as an svg', (name) => {
      const Icon = Icons[name];
      const html = renderToStaticMarkup(
        <IconProvider library={adapter}>
          <Icon />
        </IconProvider>,
      );
      expect(html, `<Icons.${name} /> under the ${library} adapter`).toMatch(/^<svg[\s>]/);
      expect(html).toContain('viewBox=');
      // At least one actual drawing primitive, so an "empty" svg cannot pass.
      expect(html).toMatch(/<(path|circle|rect|line|polyline|polygon|ellipse)[\s/>]/);
    });

    if (unmappedNames.length > 0) {
      it.each(unmappedNames)('renders nothing (not a crash) for unmapped <Icons.%s />', (name) => {
        const Icon = Icons[name];
        const html = renderToStaticMarkup(
          <IconProvider library={adapter}>
            <Icon />
          </IconProvider>,
        );
        expect(html).toBe('');
      });
    }
  });
}

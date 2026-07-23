import React from 'react';
import { Card, IconButton, IconProvider, Icons, ScrollGallery, Text } from '@aussieljk/frosted';
import { lucideAdapter } from '@aussieljk/frosted/icons/lucide';

const items = ['One', 'Two', 'Three', 'Four', 'Five', 'Six'];

export default function ScrollGalleryDemo() {
  return (
    <IconProvider library={lucideAdapter}>
      <ScrollGallery.Root defaultValue={0} className="max-w-120">
        <ScrollGallery.Viewport
          aria-label="Gallery"
          className="flex gap-3 overflow-x-auto [overscroll-behavior-x:contain] [scroll-snap-type:x_mandatory] [scrollbar-width:none]"
        >
          {items.map((label) => (
            <ScrollGallery.Item key={label} className="shrink-0 [scroll-snap-align:start]">
              <Card size="2" className="grid h-25 w-45 place-items-center">
                <Text size="3" weight="bold">
                  {label}
                </Text>
              </Card>
            </ScrollGallery.Item>
          ))}
        </ScrollGallery.Viewport>

        <div className="mt-3 flex items-center justify-between">
          <div className="flex gap-2">
            <ScrollGallery.Previous aria-label="Previous" render={<IconButton variant="soft" size="1" color="gray" />}>
              <Icons.ChevronLeft />
            </ScrollGallery.Previous>
            <ScrollGallery.Next aria-label="Next" render={<IconButton variant="soft" size="1" color="gray" />}>
              <Icons.ChevronRight />
            </ScrollGallery.Next>
          </div>

          <ScrollGallery.ScrollMarkerGroup aria-label="Go to item" className="flex gap-1">
            {items.map((label, i) => (
              <ScrollGallery.ScrollMarker
                key={label}
                index={i}
                render={(props, state) => (
                  <button
                    {...props}
                    className={`size-2 cursor-pointer rounded-full border-[1.5px] border-gray-600 p-0 ${
                      state.active ? 'bg-gray-950' : 'bg-transparent'
                    }`}
                  />
                )}
              />
            ))}
          </ScrollGallery.ScrollMarkerGroup>
        </div>
      </ScrollGallery.Root>
    </IconProvider>
  );
}

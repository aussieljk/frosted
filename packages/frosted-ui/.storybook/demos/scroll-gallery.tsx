import React from 'react';
import { Card, IconButton, IconProvider, Icons, ScrollGallery, Text } from '@aussieljk/frosted';
import { lucideAdapter } from '@aussieljk/frosted/icons/lucide';

const items = ['One', 'Two', 'Three', 'Four', 'Five', 'Six'];

export default function ScrollGalleryDemo() {
  return (
    <IconProvider library={lucideAdapter}>
      <ScrollGallery.Root defaultValue={0} style={{ maxWidth: 480 }}>
        <ScrollGallery.Viewport
          aria-label="Gallery"
          style={{
            display: 'flex',
            gap: 12,
            overflowX: 'auto',
            overscrollBehaviorX: 'contain',
            scrollSnapType: 'x mandatory',
            scrollbarWidth: 'none',
          }}
        >
          {items.map((label) => (
            <ScrollGallery.Item key={label} style={{ scrollSnapAlign: 'start', flexShrink: 0 }}>
              <Card size="2" style={{ width: 180, height: 100, display: 'grid', placeItems: 'center' }}>
                <Text size="3" weight="bold">
                  {label}
                </Text>
              </Card>
            </ScrollGallery.Item>
          ))}
        </ScrollGallery.Viewport>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <ScrollGallery.Previous aria-label="Previous" render={<IconButton variant="soft" size="1" color="gray" />}>
              <Icons.ChevronLeft />
            </ScrollGallery.Previous>
            <ScrollGallery.Next aria-label="Next" render={<IconButton variant="soft" size="1" color="gray" />}>
              <Icons.ChevronRight />
            </ScrollGallery.Next>
          </div>

          <ScrollGallery.ScrollMarkerGroup aria-label="Go to item" style={{ display: 'flex', gap: 4 }}>
            {items.map((label, i) => (
              <ScrollGallery.ScrollMarker
                key={label}
                index={i}
                render={(props, state) => (
                  <button
                    {...props}
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      padding: 0,
                      cursor: 'pointer',
                      border: '1.5px solid var(--gray-8)',
                      background: state.active ? 'var(--gray-12)' : 'transparent',
                    }}
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

import React from 'react';
import { IconButton, IconProvider, Icons, Lightbox, Text } from '@aussieljk/frosted';
import { lucideAdapter } from '@aussieljk/frosted/icons/lucide';

const images = [
  { seed: 'lb1', alt: 'Mountain landscape at sunrise' },
  { seed: 'lb2', alt: 'Ocean waves crashing on rocks' },
  { seed: 'lb3', alt: 'Forest path in autumn' },
];

const navButton = <IconButton size="2" variant="ghost" color="gray" highContrast style={{ color: 'white' }} />;

export default function LightboxDemo() {
  return (
    <IconProvider library={lucideAdapter}>
      <Lightbox.Root viewTransition>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, maxWidth: 420 }}>
          {images.map((img, i) => (
            <Lightbox.Trigger
              key={img.seed}
              index={i}
              crossfade
              style={{ padding: 0, border: 'none', background: 'none', cursor: 'pointer' }}
            >
              <img
                src={`https://picsum.photos/seed/${img.seed}/200/200`}
                alt={img.alt}
                style={{ width: '100%', height: 100, objectFit: 'cover', borderRadius: 12, display: 'block' }}
              />
            </Lightbox.Trigger>
          ))}
        </div>

        <Lightbox.Content aria-label="Photo gallery">
          <div style={{ position: 'absolute', top: 16, right: 16, zIndex: 1 }}>
            <Lightbox.Close aria-label="Close" render={navButton}>
              <Icons.Close />
            </Lightbox.Close>
          </div>

          <Lightbox.ItemGroup>
            {images.map((img, i) => (
              <Lightbox.Item key={img.seed} index={i}>
                <img
                  src={`https://picsum.photos/seed/${img.seed}/1200/800`}
                  alt={img.alt}
                  style={{ maxWidth: '90vw', maxHeight: '75vh', objectFit: 'contain', borderRadius: 8 }}
                />
              </Lightbox.Item>
            ))}
          </Lightbox.ItemGroup>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12 }}>
            <Lightbox.Previous aria-label="Previous" render={navButton}>
              <Icons.ChevronLeft />
            </Lightbox.Previous>
            <Lightbox.Counter>
              {({ current, total }) => (
                <Text size="2" style={{ color: 'rgba(255,255,255,0.7)', minWidth: 48, textAlign: 'center' }}>
                  {current} / {total}
                </Text>
              )}
            </Lightbox.Counter>
            <Lightbox.Next aria-label="Next" render={navButton}>
              <Icons.ChevronRight />
            </Lightbox.Next>
          </div>
        </Lightbox.Content>
      </Lightbox.Root>
    </IconProvider>
  );
}

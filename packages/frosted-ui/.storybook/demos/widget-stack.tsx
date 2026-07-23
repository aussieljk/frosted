import React from 'react';
import { IconButton, Text, WidgetStack } from '@aussieljk/frosted';

const itemStyle: React.CSSProperties = {
  display: 'grid',
  placeItems: 'center',
  width: '100%',
  height: '100%',
};

export default function WidgetStackDemo() {
  return (
    <WidgetStack.Root orientation="horizontal">
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <WidgetStack.Prev render={<IconButton variant="soft" color="gray" style={{ borderRadius: '50%' }} />}>
          {'<'}
        </WidgetStack.Prev>

        <WidgetStack.Stack style={{ width: 320, height: 160 }}>
          <WidgetStack.Item>
            <div
              style={{
                ...itemStyle,
                background: 'linear-gradient(var(--blue-9), var(--blue-6))',
                color: 'var(--blue-9-contrast)',
              }}
            >
              <Text weight="bold" size="5">
                Sunny, 24°
              </Text>
            </div>
          </WidgetStack.Item>
          <WidgetStack.Item>
            <div style={{ ...itemStyle, background: 'var(--grass-9)', fontSize: 64 }}>🏝️</div>
          </WidgetStack.Item>
          <WidgetStack.Item>
            <div style={{ ...itemStyle, background: 'var(--gray-2)' }}>
              <Text weight="medium" size="3">
                Swipe or use the arrows
              </Text>
            </div>
          </WidgetStack.Item>
        </WidgetStack.Stack>

        <WidgetStack.Next render={<IconButton variant="soft" color="gray" style={{ borderRadius: '50%' }} />}>
          {'>'}
        </WidgetStack.Next>
      </div>
    </WidgetStack.Root>
  );
}

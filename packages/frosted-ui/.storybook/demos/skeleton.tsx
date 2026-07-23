import React from 'react';
import { Card, Skeleton } from '@aussieljk/frosted';

export default function SkeletonDemo() {
  return (
    <Card size="2" style={{ maxWidth: 320 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Skeleton.Avatar size="3" />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Skeleton.Text size="2" style={{ width: '60%' }} />
          <Skeleton.Text size="2" style={{ width: '90%' }} />
        </div>
      </div>
      <Skeleton.Rect style={{ height: 96, marginTop: 12 }} />
    </Card>
  );
}

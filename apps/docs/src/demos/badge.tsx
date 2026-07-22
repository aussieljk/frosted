import { Badge } from '@aussieljk/frosted';

export default function BadgeDemo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
      <Badge variant="solid" color="blue">
        Solid
      </Badge>
      <Badge variant="soft" color="green">
        Soft
      </Badge>
      <Badge variant="surface" color="orange">
        Surface
      </Badge>
      <Badge variant="outline" color="rose">
        Outline
      </Badge>
      <Badge size="2" color="purple">
        Size 2
      </Badge>
    </div>
  );
}

import { Button, IconButton, IconProvider, Icons } from '@aussieljk/frosted';
import { lucideAdapter } from '@aussieljk/frosted/icons/lucide';

export default function IconsDemo() {
  return (
    <IconProvider library={lucideAdapter}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <Button variant="surface">
          <Icons.Search />
          Search
        </Button>
        <IconButton variant="soft" aria-label="Settings">
          <Icons.Settings />
        </IconButton>
        <Icons.Bell />
        <Icons.Heart />
        <Icons.Star />
        <Icons.Calendar />
      </div>
    </IconProvider>
  );
}

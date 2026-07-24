import { TypeTable } from 'fumadocs-ui/components/type-table';
import propsData from '@/generated/props.json';

// Generated from the component `*.props.ts` files by scripts/gen-props.ts. Keyed by kebab
// component name; each row is already in TypeTable's shape.
const data = propsData as Record<
  string,
  Record<string, { type: string; default?: string; description?: string; required?: boolean }>
>;

/**
 * Renders the design-system props for a component (the ones its `propDefs` declare — size,
 * variant, color, … — not every inherited HTML attribute). Renders nothing when a component has
 * no documented props, so it's safe to drop on every page.
 */
export function PropsTable({ component }: { component: string }) {
  const props = data[component];
  if (!props) return null;

  return <TypeTable type={props} />;
}

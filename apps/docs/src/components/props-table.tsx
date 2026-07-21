import { TypeTable } from 'fumadocs-ui/components/type-table';

import data from '@/generated/component-props.json';

export interface PropInfo {
  name: string;
  type: string;
  required: boolean;
  default?: string;
  description?: string;
  deprecated?: boolean;
}

export interface ComponentEntry {
  /** JSDoc description of the component itself, when present. */
  description?: string;
  props: PropInfo[];
}

const components = data.components as Record<string, ComponentEntry | undefined>;

export function getComponentProps(component: string): ComponentEntry | undefined {
  return components[component];
}

/** Long union types get a shortened inline label; the full signature moves to the hover popup. */
function formatTypeCell(type: string): { type: string; typeDescription?: string } {
  if (type.length <= 45) return { type };

  const members = type.split(' | ');
  if (members.length > 3) {
    let short = members[0];
    let i = 1;
    while (i < members.length && (short + ' | ' + members[i]).length <= 32) {
      short += ' | ' + members[i];
      i += 1;
    }
    return { type: `${short} | … (${members.length} options)`, typeDescription: type };
  }
  return { type: `${type.slice(0, 42)}…`, typeDescription: type };
}

/**
 * Auto-generated props table for a frosted-ui component (or component part, e.g.
 * `Dialog.Root`). Data comes from `src/generated/component-props.json`, produced by
 * `bun run generate:props` from the frosted-ui sources — it never drifts from the code.
 */
export function PropsTable({ component }: { component: string }) {
  const entry = getComponentProps(component);
  if (!entry) {
    throw new Error(
      `<PropsTable component="${component}" /> — unknown component. ` +
        'Run `bun run generate:props` in apps/docs, and check the name against src/generated/component-props.json.',
    );
  }

  return (
    <TypeTable
      type={Object.fromEntries(
        entry.props.map((prop) => [
          prop.name,
          {
            ...formatTypeCell(prop.type),
            description: prop.description,
            default: prop.default,
            required: prop.required,
            deprecated: prop.deprecated,
          },
        ]),
      )}
    />
  );
}

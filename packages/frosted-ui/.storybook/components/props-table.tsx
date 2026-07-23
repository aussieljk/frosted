import React from 'react';

import data from '../generated/component-props.json';

interface PropInfo {
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

/** Long union types get a shortened inline label; the full signature moves to the title tooltip. */
function formatType(type: string): { label: string; full?: string } {
  if (type.length <= 45) return { label: type };

  const members = type.split(' | ');
  if (members.length > 3) {
    let short = members[0];
    let i = 1;
    while (i < members.length && (short + ' | ' + members[i]).length <= 32) {
      short += ' | ' + members[i];
      i += 1;
    }
    return { label: `${short} | … (${members.length} options)`, full: type };
  }
  return { label: `${type.slice(0, 42)}…`, full: type };
}

const cell: React.CSSProperties = { verticalAlign: 'top' };
const mono: React.CSSProperties = { whiteSpace: 'nowrap' };

/**
 * Auto-generated props table for an @aussieljk/frosted component (or component part, e.g.
 * `Dialog.Root`). Data comes from `.storybook/generated/component-props.json`, produced by
 * `bun run generate:props` from the @aussieljk/frosted sources — it never drifts from the code.
 */
export function PropsTable({ component }: { component: string }) {
  const entry = getComponentProps(component);

  if (!entry) {
    return (
      <div style={{ border: '1px solid #d32f2f', borderRadius: 8, padding: 12, color: '#d32f2f' }}>
        <code>{`<PropsTable component="${component}" />`}</code> — unknown component. Run{' '}
        <code>bun run generate:props</code> and check the name against{' '}
        <code>.storybook/generated/component-props.json</code>.
      </div>
    );
  }

  return (
    <>
      {entry.description && <p>{entry.description}</p>}
      <table>
        <thead>
          <tr>
            <th>Prop</th>
            <th>Type</th>
            <th>Default</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {entry.props.map((prop) => {
            const type = formatType(prop.type);
            return (
              <tr key={prop.name}>
                <td style={cell}>
                  <code style={{ ...mono, textDecoration: prop.deprecated ? 'line-through' : undefined }}>
                    {prop.name}
                  </code>
                  {prop.required && <span title="required"> *</span>}
                </td>
                <td style={cell}>
                  <code title={type.full}>{type.label}</code>
                </td>
                <td style={cell}>{prop.default ? <code style={mono}>{prop.default}</code> : '—'}</td>
                <td style={cell}>{prop.description ?? ''}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}

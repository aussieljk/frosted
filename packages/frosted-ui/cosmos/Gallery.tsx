import React, { type ComponentType, type ReactElement, isValidElement } from 'react';

// Fixtures write examples either way — `Name() { … }` (needed for hooks) or `Name: <X />`.
type Example = ReactElement | ComponentType;

/**
 * One cosmos fixture per component, showing every example at once — the sidebar is a
 * flat list of components (see `fixtures/`), so the page has to carry the variants.
 *
 * The usage demo (`demos/<name>.demo.tsx`, copy-pasteable source that imports from the
 * public package name) leads, then the variant examples in their declared order.
 */
function renderExample(example: Example) {
  if (isValidElement(example)) return example;
  const Example = example as ComponentType;
  return <Example />;
}

export function Gallery({ demo, examples }: { demo?: Example; examples?: Record<string, Example> }) {
  const sections: [string, Example][] = [
    ...(demo ? ([['Usage', demo]] as [string, Example][]) : []),
    ...Object.entries(examples ?? {}),
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {sections.map(([name, example], i) => (
        <section
          key={name}
          style={{
            paddingBlock: 'var(--space-5)',
            borderTop: i === 0 ? undefined : '1px solid var(--gray-a5)',
          }}
        >
          <h2
            style={{
              margin: '0 0 var(--space-4)',
              fontSize: 'var(--font-size-1)',
              fontWeight: 500,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--gray-11)',
            }}
          >
            {name}
          </h2>
          {renderExample(example)}
        </section>
      ))}
    </div>
  );
}

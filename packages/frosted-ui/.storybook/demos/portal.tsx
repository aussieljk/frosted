import React from 'react';
import { Button, Portal, Text } from '@aussieljk/frosted';

export default function PortalDemo() {
  const [show, setShow] = React.useState(false);
  return (
    <div>
      <Button variant="soft" onClick={() => setShow(!show)}>
        {show ? 'Hide' : 'Show'} portaled content
      </Button>
      {show && (
        <Portal
          style={{
            position: 'fixed',
            bottom: 20,
            right: 20,
            padding: 16,
            backgroundColor: 'var(--color-panel-solid)',
            borderRadius: 'var(--radius-3)',
            boxShadow: 'var(--shadow-5)',
            zIndex: 1000,
          }}
        >
          <Text size="2" weight="medium">
            Rendered at the end of document.body
          </Text>
        </Portal>
      )}
    </div>
  );
}

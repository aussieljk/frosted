import React from 'react';
import { Gallery } from '../cosmos/Gallery';
import Demo from '../demos/kbd.demo';
import { Kbd } from '../src/components/kbd';

const examples = {
  Size() {
    const args = {};
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        <div>
          <Kbd {...args} size="1">
            Shift + Tab
          </Kbd>
        </div>
        <div>
          <Kbd {...args} size="2">
            Shift + Tab
          </Kbd>
        </div>
        <div>
          <Kbd {...args} size="3">
            Shift + Tab
          </Kbd>
        </div>
        <div>
          <Kbd {...args} size="4">
            Shift + Tab
          </Kbd>
        </div>
        <div>
          <Kbd {...args} size="5">
            Shift + Tab
          </Kbd>
        </div>
        <div>
          <Kbd {...args} size="6">
            Shift + Tab
          </Kbd>
        </div>
        <div>
          <Kbd {...args} size="7">
            Shift + Tab
          </Kbd>
        </div>
        <div>
          <Kbd {...args} size="8">
            Shift + Tab
          </Kbd>
        </div>
        <div>
          <Kbd {...args} size="9">
            Shift + Tab
          </Kbd>
        </div>
      </div>
    );
  },
};

export default <Gallery examples={examples} demo={Demo} />;

import React from 'react';
import { Autocomplete, ScrollArea, TextField } from '@aussieljk/frosted';

const tags = ['feature', 'fix', 'bug', 'docs', 'internal', 'performance', 'accessibility'];

export default function AutocompleteDemo() {
  return (
    <div style={{ width: 300 }}>
      <Autocomplete.Root items={tags}>
        <TextField.Root>
          <Autocomplete.Input render={<TextField.Input placeholder="Search tags..." />} />
        </TextField.Root>
        <Autocomplete.Content>
          <ScrollArea type="auto">
            <Autocomplete.Empty>No tags found.</Autocomplete.Empty>
            <Autocomplete.List>
              {(tag) => (
                <Autocomplete.Item key={tag as string} value={tag}>
                  {tag as string}
                </Autocomplete.Item>
              )}
            </Autocomplete.List>
          </ScrollArea>
        </Autocomplete.Content>
      </Autocomplete.Root>
    </div>
  );
}

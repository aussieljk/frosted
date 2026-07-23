import React from 'react';
import { Badge, Code, DataList, Link } from '@aussieljk/frosted';

export default function DataListDemo() {
  return (
    <DataList.Root>
      <DataList.Item align="center">
        <DataList.Label>Status</DataList.Label>
        <DataList.Value>
          <Badge color="success">Active</Badge>
        </DataList.Value>
      </DataList.Item>
      <DataList.Item>
        <DataList.Label>ID</DataList.Label>
        <DataList.Value>
          <Code variant="ghost">usr_4f9a2c</Code>
        </DataList.Value>
      </DataList.Item>
      <DataList.Item>
        <DataList.Label>Name</DataList.Label>
        <DataList.Value>Ada Lovelace</DataList.Value>
      </DataList.Item>
      <DataList.Item>
        <DataList.Label>Email</DataList.Label>
        <DataList.Value>
          <Link href="mailto:ada@example.com">ada@example.com</Link>
        </DataList.Value>
      </DataList.Item>
    </DataList.Root>
  );
}

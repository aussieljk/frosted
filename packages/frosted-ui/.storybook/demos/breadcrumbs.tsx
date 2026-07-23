import React from 'react';
import { Breadcrumbs } from '@aussieljk/frosted';

export default function BreadcrumbsDemo() {
  return (
    <Breadcrumbs.Root>
      <Breadcrumbs.Item render={<a href="#" />} nativeButton={false}>
        Home
      </Breadcrumbs.Item>
      <Breadcrumbs.Dropdown>
        <Breadcrumbs.DropdownItem render={<a href="#">Products</a>} />
        <Breadcrumbs.DropdownItem render={<a href="#">Categories</a>} />
      </Breadcrumbs.Dropdown>
      <Breadcrumbs.Item render={<a href="#" />} nativeButton={false}>
        Bots
      </Breadcrumbs.Item>
      <Breadcrumbs.Item>Sneaker Bot</Breadcrumbs.Item>
    </Breadcrumbs.Root>
  );
}

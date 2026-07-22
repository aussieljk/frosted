import { mergeProps, useRender } from '@base-ui/react';
import classNames from 'classnames';
import * as React from 'react';
import { breadcrumbsPropDefs } from './breadcrumbs.props';

import { Button, DropdownMenu, Text } from '../';
import type { GetPropDefTypes, PropsWithoutColor } from '../../helpers';
import { ChevronRightIcon } from '../../icons';

type BreadcrumbsRootChildrenTypes = React.ReactElement<BreadcrumbsItemProps | BreadcrumbsDropdownProps>;

type BreadcrumbsRootOwnProps = GetPropDefTypes<typeof breadcrumbsPropDefs>;
interface BreadcrumbsRootProps extends PropsWithoutColor<'nav'>, BreadcrumbsRootOwnProps {
  /** Renders the breadcrumbs as a different element or component. Defaults to `<nav>`. */
  render?: useRender.ComponentProps<'nav'>['render'];
}

/**
 * A navigation trail of `Breadcrumbs.Item` (and optionally `Breadcrumbs.Dropdown`) children, separated
 * by chevrons. The last child without an `onClick` is rendered as plain text for the current page.
 *
 * @example
 * ```tsx
 * <Breadcrumbs.Root>
 *   <Breadcrumbs.Item onClick={() => navigate('/')}>Home</Breadcrumbs.Item>
 *   <Breadcrumbs.Item onClick={() => navigate('/docs')}>Docs</Breadcrumbs.Item>
 *   <Breadcrumbs.Item>Components</Breadcrumbs.Item>
 * </Breadcrumbs.Root>
 * ```
 */
const BreadcrumbsRoot = (props: BreadcrumbsRootProps) => {
  const { className, children, render, color = breadcrumbsPropDefs.color.default, ...baseButtonProps } = props;
  const count = React.Children.count(children);

  const breadcrumbsChildren = React.Children.map(children as BreadcrumbsRootChildrenTypes, (child, index) => {
    const isLastItem = index === count - 1;

    const separator = <ChevronRightIcon className="fui-BreadcrumbsSeparator" />;
    if (isLastItem && !child.props.onClick) {
      return (
        <>
          {index > 0 ? separator : null}
          <Text
            render={<div />}
            data-accent-color={color}
            size={'1'}
            className={classNames('fui-reset', 'fui-BreadcrumbsLastItem', child.props.className)}
          >
            {child.props.children}
          </Text>
        </>
      );
    } else {
      const breadcrumbChild = React.cloneElement(child, {
        color,
        ...child.props,
      });
      return (
        <>
          {index > 0 ? separator : null}
          {breadcrumbChild}
        </>
      );
    }
  });

  return useRender({
    render,
    props: mergeProps(
      baseButtonProps as React.ComponentProps<'nav'>,
      {
        'data-accent-color': color,
        className: classNames('fui-BreadcrumbsRoot', className),
        children: breadcrumbsChildren,
      } as React.ComponentProps<'nav'>,
    ),
    defaultTagName: 'nav',
  });
};
BreadcrumbsRoot.displayName = 'BreadcrumbsRoot';

interface BreadcrumbsItemProps extends Omit<React.ComponentProps<typeof Button>, 'variant' | 'size'> {}

/** A single clickable crumb, rendered as a small ghost `Button`. */
const BreadcrumbsItem = (props: BreadcrumbsItemProps) => (
  <Button {...props} size="1" variant={'ghost'} className={classNames('fui-BreadcrumbsItem', props.className)} />
);

BreadcrumbsItem.displayName = 'BreadcrumbsItem';

interface BreadcrumbsDropdownProps extends Omit<
  React.ComponentProps<typeof DropdownMenu.Content>,
  'variant' | 'size'
> {}

/** A collapsed "..." crumb that opens a dropdown menu of `Breadcrumbs.DropdownItem` children. */
const BreadcrumbsDropdown = ({ color, ...props }: BreadcrumbsDropdownProps) => (
  <DropdownMenu.Root>
    <DropdownMenu.Trigger>
      <BreadcrumbsItem color={color}>...</BreadcrumbsItem>
    </DropdownMenu.Trigger>
    <DropdownMenu.Content {...props} size="2" color={color}>
      {props.children}
    </DropdownMenu.Content>
  </DropdownMenu.Root>
);

BreadcrumbsDropdown.displayName = 'BreadcrumbsDropdown';

interface BreadcrumbsDropdownItemProps extends Omit<React.ComponentProps<typeof DropdownMenu.Item>, 'color'> {}

/** A menu item inside `Breadcrumbs.Dropdown`. */
const BreadcrumbsDropdownItem = (props: BreadcrumbsDropdownItemProps) => <DropdownMenu.Item {...props} />;

BreadcrumbsDropdownItem.displayName = 'BreadcrumbsDropdownItem';

export {
  BreadcrumbsDropdown as Dropdown,
  BreadcrumbsDropdownItem as DropdownItem,
  BreadcrumbsItem as Item,
  BreadcrumbsRoot as Root,
};

export type {
  BreadcrumbsDropdownItemProps as DropdownItemProps,
  BreadcrumbsDropdownProps as DropdownProps,
  BreadcrumbsItemProps as ItemProps,
  BreadcrumbsRootProps as RootProps,
};

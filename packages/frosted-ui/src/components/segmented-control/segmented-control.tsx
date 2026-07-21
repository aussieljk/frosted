'use client';

import { Tabs as TabsPrimitive } from '@base-ui/react/tabs';
import classNames from 'classnames';
import * as React from 'react';

type SegmentedControlRootProps = Omit<
  React.ComponentProps<typeof TabsPrimitive.Root>,
  'className' | 'render' | 'orientation'
> &
  React.ComponentProps<'div'>;

/**
 * Container for a segmented control that switches between panels of content.
 *
 * Wraps Base UI's Tabs primitive; selection is controlled via `value` / `defaultValue` /
 * `onValueChange` and each `Trigger` is associated with a matching `Content` panel.
 *
 * @example
 * ```tsx
 * <SegmentedControl.Root defaultValue="account">
 *   <SegmentedControl.List>
 *     <SegmentedControl.Trigger value="account">Account</SegmentedControl.Trigger>
 *     <SegmentedControl.Trigger value="settings">Settings</SegmentedControl.Trigger>
 *   </SegmentedControl.List>
 *   <SegmentedControl.Content value="account">Account panel</SegmentedControl.Content>
 *   <SegmentedControl.Content value="settings">Settings panel</SegmentedControl.Content>
 * </SegmentedControl.Root>
 * ```
 */
const SegmentedControlRoot = (props: SegmentedControlRootProps) => {
  const { className, ...rootProps } = props;
  return <TabsPrimitive.Root {...rootProps} className={classNames('fui-BaseSegmentedControlRoot', className)} />;
};
SegmentedControlRoot.displayName = 'SegmentedControlRoot';

type SegmentedControlListProps = Omit<React.ComponentProps<typeof TabsPrimitive.List>, 'className' | 'render'> &
  React.ComponentProps<'div'>;

/**
 * Groups the segmented control's triggers into the visual "pill" strip.
 *
 * Rendered with `role="tablist"` semantics by the underlying Base UI Tabs primitive.
 */
const SegmentedControlList = (props: SegmentedControlListProps) => {
  const { className, ...listProps } = props;
  return <TabsPrimitive.List {...listProps} className={classNames('fui-BaseSegmentedControlList', className)} />;
};
SegmentedControlList.displayName = 'SegmentedControlList';

type SegmentedControlTriggerProps = Omit<React.ComponentProps<typeof TabsPrimitive.Tab>, 'className' | 'render'> &
  React.ComponentProps<'button'>;

/**
 * A single selectable segment (tab button) that activates its matching `Content` panel.
 */
const SegmentedControlTrigger = (props: SegmentedControlTriggerProps) => {
  const { className, children, ...triggerProps } = props;
  return (
    <TabsPrimitive.Tab
      {...triggerProps}
      className={classNames('fui-reset', 'fui-BaseSegmentedControlTrigger', className)}
    >
      <span className="fui-BaseSegmentedControlTriggerInner">{children}</span>
    </TabsPrimitive.Tab>
  );
};
SegmentedControlTrigger.displayName = 'SegmentedControlTrigger';

type SegmentedControlContentProps = Omit<React.ComponentProps<typeof TabsPrimitive.Panel>, 'className' | 'render'> &
  React.ComponentProps<'div'>;

/**
 * The panel shown when the `Trigger` with the matching `value` is selected.
 */
const SegmentedControlContent = (props: SegmentedControlContentProps) => (
  <TabsPrimitive.Panel {...props} className={classNames('fui-SegmentedControlContent', props.className)} />
);
SegmentedControlContent.displayName = 'SegmentedControlContent';

export {
  SegmentedControlContent as Content,
  SegmentedControlList as List,
  SegmentedControlRoot as Root,
  SegmentedControlTrigger as Trigger,
};
export type {
  SegmentedControlContentProps as ContentProps,
  SegmentedControlListProps as ListProps,
  SegmentedControlRootProps as RootProps,
  SegmentedControlTriggerProps as TriggerProps,
};

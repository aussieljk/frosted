import classNames from 'classnames';
import * as React from 'react';

import { hStackPropDefs } from './h-stack.props';

import type { GetPropDefTypes } from '../../helpers';

type HStackOwnProps = GetPropDefTypes<typeof hStackPropDefs>;
interface HStackProps extends React.ComponentProps<'div'>, HStackOwnProps {
  /** The spacing between children, in pixels. */
  spacing?: number;
}

const HStack = (props: HStackProps) => {
  const { className, style, spacing, alignment = hStackPropDefs.alignment.default, ...stackProps } = props;
  return (
    <div
      {...stackProps}
      className={classNames('fui-HStack', className, `fui-r-alignment-${alignment}`)}
      style={spacing !== undefined ? { gap: spacing, ...style } : style}
    />
  );
};
HStack.displayName = 'HStack';

export { HStack };
export type { HStackProps };

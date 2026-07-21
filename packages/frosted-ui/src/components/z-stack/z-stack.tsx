import classNames from 'classnames';
import * as React from 'react';

import { zStackPropDefs } from './z-stack.props';

import type { GetPropDefTypes } from '../../helpers';

type ZStackOwnProps = GetPropDefTypes<typeof zStackPropDefs>;
interface ZStackProps extends React.ComponentProps<'div'>, ZStackOwnProps {}

const ZStack = (props: ZStackProps) => {
  const { className, alignment = zStackPropDefs.alignment.default, ...stackProps } = props;
  return <div {...stackProps} className={classNames('fui-ZStack', className, `fui-r-alignment-${alignment}`)} />;
};
ZStack.displayName = 'ZStack';

export { ZStack };
export type { ZStackProps };

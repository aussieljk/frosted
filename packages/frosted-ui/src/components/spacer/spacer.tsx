import classNames from 'classnames';
import * as React from 'react';

interface SpacerProps extends React.ComponentProps<'div'> {
  /**
   * The minimum length of the spacer along its stack's axis, in pixels.
   * This is the minimum amount of space that the spacer will take up.
   */
  minLength?: number;
}

const Spacer = (props: SpacerProps) => {
  const { className, style, minLength, ...spacerProps } = props;
  return (
    <div
      {...spacerProps}
      className={classNames('fui-Spacer', className)}
      style={minLength !== undefined ? { flexBasis: minLength, ...style } : style}
    />
  );
};
Spacer.displayName = 'Spacer';

export { Spacer };
export type { SpacerProps };

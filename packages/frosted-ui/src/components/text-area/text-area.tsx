import classNames from 'classnames';
import * as React from 'react';
import { textAreaPropDefs } from './text-area.props';

import type { GetPropDefTypes, PropsWithoutColor } from '../../helpers';

type TextAreaOwnProps = GetPropDefTypes<typeof textAreaPropDefs>;
interface TextAreaProps extends Omit<PropsWithoutColor<'textarea'>, 'size'>, TextAreaOwnProps {}

/**
 * A multi-line text input, rendered as a styled `<textarea>`.
 *
 * All standard textarea attributes (`value`, `onChange`, `rows`, `placeholder`, ...)
 * are forwarded to the inner `<textarea>` element.
 *
 * @example
 * ```tsx
 * <TextArea placeholder="Leave a comment…" rows={4} />
 * ```
 */
const TextArea = (props: TextAreaProps) => {
  const {
    className,
    size = textAreaPropDefs.size.default,
    variant = textAreaPropDefs.variant.default,
    color = textAreaPropDefs.color.default,
    style,
    ...textAreaProps
  } = props;
  return (
    <div
      data-accent-color={color}
      style={style}
      className={classNames('fui-TextAreaRoot', className, `fui-r-size-${size}`, `fui-variant-${variant}`)}
    >
      <textarea className="fui-TextAreaInput" {...textAreaProps} />
      <div className="fui-TextAreaChrome" />
    </div>
  );
};
TextArea.displayName = 'TextArea';

export { TextArea };
export type { TextAreaProps };

import classNames from 'classnames';
import * as React from 'react';

import { overlayPropDefs } from './overlay.props';

import type { GetPropDefTypes } from '../../helpers';

interface OverlayContentProps extends React.ComponentProps<'div'> {}

const OverlayContent = (props: OverlayContentProps) => {
  const { className, ...contentProps } = props;
  return <div {...contentProps} className={classNames('fui-OverlayContent', className)} />;
};
OverlayContent.displayName = 'Overlay.Content';

type OverlayOwnProps = GetPropDefTypes<typeof overlayPropDefs>;
interface OverlayProps extends React.ComponentProps<'div'>, OverlayOwnProps {}

/**
 * Layers `Overlay.Content` children in front of the remaining children,
 * matching SwiftUI's `.overlay(alignment:)` semantics.
 */
const OverlayComponent = (props: OverlayProps) => {
  const { className, alignment = overlayPropDefs.alignment.default, ...overlayProps } = props;
  return <div {...overlayProps} className={classNames('fui-Overlay', className, `fui-r-alignment-${alignment}`)} />;
};
OverlayComponent.displayName = 'Overlay';

const Overlay = Object.assign(OverlayComponent, { Content: OverlayContent });

export { Overlay, OverlayContent };
export type { OverlayContentProps, OverlayProps };

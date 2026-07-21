'use client';

import { Drawer as DrawerPrimitive } from '@base-ui/react/drawer';
import classNames from 'classnames';
import * as React from 'react';
import { Theme } from '../../theme';
import { Heading } from '../heading';
import { Text, type TextProps } from '../text';

type PrimitiveRootProps = React.ComponentProps<typeof DrawerPrimitive.Root>;

/** Close reasons that count as a "dismissal" (blocked when `dismissible={false}`). */
const DISMISS_REASONS = new Set(['escape-key', 'outside-press', 'swipe', 'focus-out', 'close-watcher']);

interface SheetRootProps
  extends Omit<
    PrimitiveRootProps,
    | 'onOpenChange'
    | 'onOpenChangeComplete'
    | 'disablePointerDismissal'
    | 'handle'
    | 'swipeDirection'
    // TODO: add support for snap points
    | 'snapPoints'
    | 'snapToSequentialPoints'
    | 'snapPoint'
    | 'defaultSnapPoint'
    | 'onSnapPointChange'
  > {
  onOpenChange?: (open: boolean) => void;
  /**
   * When `false`, swiping, clicking outside and pressing Escape will not close the sheet.
   * @default true
   */
  dismissible?: boolean;
  /** Fired after the open or close animation ends, with the sheet's `open` state. */
  onAnimationEnd?: (open: boolean) => void;
  /** Fired when the sheet closes. */
  onClose?: () => void;
  /**
   * Legacy prop kept for API compatibility with the previous vaul-based implementation.
   * The sheet content is now always focused when opened.
   */
  autoFocus?: boolean;
}

const SheetRoot = ({
  dismissible = true,
  onOpenChange,
  onAnimationEnd,
  onClose,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  autoFocus,
  ...props
}: SheetRootProps) => (
  <DrawerPrimitive.Root
    disablePointerDismissal={!dismissible}
    onOpenChange={(open, eventDetails) => {
      if (!dismissible && !open && DISMISS_REASONS.has(eventDetails.reason)) {
        eventDetails.cancel();
        return;
      }
      onOpenChange?.(open);
      if (!open) onClose?.();
    }}
    onOpenChangeComplete={onAnimationEnd}
    {...props}
  />
);
SheetRoot.displayName = 'SheetRoot';

// With Base UI, nested sheets are created by simply nesting a Root inside a parent
// sheet's content. `NestedRoot` is kept as an alias for API compatibility.
type SheetNestedRootProps = SheetRootProps;

const SheetNestedRoot = (props: SheetNestedRootProps) => <SheetRoot {...props} />;
SheetNestedRoot.displayName = 'SheetNestedRoot';

interface SheetTriggerProps extends Omit<React.ComponentProps<typeof DrawerPrimitive.Trigger>, 'render' | 'className'> {
  className?: string;
  children: React.ReactElement;
}
const SheetTrigger = ({ children, ...props }: SheetTriggerProps) => (
  <DrawerPrimitive.Trigger {...props} render={children} />
);
SheetTrigger.displayName = 'SheetTrigger';

interface SheetCloseProps extends Omit<React.ComponentProps<typeof DrawerPrimitive.Close>, 'render' | 'className'> {
  className?: string;
  children: React.ReactElement;
}
const SheetClose = ({ children, ...props }: SheetCloseProps) => <DrawerPrimitive.Close {...props} render={children} />;
SheetClose.displayName = 'SheetClose';

const SheetPortal = DrawerPrimitive.Portal as React.ComponentType<{ children?: React.ReactNode }>;

interface SheetOverlayProps extends React.ComponentProps<typeof DrawerPrimitive.Backdrop> {}

const SheetOverlay = ({ className, ...props }: SheetOverlayProps) => (
  <DrawerPrimitive.Backdrop className={classNames('fui-SheetOverlay', className)} {...props} />
);
SheetOverlay.displayName = 'SheetOverlay';

interface SheetContentProps
  extends Omit<React.ComponentProps<typeof DrawerPrimitive.Popup>, 'className' | 'render' | 'style'> {
  className?: string;
  style?: React.CSSProperties;
}

const SheetContent = ({ className, children, ...props }: SheetContentProps) => {
  // Stop keyboard events from propagating to parent floating UI components (e.g., DropdownMenu).
  // This prevents the menu's typeahead from capturing keystrokes when typing in sheet inputs.
  const handleKeyDown = React.useCallback((event: React.KeyboardEvent) => {
    event.stopPropagation();
  }, []);

  return (
    <SheetPortal>
      <>
        <Theme render={<SheetOverlay />} />
        <DrawerPrimitive.Viewport className="fui-SheetViewport">
          <Theme
            render={<DrawerPrimitive.Popup />}
            className={classNames('fui-SheetContent', className)}
            onKeyDownCapture={handleKeyDown}
            {...props}
          >
            <div className="fui-SheetContentHandle" />
            {children}
          </Theme>
        </DrawerPrimitive.Viewport>
      </>
    </SheetPortal>
  );
};
SheetContent.displayName = 'SheetContent';

type SheetHeaderProps = React.ComponentProps<'div'>;
const SheetHeader = ({ children, className, ...props }: SheetHeaderProps) => (
  <div className={classNames('fui-SheetHeader', className)} {...props}>
    {children}
  </div>
);
SheetHeader.displayName = 'SheetHeader';

type SheetBodyProps = React.ComponentProps<'div'>;
const SheetBody = ({ children, className, ...props }: SheetBodyProps) => (
  <div className={classNames('fui-SheetBody', className)} {...props}>
    {children}
  </div>
);
SheetBody.displayName = 'SheetBody';

const SheetFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={classNames('fui-SheetFooter', className)} {...props} />
);
SheetFooter.displayName = 'SheetFooter';

type SheetTitleProps = React.ComponentProps<typeof Heading>;

const SheetTitle = ({ size = '5', weight = 'bold', ...props }: SheetTitleProps) => {
  return <DrawerPrimitive.Title render={<Heading weight={weight} size={size} {...props} />} />;
};
SheetTitle.displayName = 'SheetTitle';

type SheetDescriptionProps = TextProps;

const SheetDescription = ({ size = '3', weight = 'regular', ...props }: SheetDescriptionProps) => {
  return <DrawerPrimitive.Description render={<Text render={<p />} size={size} weight={weight} {...props} />} />;
};
SheetDescription.displayName = 'SheetDescription';

export {
  SheetBody as Body,
  SheetClose as Close,
  SheetContent as Content,
  SheetDescription as Description,
  SheetHeader as Header,
  SheetNestedRoot as NestedRoot,
  SheetRoot as Root,
  SheetTitle as Title,
  SheetTrigger as Trigger,
};

export type {
  SheetBodyProps as BodyProps,
  SheetCloseProps as CloseProps,
  SheetContentProps as ContentProps,
  SheetDescriptionProps as DescriptionProps,
  SheetHeaderProps as HeaderProps,
  SheetNestedRootProps as NestedRootProps,
  SheetRootProps as RootProps,
  SheetTitleProps as TitleProps,
  SheetTriggerProps as TriggerProps,
};

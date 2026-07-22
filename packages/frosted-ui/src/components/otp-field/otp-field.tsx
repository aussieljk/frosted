'use client';

import { OTPField as OTPFieldPrimitive } from '@base-ui/react/otp-field';
import classNames from 'classnames';
import * as React from 'react';
import { otpFieldPropDefs } from './otp-field.props';

import { type GetPropDefTypes, type PropsWithoutColor } from '../../helpers';

// TODO: margin props, variant and size support

type OTPFieldContextValue = GetPropDefTypes<typeof otpFieldPropDefs>;
const OTPFieldContext = React.createContext<OTPFieldContextValue | undefined>(undefined);

/**
 * Legacy slot info kept for backwards compatibility with the previous `input-otp`
 * implementation. Slots are now real `<input>` elements (Base UI `OTPField.Input`)
 * that render their own character and native caret, so these values are static
 * placeholders and are ignored by `OTPField.Slot`.
 */
interface OTPFieldSlotState {
  isActive: boolean;
  char: string | null;
  placeholderChar: string | null;
  hasFakeCaret: boolean;
}

interface OTPFieldRenderProps {
  slots: OTPFieldSlotState[];
  isFocused: boolean;
  isHovering: boolean;
}

type PrimitiveRootProps = React.ComponentProps<typeof OTPFieldPrimitive.Root>;

interface OTPFieldRootOwnProps extends Omit<PrimitiveRootProps, 'render' | 'length' | 'children' | 'className'> {
  className?: string;
  /** The number of OTP slots. */
  maxLength: number;
  /** Callback fired with the new OTP value when it changes. */
  onChange?: (newValue: string) => unknown;
  /** Callback fired when all slots are filled. */
  onComplete?: (...args: any[]) => unknown;
  /**
   * Regex source string used to reject unwanted characters
   * (e.g. `'^\\d+$'`, the old `REGEXP_ONLY_DIGITS` from `input-otp`).
   * Characters that don't match are stripped from the value.
   */
  pattern?: string;
  /** Class name applied to the root container element. */
  containerClassName?: string;
  /** Render function receiving the slots array (legacy `input-otp` API). */
  render?: (props: OTPFieldRenderProps) => React.ReactNode;
  children?: React.ReactNode;
}
type OTPFieldRootProps = OTPFieldRootOwnProps & OTPFieldContextValue;

/**
 * One-time password input split into individual character slots. Wraps Base UI's
 * `OTPField.Root` while keeping the legacy `input-otp`-style API (`maxLength`, `onChange`,
 * `onComplete`, `pattern`, `render`).
 *
 * Supports controlled (`value` + `onValueChange`) and uncontrolled (`defaultValue`) usage
 * via the underlying Base UI props.
 *
 * @example
 * ```tsx
 * <OtpField.Root maxLength={6} onComplete={(code) => verify(code)}>
 *   <OtpField.Group>
 *     {Array.from({ length: 6 }, (_, i) => (
 *       <OtpField.Slot key={i} />
 *     ))}
 *   </OtpField.Group>
 * </OtpField.Root>
 * ```
 */
const OTPFieldRoot = ({
  containerClassName,
  className,
  color = otpFieldPropDefs.color.default,
  maxLength,
  onChange,
  onComplete,
  pattern,
  render,
  children,
  normalizeValue,
  validationType = 'none',
  inputMode = 'numeric',
  ...props
}: OTPFieldRootProps) => {
  const patternRegExp = React.useMemo(() => (pattern ? new RegExp(pattern) : undefined), [pattern]);

  const combinedNormalizeValue = React.useMemo(() => {
    if (!patternRegExp && !normalizeValue) return undefined;
    return (value: string) => {
      const normalized = normalizeValue ? normalizeValue(value) : value;
      if (!patternRegExp) return normalized;
      return normalized
        .split('')
        .filter((char) => patternRegExp.test(char))
        .join('');
    };
  }, [patternRegExp, normalizeValue]);

  const slots = React.useMemo<OTPFieldSlotState[]>(
    () =>
      Array.from({ length: maxLength }, () => ({
        isActive: false,
        char: null,
        placeholderChar: null,
        hasFakeCaret: false,
      })),
    [maxLength],
  );

  return (
    <OTPFieldContext.Provider value={{ color }}>
      <OTPFieldPrimitive.Root
        length={maxLength}
        className={classNames('fui-OTPFieldRoot', containerClassName, className)}
        validationType={validationType}
        inputMode={inputMode}
        normalizeValue={combinedNormalizeValue}
        onValueChange={onChange && ((value) => onChange(value))}
        onValueComplete={onComplete && ((value) => onComplete(value))}
        {...props}
      >
        {render ? render({ slots, isFocused: false, isHovering: false }) : children}
      </OTPFieldPrimitive.Root>
    </OTPFieldContext.Provider>
  );
};

OTPFieldRoot.displayName = 'OTPFieldRoot';

type OTPFieldGroupProps = PropsWithoutColor<'div'> & Partial<OTPFieldContextValue>;

/**
 * Visually groups adjacent slots and applies the accent color from the surrounding Root
 * (overridable via its own `color` prop).
 */
const OTPFieldGroup = ({ className, color, ...props }: OTPFieldGroupProps) => {
  const context = React.useContext(OTPFieldContext);
  const resolvedColor = color ?? context?.color ?? otpFieldPropDefs.color.default;
  return <div data-accent-color={resolvedColor} className={classNames('fui-OTPFieldGroup', className)} {...props} />;
};
OTPFieldGroup.displayName = 'OTPFieldGroup';

interface OTPFieldSlotProps
  extends
    Omit<React.ComponentProps<typeof OTPFieldPrimitive.Input>, 'children' | 'className'>,
    Partial<OTPFieldSlotState> {
  className?: string;
}

/**
 * A single character input of the OTP field. Wraps Base UI's `OTPField.Input`, so each slot is
 * a real `<input>` with a native caret. Legacy `input-otp` slot-state props (`char`, `isActive`,
 * `placeholderChar`, `hasFakeCaret`) are accepted for backwards compatibility but ignored.
 */
// The legacy slot state props are intentionally destructured away: slots now render their own character.
const OTPFieldSlot = ({ char, hasFakeCaret, isActive, placeholderChar, className, ...props }: OTPFieldSlotProps) => {
  return <OTPFieldPrimitive.Input className={classNames('fui-OTPFieldSlot', className)} {...props} />;
};
OTPFieldSlot.displayName = 'OTPFieldSlot';

type OTPFieldSeparatorProps = React.ComponentProps<'div'>;

/** Decorative separator (with `role="separator"`) rendered between slot groups. */
const OTPFieldSeparator = ({ ...props }: OTPFieldSeparatorProps) => (
  <div role="separator" className="fui-OTPFieldSeparator" {...props}></div>
);
OTPFieldSeparator.displayName = 'OTPFieldSeparator';

export { OTPFieldGroup as Group, OTPFieldRoot as Root, OTPFieldSeparator as Separator, OTPFieldSlot as Slot };
export type {
  OTPFieldGroupProps as GroupProps,
  OTPFieldRootProps as RootProps,
  OTPFieldSeparatorProps as SeparatorProps,
  OTPFieldSlotProps as SlotProps,
};

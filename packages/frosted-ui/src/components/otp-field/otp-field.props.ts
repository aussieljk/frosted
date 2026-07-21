import { colorProp } from '../../helpers';

const otpFieldPropDefs = {
  /**
   * Overrides the theme accent color for the OTP slots.
   * @default 'gray'
   */
  color: { ...colorProp, default: 'gray' },
} satisfies {
  color: typeof colorProp;
};

export { otpFieldPropDefs };

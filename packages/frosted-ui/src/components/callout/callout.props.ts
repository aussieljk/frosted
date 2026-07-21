import { colorProp } from '../../helpers';

const calloutRootPropDefs = {
  /**
   * The color of the callout, applied to its icon, title and description. Inherits the theme accent
   * color when not set.
   */
  color: { ...colorProp, default: undefined },
} satisfies {
  color: typeof colorProp;
};

export { calloutRootPropDefs };

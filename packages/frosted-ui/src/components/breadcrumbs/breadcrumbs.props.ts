import { colorProp } from '../../helpers';

const breadcrumbsPropDefs = {
  /**
   * The color of the breadcrumb items and separators. Passed down to each item unless it sets its own.
   * @default 'gray'
   */
  color: { ...colorProp, default: 'gray' },
} satisfies {
  color: typeof colorProp;
};

export { breadcrumbsPropDefs };

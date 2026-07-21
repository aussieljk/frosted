import type { PropDef } from '../../helpers';

const alignments = [
  'center',
  'leading',
  'trailing',
  'top',
  'bottom',
  'topLeading',
  'topTrailing',
  'bottomLeading',
  'bottomTrailing',
  'centerFirstTextBaseline',
  'centerLastTextBaseline',
  'leadingFirstTextBaseline',
  'leadingLastTextBaseline',
  'trailingFirstTextBaseline',
  'trailingLastTextBaseline',
] as const;

const gridPropDefs = {
  alignment: { type: 'enum', values: alignments, default: 'center' },
} satisfies {
  alignment: PropDef<(typeof alignments)[number]>;
};

export { gridPropDefs };

import type { PropDef } from '../../helpers';

const alignments = ['top', 'center', 'bottom', 'firstTextBaseline', 'lastTextBaseline'] as const;

const hStackPropDefs = {
  alignment: { type: 'enum', values: alignments, default: 'center' },
} satisfies {
  alignment: PropDef<(typeof alignments)[number]>;
};

export { hStackPropDefs };

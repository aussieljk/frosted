import type { PropDef } from '../../helpers';

const alignments = ['leading', 'center', 'trailing'] as const;

const vStackPropDefs = {
  alignment: { type: 'enum', values: alignments, default: 'center' },
} satisfies {
  alignment: PropDef<(typeof alignments)[number]>;
};

export { vStackPropDefs };

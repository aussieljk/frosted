import path from 'path';
import autoprefixer from 'autoprefixer';
import postcssCombineDuplicatedSelectors from 'postcss-combine-duplicated-selectors';
import postcssCustomMedia from 'postcss-custom-media';
import postcssDiscardEmpty from 'postcss-discard-empty';
import postcssImport from 'postcss-import';
import postcssNesting from 'postcss-nesting';
import postcssFrostedUi from './postcss-frosted-ui';
import removeP3 from './postcss-remove-p3';

export default {
  plugins: [
    postcssImport({
      path: [path.relative(process.cwd(), '../')],
    }),
    postcssNesting,
    postcssFrostedUi,
    postcssCustomMedia,
    postcssCombineDuplicatedSelectors,
    removeP3(),
    postcssDiscardEmpty,
    autoprefixer,
  ],
};

const postcssFrostedUi = () => ({
  postcssPlugin: 'postcss-frosted-ui',
  Comment(comment) {
    // Remove all comments from CSS source
    comment.remove();
  },
});

postcssFrostedUi.postcss = true;

export default postcssFrostedUi;

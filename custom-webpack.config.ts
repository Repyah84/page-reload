module.exports = {
  entry: {
    background: './src/background/background.ts',
    content: './src/content.ts',
  },
  optimization: {
    runtimeChunk: false,
  },
};

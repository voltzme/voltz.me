const path = require('path');
const sourcePath = path.resolve(__dirname, 'src');

module.exports = {
  context: sourcePath,
  mode: 'development',
  stats: 'errors-only',

  resolve: {
    alias: {
      '~': sourcePath,
    },
    modules: [
      'node_modules',
    ],
  },
};

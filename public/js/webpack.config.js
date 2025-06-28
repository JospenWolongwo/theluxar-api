const path = require('path');
module.exports = {
  mode: 'production',
  entry: path.join(__dirname, 'formValidation.js'),
  resolve: {
    extensions: ['.js'],
  },
  output: {
    path: path.join(__dirname, '../../dist/public/js/'),
    filename: 'bundle.js',
    clean: true,
    library: {
      name: 'formValidation',
      type: 'assign',
    },
  },
  // Add this for better debugging
  devtool: 'source-map'
};
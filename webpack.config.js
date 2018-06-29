'use strict';

module.exports = {
  entry: __dirname + '/src/k-util.ts',
  mode: 'production',
  output: {
    path: __dirname + '/dist',
    filename: 'k-util.min.js',
    library: 'kUtil',
    libraryTarget: 'umd'
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'awesome-typescript-loader'
      },
      {
        enforce: 'pre',
        test: /\.js$/,
        loader: 'source-map-loader'
      }
    ]
  },
  devtool: '#nosources-source-map'
};

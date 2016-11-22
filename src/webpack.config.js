var webpack = require("webpack");

module.exports = {
  entry: {
    algorithm: './core/algorithm/Test.ts',
    display: './core/display/display.module.js'
  },
  output: {
      path: './build',  
      filename: '[name].bundle.js'
  },
  resolve: {
      // Add `.ts` and `.tsx` as a resolvable extension.
      extensions: ['', '.webpack.js', '.web.js', '.ts', '.tsx', '.js']
  },
  module: {
      loaders: [
          // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
          { test: /\.tsx?$/, loader: 'ts-loader' }
      ]
  }
}
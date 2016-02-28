var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: [
    './js/app'
  ],
  devtool: 'eval-source-map',
  output: {
    path: __dirname,
    filename: 'app.js',
    publicPath: '/js/'
  },
  module: {
  loaders: [{
    test: /\.js$/,
    loaders: ['babel'],
    include: path.join(__dirname, 'js')
  }]
}
};
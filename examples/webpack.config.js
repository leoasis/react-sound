var webpack = require('webpack');

var config = {
  entry: {
    app: ['react-hot-loader/patch', './src/index']
  },
  output: {
    filename: '[name].js',
    path: '/build',
    publicPath: 'http://localhost:3000/build'
  },
  resolve: {
    alias: {
      'react-sound': __dirname + '/../src'
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          cacheDirectory: true,
          plugins: [
            'react-hot-loader/babel'
          ]
        }
      }
    ]
  },
  plugins: [
    new webpack.NamedModulesPlugin()
  ]
};

module.exports = config;

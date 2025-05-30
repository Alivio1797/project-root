const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './src/main.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: { presets: ['@babel/preset-env'] },
        },
      },
    ],
  },
  resolve: {
    alias: {
      leaflet: path.resolve(__dirname, 'node_modules/leaflet'),
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
      inject: 'body',
      filename: 'index.html',
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'public/sw.js', to: '' },
        { from: 'public/icons', to: 'icons' },
        { from: 'public/manifest.json', to: '' },
      ],
    }),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
      watch: false,   // disable watching dist folder to prevent reload loop
    },
    compress: true,
    port: 3000,
    hot: true,
    historyApiFallback: true,
    proxy: {
      '/subscribe': {
        target: 'http://localhost:4000',
        changeOrigin: true,
        timeout: 120000,
        proxyTimeout: 120000,
      },
      '/unsubscribe': {
        target: 'http://localhost:4000',
        changeOrigin: true,
        timeout: 120000,
        proxyTimeout: 120000,
      },
      '/push': {
        target: 'http://localhost:4000',
        changeOrigin: true,
        timeout: 120000,
        proxyTimeout: 120000,
      },
    },
  },
};
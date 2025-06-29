const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  mode: 'development',
  entry: './src/webparts/uptimeStatus/UptimeStatusWebPart.ts',
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    fallback: {
      "resx-strings": false,
      "@ms/sp-telemetry": false,
      "@ms/sp-client-shared": false,
      "@ms/sp-load-themed-styles": false,
      "./test/RequireJsMock": false,
      "./test/SystemJsMock": false,
    },
    alias: {
      'UptimeStatusWebPartStrings': path.resolve(__dirname, 'src/webparts/uptimeStatus/loc/en-us.js'),
      './test/RequireJsMock': path.resolve(__dirname, 'webpack-stubs/RequireJsMock.js'),
      './test/SystemJsMock': path.resolve(__dirname, 'webpack-stubs/SystemJsMock.js'),
    }
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    compress: true,
    port: 4321,
    proxy: [
      {
        context: ['/api'],
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    ],
    open: false,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'dev-workbench.html'),
      filename: 'index.html',
    }),
    new webpack.IgnorePlugin({
      resourceRegExp: /^\.\/test\/(RequireJsMock|SystemJsMock)$/,
    }),
    new webpack.NormalModuleReplacementPlugin(
      /\.\/test\/RequireJsMock$/,
      path.resolve(__dirname, 'webpack-stubs/RequireJsMock.js')
    ),
    new webpack.NormalModuleReplacementPlugin(
      /\.\/test\/SystemJsMock$/,
      path.resolve(__dirname, 'webpack-stubs/SystemJsMock.js')
    ),
  ],
};

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
        use: {
          loader: 'ts-loader',
          options: {
            compilerOptions: {
              target: 'es2015',
              module: 'es2015'
            }
          }
        },
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
      "path": require.resolve("path-browserify"),
      "crypto": false,
      "fs": false,
      "stream": false,
      "util": false,
    },
    alias: {
      'UptimeStatusWebPartStrings': path.resolve(__dirname, 'src/webparts/uptimeStatus/loc/en-us.js'),
      './test/RequireJsMock': path.resolve(__dirname, 'webpack-stubs/RequireJsMock.js'),
      './test/SystemJsMock': path.resolve(__dirname, 'webpack-stubs/SystemJsMock.js'),
      '@microsoft/sp-lodash-subset': path.resolve(__dirname, 'webpack-stubs/LodashSubsetMock.js'),
      '@microsoft/sp-core-library': path.resolve(__dirname, 'webpack-stubs/SpCoreLibraryMock.js'),
      '@microsoft/sp-webpart-base': path.resolve(__dirname, 'webpack-stubs/SpWebpartBaseMock.js'),
      '@microsoft/sp-property-pane': path.resolve(__dirname, 'webpack-stubs/SpPropertyPaneMock.js'),
    }
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
    library: {
      type: 'umd'
    },
    globalObject: 'this'
  },
  devServer: {
    static: [
      {
        directory: path.join(__dirname, 'dist'),
      },
      {
        directory: path.join(__dirname, 'public'),
        publicPath: '/public',
      },
      // Serve public/css and public/js directly from root paths to resolve 404s
      {
        directory: path.join(__dirname, 'public/css'),
        publicPath: '/public/css',
      },
      {
        directory: path.join(__dirname, 'public/js'),
        publicPath: '/public/js',
      },
      {
        directory: path.join(__dirname, 'src/webparts/uptimeStatus/angularApp/dist/angularApp'),
        publicPath: '/angular-app',
      }
    ],
    compress: true,
    port: 4321,
    proxy: [
      {
        context: [
          '/main.js',
          '/runtime.js',
          '/polyfills.js',
          '/vendor.js',
          '/styles.css',
          '/styles.js'
        ],
        target: 'http://localhost:4200',
        changeOrigin: true,
        secure: false,
        logLevel: 'debug'
      },
      {
        context: ['/api'],
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false
      }
    ],
    open: false,
    historyApiFallback: {
      index: '/index.html',
    },
    // Add MIME type handling for CSS and JS files
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src/integrated-workbench.html'),
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
    // Define environment variables
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development'),
      'process.env.MOCK_API': JSON.stringify(true),
    }),
  ],
};

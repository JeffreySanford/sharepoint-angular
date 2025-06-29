'use strict';

const build = require('@microsoft/sp-build-web');
const gulp = require('gulp');

build.addSuppression(`Warning - [sass] The local CSS class 'ms-Grid' is not camelCase and will not be type-safe.`);

build.configureWebpack.mergeConfig({
  additionalConfiguration: (config) => {
    // Copy Angular build output to SPFx dist
    config.module.rules.push({
      test: /\.(js|css)$/,
      include: /src\/webparts\/uptimeStatus\/angularApp\/dist/,
      use: {
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          outputPath: 'angularApp/',
          publicPath: './'
        }
      }
    });
    return config;
  }
});

build.initialize(gulp);
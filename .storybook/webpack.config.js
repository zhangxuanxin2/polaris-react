// you can use this file to add your custom webpack plugins, loaders and anything you like.
// This is just the basic way to add additional webpack configurations.
// For more information refer the docs: https://storybook.js.org/configurations/custom-webpack-config

const path = require('path');

const {
  svgOptions: svgOptimizationOptions,
} = require('@shopify/images/optimize');
const postcssShopify = require('postcss-shopify');

const ICON_PATH_REGEX = /icons\//;
const IMAGE_PATH_REGEX = /\.(jpe?g|png|gif|svg)$/;

module.exports = (baseConfig, env, config) => {
  // When transpiling TS using isolatedModules, the compiler doesn't strip
  // out exported types as it doesn't know if an item is a type or not.
  // Ignore those warnings as we don't care about them.
  const stats = {warningsFilter: /export .* was not found in/};
  baseConfig.stats = stats;
  baseConfig.devServer = {stats};

  const cacheDir = path.resolve(__dirname, '../build/cache/storybook');

  const extraRules = [
    {
      test: /src\/components\/.+\/README\.md$/,
      use: [
        {
          loader: 'babel-loader',
          options: {
            babelrc: false,
            minified: env === 'PRODUCTION',
            presets: [
              ['shopify/web', {modules: false}],
              ['shopify/react', {hot: true}],
            ],
            cacheDirectory: `${cacheDir}/markdown`,
          },
        },
        {
          loader: `${__dirname}/polaris-readme-loader.js`,
        },
      ],
    },
    {
      test: /\.tsx?$/,
      use: [
        {
          loader: 'babel-loader',
          options: {
            babelrc: false,
            minified: env === 'PRODUCTION',
            presets: [
              ['shopify/web', {modules: false}],
              ['shopify/react', {hot: true}],
            ],
            cacheDirectory: `${cacheDir}/typescript`,
          },
        },
        {
          loader: 'ts-loader',
          options: {
            silent: true,
            transpileOnly: true,
            experimentalFileCaching: true,
          },
        },
      ],
    },
    {
      test(resource) {
        return ICON_PATH_REGEX.test(resource) && resource.endsWith('.svg');
      },
      use: [
        {
          loader: '@shopify/images/icon-loader',
        },
        {
          loader: 'image-webpack-loader',
          options: {
            svgo: svgOptimizationOptions(),
          },
        },
      ],
    },
    {
      test(resource) {
        return (
          IMAGE_PATH_REGEX.test(resource) && !ICON_PATH_REGEX.test(resource)
        );
      },
      use: [
        {
          loader: 'url-loader',
          options: {
            limit: 10000,
          },
        },
      ],
    },
    {
      test: /\.scss$/,
      use: [
        {
          loader: 'style-loader',
        },
        {
          loader: 'css-loader',
          query: {
            sourceMap: false,
            modules: true,
            importLoaders: 1,
            localIdentName: '[name]-[local]_[hash:base64:5]',
          },
        },
        {
          loader: 'postcss-loader',
          options: {
            plugins: () => postcssShopify(),
            sourceMap: false,
          },
        },
        {
          loader: 'sass-loader',
          options: {
            sourceMap: false,
            includePaths: [path.resolve(__dirname, '..', 'src', 'styles')],
          },
        },
        {
          loader: 'sass-resources-loader',
          options: {
            resources: [
              path.resolve(__dirname, '..', 'src', 'styles', 'foundation.scss'),
              path.resolve(__dirname, '..', 'src', 'styles', 'shared.scss'),
            ],
          },
        },
      ],
    },
  ];

  baseConfig.module.rules = [baseConfig.module.rules[0], ...extraRules];

  baseConfig.resolve.extensions.push('.ts', '.tsx');
  baseConfig.resolve.alias = {
    '@shopify/polaris': path.resolve(__dirname, '..', 'src'),
  };
  return baseConfig;
};

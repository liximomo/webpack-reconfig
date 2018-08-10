'use strict';

const deepFreeze = require('deep-freeze');
const extend = require('../extend');
const make = require('../make');
const Rule = require('../../webpack-helpers/rule');
const Plugin = require('../../webpack-helpers/plugin');
const Loader = require('../../webpack-helpers/loader');
// const Slot = require('../config-helper/Slot');

jest.mock('a-webpack-plugin');
jest.mock('b-webpack-plugin');
jest.mock('a-sub-b-webpack-plugin');

describe('extend', () => {
  test('Rule should be merged properly', () => {
    const a = {
      output: {
        filename: '[name].js',
      },

      rule: [
        Rule('pre', { parser: { requireEnsure: false } }),
        Rule('js', {
          test: /\.(js|jsx|mjs)$/,
          include: './src',
          use: [
            'thread-loader',
            {
              loader: 'babel-loader',
              options: {
                // @remove-on-eject-begin
                babelrc: false,
                presets: ['babel-preset-react-app'],
                // @remove-on-eject-end
                // This is a feature of `babel-loader` for webpack (not Babel itself).
                // It enables caching results in ./node_modules/.cache/babel-loader/
                // directory for faster rebuilds.
                cacheDirectory: true,
              },
            },
          ],
        }),
      ],
    };
    const b = {
      output: {
        filename: '[name].[hash].js',
      },

      rule: [
        Rule('pre', { parser: { requireEnsure: true } }),
        Rule('js', {
          test: /\.(js|jsx|mjs)$/,
          include: './src',
          use: [
            {
              loader: 'babel-loader',
              options: {
                // @remove-on-eject-begin
                babelrc: false,
                presets: ['babel-preset-react-app'],
                // @remove-on-eject-end
                // This is a feature of `babel-loader` for webpack (not Babel itself).
                // It enables caching results in ./node_modules/.cache/babel-loader/
                // directory for faster rebuilds.
                cacheDirectory: false,
              },
            },
          ],
        }),
        Rule('css', { use: ['style-loader'] }),
      ],
    };

    expect(extend(a, b)).toEqual({
      output: {
        filename: '[name].[hash].js',
      },

      rule: [
        Rule('pre', { parser: { requireEnsure: true } }),
        Rule('js', {
          test: /\.(js|jsx|mjs)$/,
          include: './src',
          use: [
            {
              loader: 'babel-loader',
              options: {
                // @remove-on-eject-begin
                babelrc: false,
                presets: ['babel-preset-react-app'],
                // @remove-on-eject-end
                // This is a feature of `babel-loader` for webpack (not Babel itself).
                // It enables caching results in ./node_modules/.cache/babel-loader/
                // directory for faster rebuilds.
                cacheDirectory: false,
              },
            },
          ],
        }),
        Rule('css', { use: ['style-loader'] }),
      ],
    });
  });

  test('Plugin should be merged properly', () => {
    const a = [
      Plugin('a-webpack-plugin', { a: 1, b: 2 }),
      Plugin('b-webpack-plugin', { a: 1, b: 2 }),
    ];
    const b = [
      Plugin('a-webpack-plugin', { a: 11, b: 22 }),
      Plugin('b-webpack-plugin', { a: 1, b: 22 }),
      Plugin('a-sub-b-webpack-plugin/b', { a: 11, b: 22 }),
    ];
    expect(extend(a, b)).toEqual([
      Plugin('a-webpack-plugin', { a: 11, b: 22 }),
      Plugin('b-webpack-plugin', { a: 1, b: 22 }),
      Plugin('a-sub-b-webpack-plugin/b', { a: 11, b: 22 }),
    ]);
  });

  test('Extend should not modify object', () => {
    const cssConfig = {
      use: [
        Loader('style-loader'),
        Loader('css-loader'),
        Loader('postcss-loader', {
          ident: 'postcss',
        }),
      ],
    };
    const cssRule = Rule('css', cssConfig);

    const scssRule = extend(cssRule, {
      test: /\.scss$/,
      use: [Loader('sass-loader')],
    });

    const extendCss = () =>
      extend(cssRule, {
        test: /\.scss$/,
        use: [Loader('sass-loader')],
      });

    deepFreeze(cssRule);
    deepFreeze(cssConfig);
    expect(extendCss).not.toThrow();
  });

  test('Helper should be merged with plain object', () => {
    const cssRule = Rule('css', {
      use: [
        Loader('style-loader'),
        Loader('css-loader'),
        Loader('postcss-loader', {
          ident: 'postcss',
        }),
      ],
    });

    const scssRule = extend(cssRule, {
      test: /\.scss$/,
      use: [Loader('sass-loader')],
    });

    expect(make(scssRule)).toEqual({
      test: /\.scss$/,
      use: [
        {
          loader: 'style-loader',
        },
        {
          loader: 'css-loader',
        },
        {
          loader: 'postcss-loader',
          options: {
            ident: 'postcss',
          },
        },
        {
          loader: 'sass-loader',
        },
      ],
    });
  });
});

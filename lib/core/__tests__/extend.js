'use strict';

const deepFreeze = require('deep-freeze');
const extend = require('../extend');
const make = require('../make');
const Rule = require('../../webpack-helpers/rule');
const Plugin = require('../../webpack-helpers/plugin');
const Loader = require('../../webpack-helpers/loader');
const Slot = require('../../webpack-helpers/base').Slot;
// const Slot = require('../config-helper/Slot');

jest.mock('a-webpack-plugin');
jest.mock('b-webpack-plugin');
jest.mock('a-sub-b-webpack-plugin');

test('extend should return src when obj is "null" or "undefined"', () => {
  const a = {
    rule: [Rule('pre')],
  };
  const b = {
    rule: [Rule('pre', { parser: { requireEnsure: true } })],
  };

  expect(extend(a, b)).toEqual({
    rule: [Rule('pre', { parser: { requireEnsure: true } })],
  });
  expect(extend(null, 1)).toEqual(1);
  expect(extend(undefined, 1)).toEqual(1);
});

test('extend should return obj when src is "undefined"', () => {
  expect(extend(1, undefined)).toEqual(1);
  expect(extend(null, undefined)).toEqual(null);
  expect(extend(2, null)).toEqual(null);
});

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

  const extendCss = () =>
    extend(cssRule, {
      test: /\.scss$/,
      use: [Loader('sass-loader')],
    });

  deepFreeze(cssRule);
  deepFreeze(cssConfig);
  expect(extendCss).not.toThrow();
});

test('Helper should be merged properly', () => {
  const cssRule = Rule('css', {
    use: [
      Loader('style-loader', {
        loader: 'style-loader',
      }),
      Loader('css-loader', {
        loader: 'css-loader',
      }),
      Loader('postcss-loader', {
        loader: 'postcss-loader',
        options: {
          ident: 'postcss',
        },
      }),
    ],
  });

  const scssRule = extend(cssRule, {
    test: /\.scss$/,
    use: [
      Loader('sass-loader', {
        loader: 'sass-loader',
      }),
    ],
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

test('Slot should not be merged with mode OVERRIDE', () => {
  const a = [Slot('slot1', { a: 1, b: 2 }), Slot('slot2', { a: 1, b: 2 })];
  const b = [Slot.override('slot3', { a: 11, b: 22 })];
  expect(extend(a, b)).toEqual([Slot('slot1', { a: 1, b: 2 }), Slot('slot2', { a: 1, b: 2 })]);
});

test('Slot should be inerted properly', () => {
  const a = ['a', Slot('slot1', { name: 'slot1' }), 'b', Slot('slot2', { name: 'slot2' })];
  const b = [
    Slot.prepend('slot3', { name: 'slot3' }),
    Slot.insertBefore('slot1', 'slot4', { name: 'slot4' }),
    Slot.insertAfter('slot2', 'slot5', { name: 'slot5' }),
    Slot.append('slot6', { name: 'slot6' }),
  ];

  const mergerd = extend(a, b);
  expect(mergerd[0].id).toEqual('slot3');
  expect(mergerd[2].id).toEqual('slot4');
  expect(mergerd[3].id).toEqual('slot1');
  expect(mergerd[5].id).toEqual('slot2');
  expect(mergerd[6].id).toEqual('slot5');
  expect(mergerd[7].id).toEqual('slot6');
});

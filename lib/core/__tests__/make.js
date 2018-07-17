const make = require('../make');
const Rule = require('../../webpack-helpers/rule');
const { Slot } = require('../../webpack-helpers/base');

describe('make', () => {
  test('Rule should be converted to webpack rule config', () => {
    const rules = [
      Rule('pre', { parser: { requireEnsure: true }, noTest: true }),
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
      Rule('css', { test: /\.css$/, use: ['style-loader'] }),
    ];

    expect(make(rules)).toEqual([
      { parser: { requireEnsure: true } },
      {
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
      },
      { test: new RegExp('\\.css$'), use: ['style-loader'] },
    ]);
  });

  test('Slot should be unboxing', () => {
    const slot = Slot(
      'test',
      Rule('js', {
        use: [
          Slot('babel-loader', {
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
          }),
        ],
      })
    );

    expect(make(slot)).toEqual({
      test: /\.js$/,
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
    });
  });
});

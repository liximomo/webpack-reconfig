const { inspect } = require('util');
const { Slot, Inst, Rule, Loader, Plugin, extend, make } = require('../index');

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

const assetsRule = Rule('assets', {
  test: /\.(jpe?g|png|gif|svg)$/i,
  use: [
    Loader('url-loader', {
      limit: 10000,
      name: 'media/[name].[hash:8].[ext]',
    }),
  ],
});

const config = {
  devtool: 'cheap-module-source-map',

  performance: { hints: false },

  module: {
    rules: [
      Rule('vue', {
        loader: 'vue-loader',
        options: {
          transformToRequire: {
            video: ['src', 'poster'],
            source: 'src',
            img: 'src',
            image: 'xlink:href',
          },
        },
      }),
      Rule('jsx', {
        test: /\.jsx?$/,
        use: [
          Loader('babel-loader', {
            babelrc: false,
            presets: [
              [
                'es2015',
                {
                  modules: false, // for webpack2
                },
              ],
              'react',
              'stage-0',
            ],
            plugins: [
              [
                'transform-runtime',
                {
                  helpers: false,
                  polyfill: false,
                  regenerator: true, // async/await
                },
              ],
            ],
          }),
        ],
      }),
      cssRule,
      scssRule,
      assetsRule,
    ],
  },

  resolve: {
    extensions: ['.js', '.json', '.jsx', '.vue'],
  },

  plugins: [
    Plugin('vue-loader/lib/plugin'),
    Plugin('webpack->DefinePlugin', {
      'process.env.TARGET': JSON.stringify('browser'),
      'process.env.NODE_ENV': JSON.stringify('development'),
      IS_PROD: JSON.stringify(false),
      __DEV__: JSON.stringify(true),
    }),
  ],
};

console.log(inspect(make(config), { depth: Infinity }));

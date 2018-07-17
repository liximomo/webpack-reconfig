const { Slot, Inst, Rule, Plugin, merge } = require('webpack-reconfig');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

const cssRule = Rule('css', {
  use: [
    Loader('style-loader'),
    Loader('css-loader'),
    Loader('postcss-loader', {
      ident: 'postcss',
    }),
  ],
});

const scssRule = merge(cssRule, {
  use: [Loader('sass-loader')],
});

module.exports = {
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

      {
        test: /\.(s?css|style)$/,
        include: pathCfg.style,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            ident: 'postcss',
          },
          {
            loader: 'sass-loader',
            options: {
              includePaths: pathCfg.styleInclude,
            },
          },
        ],
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
            options: {
              attrs: ['img:src'],
            },
          },
        ],
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        include: pathCfg.style,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000,
              name: 'img/[name]_[hash].[ext]',
            },
          },
        ],
      },
      {
        test: /\.(mst|tml)$/i,
        loader: 'raw-loader',
      },
    ],
  },

  resolve: {
    modules: pathCfg.modules,
    alias: {
      root: pathCfg.src,
      '@pc': pathCfg.pcPages,
      '@hybird': pathCfg.hybridPages,
      '@mobile': pathCfg.mobilePages,
      '@component': pathCfg.componentPages,
      'vue-comp': pathCfg.vueComponents,
    },
    extensions: ['.js', '.json', '.jsx', '.vue'],
  },

  plugins: [
    new VueLoaderPlugin(),
    new webpack.ProvidePlugin({
      React: 'react',
      ReactDOM: 'react-dom',
      PropTypes: 'prop-types',
      cn: 'classnames',
    }),
    new webpack.DefinePlugin({
      'process.env.TARGET': JSON.stringify(TARGET.BROWSER),
      'process.env.NODE_ENV': JSON.stringify(NODE_ENV.DEVELOPMENT),
      IS_PROD: JSON.stringify(false),
      __DEV__: JSON.stringify(true),
    }),
    // ensure stable module ids
    new webpack.NamedModulesPlugin(),
    new CleanWebpackPlugin([pathCfg.output], {
      root: pathCfg.projectPath,
      verbose: false,
      dry: false,
      exclude: ['lib', 'html'],
    }),
    new webpack.DllReferencePlugin({
      context: pathCfg.projectPath,
      manifest: require('../vendor-dev-manifest.json'),
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
  ],

  _custom: {
    hot: true,
    html: {
      dllfile: path.join(config.prod.publicPath, pathCfg.vendor, 'vendor.dev.js'),
    },
  },
};

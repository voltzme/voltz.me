const fs = require('fs');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');
const GetText = require('node-gettext');
const GetTextParser = require('gettext-parser');

const sourcePath = path.resolve(__dirname, 'src');
const localesPath = path.resolve(__dirname, 'locales');

const defaultLocale = 'en';
const locales = ['ru'];

const files = [
  'index.html',
];

const gt = new GetText();
addLocale(defaultLocale);
locales.forEach((locale) => addLocale(locale));

module.exports = (env) => {
  if (!env || (!env.outputPath && !env.devServer)) {
    throw new Error(
      'Please specify output path using --env.outputPath=... or use --env.devServer',
    );
  }

  const outputPath = path.resolve(__dirname, env.outputPath || './tmp/ui');

  return {
    context: sourcePath,
    mode: env && env.mode || 'development',
    stats: 'errors-only',
    output: {
      path: outputPath,
      publicPath: env.cdn || '/',

      filename: 'assets/[name].[hash].js',
      chunkFilename: 'assets/[name].[chunkhash].js',
    },

    resolve: {
      alias: {
        '~': sourcePath,
      },
      modules: [
        'node_modules',
      ],
    },

    entry: {
      site: [
        './js/site.js',
        './scss/site.scss',
      ],
    },

    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/preset-env',
              ],
            },
          },
        },
        {
          test: /\.(scss|sass|css)$/,
          sideEffects: true,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1,
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                plugins: [
                  require('autoprefixer'),
                  require('cssnano'),
                ],
              },
            },
            'sass-loader',
          ],
        },

        {
          test: /\/assets\/(.+)$/,
          use: {
            loader: 'file-loader',
            options: {
              name: '[path][name].[hash].[ext]',
            },
          },
        },
      ],
    },

    plugins: [
      ...getPages().map(
        ([filename, locale]) => page(filename, locale),
      ),

      new webpack.DefinePlugin({
        'process.env': {NODE_ENV: JSON.stringify(process.env.NODE_ENV)},
      }),

      new MiniCssExtractPlugin({
        filename: 'assets/[name].[hash].css',
        chunkFilename: 'assets/[name].[hash].css',
        allChunks: true,
      }),
    ],

    optimization: {
      minimize: env && env.mode === 'production',
    },

    devServer: {
      port: 8080,
    },
  };
};

function getPages() {
  return files.
    map(file => [
      [file, null],
      ...locales.map((locale) => [file, locale]),
    ]).
    flat();
}

function page(filename, locale = null) {
  const destFilename = !locale ? filename : `${locale}/${filename}`;

  return new HtmlWebpackPlugin({
    template: `./${filename}`,
    filename: destFilename,
    inject: 'head',
    minify: true,

    templateParameters: {
      locale: locale || defaultLocale,

      trans: (msgId) => {
        gt.setLocale(locale || defaultLocale);
        return gt.gettext(msgId);
      },

      transPlural: (msgId, msgIdPlural, count) => {
        gt.setLocale(locale || defaultLocale);
        return gt.ngettext(msgId, msgIdPlural, count);
      },
    },

  });

}

function addLocale(locale) {
  const filePath = path.join(localesPath, locale, 'messages.po');

  if (!fs.existsSync(filePath)) {
    return;
  }

  const translation = GetTextParser.po.parse(fs.readFileSync(filePath));
  gt.addTranslations(locale, 'messages', translation);
}

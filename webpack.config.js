const fs = require('fs');
const path = require('path');
const sprintf = require('sprintf-js').sprintf;
const CopyPlugin = require('copy-webpack-plugin');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');
const GetText = require('node-gettext');
const GetTextParser = require('gettext-parser');
const FaviconWebpackPlugin = require('favicons-webpack-plugin');

const sourcePath = path.resolve(__dirname, 'src');
const localesPath = path.resolve(__dirname, 'locales');

const defaultLocale = 'ru';
const locales = ['en'];

const files = [
  ['/', 'book2.html'],
  ['/privacy/', 'privacy.html'],
  ['/book/', '_redirect.html'],
  ['/book2/', '_redirect.html'],
  ['/book/success/', 'book_success.html'],
  //['/v2/', 'v2/index.html'],
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

  let updatePotMsgId;
  if (env && env.updateLocalesPOT) {
    const potFile = fs.openSync(
      path.resolve(__dirname, 'locales', 'messages.pot'),
      'w',
    );
    const usedLabels = [];

    updatePotMsgId = (msgId, msgIdPlural = undefined) => {
      if (usedLabels.includes(msgId)) {
        return;
      }

      fs.writeSync(potFile, `msgid "${msgId}"\n`);
      if (msgIdPlural) {
        fs.writeSync(potFile, `msgid_plural "${msgIdPlural}"\n`);
      }
      fs.writeSync(potFile, 'msgstr ""\n');
      fs.writeSync(potFile, '\n');

      usedLabels.push(msgId);
    };
  }

  function page(url, template, locale = null) {
    return new HtmlWebpackPlugin({
      template: `./${template}`,
      filename: urlToFilename(url, locale),
      inject: 'head',
      minify: true,

      templateParameters: {
        isDefaultLocale: !locale,
        locale: locale || defaultLocale,

        url: (url) => {
          if (url.startsWith('/')) {
            return locale ? `/${locale}${url}` : url;
          }

          return url;
        },

        absoluteUrl: (url) => {
          if (url.startsWith('/')) {
            return 'https://voltz.me' + (locale ? `/${locale}${url}` : url);
          }

          return url;
        },

        sprintf: sprintf,

        trans: (msgId) => {
          updatePotMsgId && updatePotMsgId(msgId);

          gt.setLocale(locale || defaultLocale);
          return gt.gettext(msgId);
        },

        transPlural: (msgId, msgIdPlural, count) => {
          updatePotMsgId && updatePotMsgId(msgId, msgIdPlural);

          gt.setLocale(locale || defaultLocale);
          return gt.ngettext(msgId, msgIdPlural, count);
        },
      },

    });

  }

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
          test: /\.(html)$/,
          include: path.join(__dirname, 'src/views'),
          use: {
            loader: 'html-loader',
            options: {
              interpolate: true,
            },
          },
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
        ([url, template, locale]) => page(url, template, locale),
      ),

      new webpack.DefinePlugin({
        'process.env': {NODE_ENV: JSON.stringify(process.env.NODE_ENV)},
      }),

      new MiniCssExtractPlugin({
        filename: 'assets/[name].[hash].css',
        chunkFilename: 'assets/[name].[hash].css',
        allChunks: true,
      }),

      new FaviconWebpackPlugin({
        logo: './assets/favicon.png',
        prefix: 'assets/favicon-[hash]-',

        title: 'Voltz',
      }),

      new CopyPlugin([
        {
          from: path.resolve(__dirname, 'public'),
          to: '.'
        },
      ]),
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
    map(pair => [
      [...pair, null],
      ...locales.map((locale) => [...pair, locale]),
    ]).
    flat();
}

function urlToFilename(url, locale = null) {
  const baseDir = locale ? `./${locale}` : '.';
  url = url.startsWith('/') ? url.substr(1) : url;

  if (path.extname(url) === 'html') {
    return path.join(baseDir, url);
  }

  return path.join(baseDir, url, 'index.html');
}

function addLocale(locale) {
  const filePath = path.join(localesPath, locale, 'messages.po');

  if (!fs.existsSync(filePath)) {
    return;
  }

  const translation = GetTextParser.po.parse(fs.readFileSync(filePath));
  gt.addTranslations(locale, 'messages', translation);
}

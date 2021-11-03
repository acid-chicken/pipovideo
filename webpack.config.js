const path = require('path')
const webpack = require('webpack')
const EmitPlugin = require('./lib/EmitPlugin')
const WebExtPlugin = require('./lib/WebExtPlugin')
const packageJson = require('./package.json')

/**
 * @callback Configure
 * @arg {Object} env
 * @arg {Object} argv
 * @return {webpack.Configuration}
 */

/**
 * @type {Configure}
 */
module.exports = (env, argv) => ({
  mode: argv.mode || 'production',
  entry: {
    contentScript: require.resolve(path.resolve(__dirname, 'src', 'contentScript.ts')),
  },
  module: {
    rules: [
      {
        test: /\.[jt]s$/,
        use: [
          {
            loader: require.resolve('babel-loader'),
            options: {
              presets: [
                require.resolve('@babel/preset-env'),
                require.resolve('@babel/preset-typescript'),
              ],
            },
          },
        ],
      }
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  output: {
    path: path.resolve(__dirname, 'dist', 'src'),
  },
  plugins: [
    new EmitPlugin('manifest.json', JSON.stringify({
      manifest_version: 2,
      name: packageJson.name,
      version: packageJson.version,
      description: packageJson.description,
      content_scripts: [
        {
          matches: ['https://www.nicovideo.jp/watch/*'],
          js: ['contentScript.js'],
        },
      ],
    })),
    new WebExtPlugin(),
  ],
})

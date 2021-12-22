// eslint-disable-next-line import/no-nodejs-modules
import { join } from 'path'

import ForkCheckerPlugin from 'fork-ts-checker-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import ExtractCssPlugin from 'mini-css-extract-plugin'
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin'
import stylis from 'stylis'
import TerserPlugin from 'terser-webpack-plugin'
import {
  Configuration,
  DefinePlugin,
  HotModuleReplacementPlugin,
} from 'webpack'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
import ReactRefreshPlugin from '@pmmmwh/react-refresh-webpack-plugin'

interface Env {
  analyze?: any
  production?: any
  profile?: any
  profileReact?: any
}

// linaria CSS options
stylis.set({ prefix: false })

export const webpackConfiguration = (env: Env = {}): Configuration => {
  const isProduction = !!env.production || !!env.profileReact
  const analyze = !!env.analyze
  const profile = !!env.profile
  const profileReact = !!env.profileReact

  if (process.env.NODE_ENV === undefined) {
    process.env.NODE_ENV = isProduction ? 'production' : 'development'
  }

  const configuration: Configuration = {
    entry: [
      isProduction && join(__dirname, 'src/polyfills.ts'),
      join(__dirname, 'src/index.tsx'),
    ].filter(Boolean) as [string, ...string[]],
    mode: isProduction ? 'production' : 'development',
    devtool: isProduction ? 'source-map' : 'cheap-module-source-map',
    // https://github.com/webpack/webpack-dev-server/issues/2758
    // https://github.com/pmmmwh/react-refresh-webpack-plugin/issues/235
    target: isProduction ? 'browserslist' : 'web',
    output: {
      path: join(__dirname, 'dist'),
      publicPath: '/',
      globalObject: 'this', // support web workers
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                cacheDirectory: true,
              },
            },
            {
              loader: '@linaria/webpack-loader',
              options: {
                sourceMap: true,
              },
            },
          ],
        },
        {
          test: /\.css$/,
          use: [
            {
              loader: ExtractCssPlugin.loader,
            },
            {
              loader: 'css-loader',
              options: {
                sourceMap: true,
                modules: false,
              },
            },
          ].filter(Boolean),
        },
      ].filter(Boolean) as any,
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js'],
      alias: {
        // transpile from sources in frontend build
        '@remote-mixer/controls': join(__dirname, '../shared/controls/src'),
        '@remote-mixer/utils': join(__dirname, '../shared/utils/src'),
        ...(isProduction
          ? profileReact
            ? {
                'react-dom$': 'react-dom/profiling',
                'scheduler/tracing': 'scheduler/tracing-profiling',
              }
            : {}
          : {}),
      },
    },
    stats: profile ? 'normal' : 'minimal',
    performance: false,
    devServer: {
      client: {
        logging: 'error',
      },
      devMiddleware: {
        publicPath: '/',
      },
      port: 8001,
      open: true,
      allowedHosts: 'all',
      historyApiFallback: true,
      proxy: {
        '/api': {
          target: 'http://localhost:8000/',
        },
        '/websocket': {
          target: 'ws://localhost:8000/',
          ws: true,
        },
      },
    },
    plugins: [
      new DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(
          isProduction ? 'production' : 'development'
        ),
        // needed for emittery dependency
        'process.env.DEBUG': JSON.stringify(false),
      }),
      new HtmlWebpackPlugin({
        template: join(__dirname, 'index.html'),
      }),
      new ExtractCssPlugin({
        ignoreOrder: true,
      }),
      !profile &&
        new ForkCheckerPlugin({
          typescript: {
            enabled: false,
            configFile: join(__dirname, 'tsconfig.json'),
            configOverwrite: {
              compilerOptions: {
                noUnusedLocals: false,
                noUnusedParameters: false,
              },
            },
            mode: 'write-references',
          },
          eslint: {
            enabled: true,
            files: ['**/*.@(ts|tsx)'],
          },
        }),

      // development
      !isProduction && new HotModuleReplacementPlugin(),
      !isProduction &&
        new ReactRefreshPlugin({
          overlay: false,
        }),

      // analyze
      analyze && new BundleAnalyzerPlugin(),
    ].filter(<T>(x: T | false): x is T => !!x),

    optimization: {
      minimizer: [
        new TerserPlugin({
          parallel: true,
          terserOptions: {
            mangle: true,
            ie8: false,
            ...(profileReact
              ? {
                  keep_classnames: true,
                  keep_fnames: true,
                }
              : {}),
          },
        }),
        new CssMinimizerPlugin(),
      ],
      splitChunks: {
        chunks: 'all',
        minSize: 1000,
        maxAsyncRequests: 10,
        cacheGroups: {
          defaultVendors: false,
          styles: {
            name: 'styles',
            type: 'css/mini-extract',
            chunks: 'all',
            enforce: true,
          },
        },
      },
    },
  }

  if (profile) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const SpeedMeasurePlugin = require('speed-measure-webpack-plugin')
    const smp = new SpeedMeasurePlugin()
    return smp.wrap(configuration)
  }

  return configuration
}

export default webpackConfiguration

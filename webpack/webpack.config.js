import _ from 'lodash';
import webpack from 'webpack';
import strategies from './strategies';
import yargs from 'yargs';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

const argv = yargs
  .alias('p', 'optimize-minimize')
  .alias('d', 'debug')
  .argv;

const defaultOptions = {
  development: argv.debug,
  docs: false,
  test: false,
  optimize: argv.optimizeMinimize
};

export default (options) => {
  options = _.merge({}, defaultOptions, options);
  const environment = options.test || options.development ?
    'development' : 'production';
  const cssSourceMap = options.development ? '?sourceMap' : '';
  const cssLoader = `css${cssSourceMap}`;
  const lessLoader = `less${cssSourceMap}`;

  console.log('loaders', cssLoader, lessLoader);

  const config = {
    entry: {
      'app': './src/client.js'
    },

    output: {
      filename: '[name].js',
      path: './built/assets',
      publicPath: '/assets/'
    },

    resolve: {
      extensions: ['', '.js', '.json']
    },

    module: {
      noParse: /babel-core\/browser/,
      loaders: [
        { test: /\.js/, loader: 'babel', exclude: /node_modules/ },
        { test: /\.css/, loader: ExtractTextPlugin.extract('style', cssLoader) },
        { test: /\.less$/, loader: ExtractTextPlugin.extract('style', cssLoader, lessLoader) },
        { test: /\.json$/, loader: 'json' },

        { test: /\.jpe?g$|\.gif$|\.png|\.ico$/, loader: 'file?name=[name].[ext]' },
        { test: /\.eot$|\.ttf$|\.svg$|\.woff2?$/, loader: 'file?name=[name].[ext]' }
      ]
    },

    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          'NODE_ENV': JSON.stringify(environment)
        }
      }),
      new ExtractTextPlugin('[name].css')
    ]
  };

  return strategies.reduce((conf, strategy) => {
    return strategy(conf, options);
  }, config);
};

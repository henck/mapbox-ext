const path               = require('path'),
      webpack            = require('webpack'),
      HtmlWebpackPlugin  = require('html-webpack-plugin'),
      SVGSpritemapPlugin = require('svg-spritemap-webpack-plugin'),
      CopyWebpackPlugin  = require('copy-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: {
    app: ['./src/App.tsx', 'webpack-hot-middleware/client'],
  },
  output: {
    path: path.resolve(__dirname, 'dist'),  // Output directory
    filename: 'js/[name].bundle.js'         // Bundle file name struccture
  },
  devtool: 'source-map',
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.ts', '.tsx']
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        loader: 'ts-loader',
        exclude: /node_modules/
      }, { 
        enforce: "pre", 
        test: /\.js$/, 
        loader: "source-map-loader" 
      }
    ]
  },
  optimization: {
    splitChunks: {
			cacheGroups: {
				commons: {
					test: /[\\/]node_modules[\\/]/,
					name: 'vendors',
					chunks: 'all'
        }
      }
    }
  },
  plugins: [
    new HtmlWebpackPlugin({ template: path.resolve(__dirname, 'src', 'index.html') }),
    new webpack.HotModuleReplacementPlugin(),
    new SVGSpritemapPlugin('svg/**/*.svg', {
      sprite: {
        prefix: false,
        generate: {
          title: false
        },
      },
      output: {
        filename: 'sprites.svg'
      }      
    })
  ]
}
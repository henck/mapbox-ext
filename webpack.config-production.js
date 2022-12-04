const path               = require('path'),
      HtmlWebpackPlugin  = require('html-webpack-plugin'),
      SVGSpritemapPlugin = require('svg-spritemap-webpack-plugin'),
      CopyWebpackPlugin  = require('copy-webpack-plugin');

module.exports = {
  mode: 'production', 
  entry: {
    app: ['./src/App.tsx'],
  },
  output: {
    path: path.resolve(__dirname, 'dist'),  // Output directory
    filename: 'js/[name].bundle.js'         // Bundle file name struccture
  },
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
    usedExports: true,
    minimize: true,
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
    new SVGSpritemapPlugin('svg/**/*.svg', {
      sprite: {
        prefix: false,
        generate: {
          title: false
        }
      },
      output: {
        filename: 'sprites.svg'
      }       
    })
  ]
}
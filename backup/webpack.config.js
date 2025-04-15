const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const fs = require('fs');
const Dotenv = require('dotenv-webpack');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';
  return {
    entry: './src/index.js',
    output: {
      filename: '[name].[contenthash].js',
      chunkFilename: '[name].[contenthash].js',
      path: path.resolve(__dirname, 'dist'),
      publicPath: '/',
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: 'babel-loader',
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.scss$/,
          use: ['style-loader', 'css-loader', 'sass-loader'],
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          type: 'asset/resource',
        },
      ],
    },
    plugins: [
      new Dotenv({
        path: isProduction ? './.env.production' : './.env.development',
      }),
      new HtmlWebpackPlugin({
        template: './src/index.html',
      }),
    ],
    devServer: {
      historyApiFallback: true,
      port: 9000,
      hot: true,
      devMiddleware: {
        writeToDisk: true,
      },
      server: {
        type: 'https',
        options: {
          key: fs.readFileSync(path.resolve(__dirname, 'cert.key')),
          cert: fs.readFileSync(path.resolve(__dirname, 'cert.crt')),
        },
      },
    },
    optimization: {
      splitChunks: {
        chunks: 'all',
      },
    },
  };
};

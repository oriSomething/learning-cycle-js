"use strict";

const path = require("path");
const webpack = require("webpack");
const postcssCssNext = require("postcss-cssnext");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const LodashModuleReplacementPlugin = require("lodash-webpack-plugin");

const NODE_ENV = process.env.NODE_ENV || "development";

module.exports = {
  entry: [
    "./src/main.css",
    "./src/main.js",
  ],
  output: {
    path: path.resolve(__dirname, "assets"),
    filename: "bundle.js",
  },
  module: {
    loaders: [{
      loader: "html",
      test: /\.html$/,
    }, {
      loader: "style!css!postcss",
      test: /\.css$/,
    }, {
      loaders: ["babel"],
      test: /\.js$/,
      exclude: /node_modules/,
    }],
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify(NODE_ENV),
      },
    }),
    new LodashModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: "./src/main.ejs",
    }),
    new webpack.NoErrorsPlugin(),
  ],
  devtool: "eval-source-map",
  postcss() {
    return [
      postcssCssNext({
        features: {
          autoprefixer: {
            browsers: ["last 2 versions"],
          },
        },
      }),
    ];
  },
};

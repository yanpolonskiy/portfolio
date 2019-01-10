"use strict";
const path = require("path");
const webpack = require("webpack");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const autoprefixer = require("autoprefixer");

//const BUILD_MODE = process.env.npm_lifecycle_event;

module.exports = (env, argv) => {
  const NODE_ENV = argv.mode;
  process.env.NODE_ENV = NODE_ENV;
  const devMode = NODE_ENV === "development";
  const BUILD_DATETIME = 0; //moment().format("DD.MM.YYYY HH:mm");

  const APP_TITLE = "polonsky-portfolio";

  const plugins = [];

  if (devMode) {
    plugins.push(new webpack.WatchIgnorePlugin([/less\.d\.ts$/]));
  } else {
    plugins.push(
      new CleanWebpackPlugin(["public"], {
        root: __dirname,
        exclude: ["images"]
      })
    );
    plugins.push(
      new BundleAnalyzerPlugin({
        analyzerMode: "static",
        reportFilename: "../report.html"
      })
    );
  }

  return {
    entry: {
      app: "./src/index.tsx"
    },
    resolve: {
      alias: {
        core: path.resolve(__dirname, "src/core")
      },
      extensions: [".mjs", ".js", ".ts", ".tsx"]
    },
    output: {
      path: path.resolve(__dirname, "public"),
      publicPath: "/",
      filename:
        "scripts/" + (devMode ? "[name].js" : "[name].[chunkhash:7].js"),
      chunkFilename:
        "scripts/" + (devMode ? "[name].js" : "[name].[chunkhash:7].js")
    },
    optimization: {
      runtimeChunk: {
        name: "manifest"
      },
      minimizer: devMode
        ? []
        : [
            new TerserPlugin({
              //cache: true,
              parallel: true
            }),
            new OptimizeCSSAssetsPlugin({})
          ]
    },
    module: {
      rules: [
        {
          test: /\.(js|tsx?)$/,
          exclude: [path.resolve(__dirname, "node_modules")],
          use: [
            "babel-loader"
            //{ loader: "eslint-loader", options: { quiet: !devMode, fix: false } }
          ]
        },
        {
          test: /\.(less|css)$/,
          exclude: [path.resolve(__dirname, "src")],
          use: [
            devMode ? "style-loader" : MiniCssExtractPlugin.loader,
            "css-loader",
            {
              loader: "postcss-loader",
              options: { plugins: () => [autoprefixer()] }
            },
            {
              loader: "less-loader",
              options: { javascriptEnabled: true, relativeUrls: true }
            }
          ]
        },
        {
          test: /\.(less|css)$/,
          exclude: [path.resolve(__dirname, "node_modules")],
          use: [
            devMode ? "style-loader" : MiniCssExtractPlugin.loader,
            {
              loader: "typings-for-css-modules-loader",
              options: {
                modules: true,
                localIdentName: "[local]--[hash:base64:5]",
                camelCase: "dashes",
                namedExport: "camelCase"
              }
            },
            {
              loader: "postcss-loader",
              options: { plugins: () => [autoprefixer()] }
            },
            {
              loader: "less-loader",
              options: { javascriptEnabled: true, relativeUrls: true }
            }
          ]
        },
        {
          test: /\.(png|jpg|svg)$/,
          loader: "url-loader",
          options: {
            limit: 8192,
            name: "img/[name].[ext]"
          }
        },
        {
          test: /\.(eot|ttf|woff|woff2)$/,
          loader: "url-loader",
          options: {
            limit: 1,
            name: "fonts/[name].[ext]"
          }
        }
      ]
    },
    plugins: [
      new CopyWebpackPlugin([{ from: "src/images", to: "images" }]),
      new MiniCssExtractPlugin({
        filename:
          "styles/" + (devMode ? "[name].css" : "[name].[contenthash:7].css"),
        chunkFilename:
          "styles/" + (devMode ? "[name].css" : "[name].[contenthash:7].css")
      }),
      new webpack.DefinePlugin({
        APP_TITLE: JSON.stringify(APP_TITLE),
        BUILD_DATETIME: JSON.stringify(BUILD_DATETIME),
        "process.env": {
          NODE_ENV: JSON.stringify(NODE_ENV)
        }
      }),
      new HtmlWebpackPlugin({
        chunks: ["manifest", "vendors", "app"],
        title: APP_TITLE,
        minify: false,
        filename: path.resolve(__dirname, "public/index.html"),
        template: path.resolve(__dirname, "src/index.ejs"),
        inject: "body",
        chunksSortMode: "manual",
        xhtml: true
      }),
      new webpack.HashedModuleIdsPlugin({
        hashDigestLength: 7
      }),
      ...plugins
    ],
    devtool: devMode && "eval",
    stats: {
      children: false,
      colors: true
    },
    devServer: {
      port: 8080,
      contentBase: path.resolve(__dirname, "public"),
      publicPath: "/",
      open: true,
      overlay: true,
      historyApiFallback: true
    }
  };
};

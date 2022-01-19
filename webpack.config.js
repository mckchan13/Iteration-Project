const path = require("path");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const { node } = require("webpack");
const Dotenv = require("dotenv-webpack");

module.exports = {
  mode: process.env.NODE_ENV,
  entry: ["regenerator-runtime/runtime.js", "/client/index.js"],
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
          },
        },
      },
      {
        test: /\.(sa|sc|c)ss$/i,
        exclude: /node_modules/,
        use: [
          "style-loader",
          // Translates CSS into CommonJS
          "css-loader",
          // Needed for tailwind
          "postcss-loader",
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: "./client/index.html",
    }),
    new Dotenv(),
  ],
  devServer: {
    static: {
      //directory: path.resolve(__dirname, 'build'),
      publicPath: "/build",
    },
    //historyApiFallback allows the react router to render specific pages without going server-side
    //essentially we can refresh or go forward/back from non-root domain pages and allow the react-router
    //to render client-side
    historyApiFallback: true,
    proxy: {
      "/api/auth/**": "http://localhost:3000/",
      "/api/athlete/**": "http://localhost:3000/",
      "/api/post/**": "http://localhost:3000/",
      "/api/search/**": "http://localhost:3000/",
    },
  },
};

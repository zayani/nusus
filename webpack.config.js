const path = require("path");

module.exports = {
  mode: "development",
  // watch: true,
  entry: {
    cm: "./dist/cm/main.js",
  },
  devtool: "inline-source-map",
  devServer: {
    port: 9000,
    static: "./dist",
    watchFiles: ["./index.html"],
  },
  experiments: {
    outputModule: true,
  },
  output: {
    module: true,
    filename: "_/[name].js",
    path: path.resolve(__dirname, "dist"),
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
};

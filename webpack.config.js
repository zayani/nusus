const path = require("path");

module.exports = {
  mode: "development",
  entry: {
    main: "./src/main.js",
    //start: "./src/start.js",
  },
  devtool: "inline-source-map",
  devServer: {
    port: 9000,
    static: "./dist",
  },
  experiments: {
    //outputModule: true,
  },
  output: {
    //module: true,
    filename: "[name].js",
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

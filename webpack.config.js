module.exports = {
  mode: "production",
  devtool: "cheap-module-source-map",
  context: __dirname + "/src",
  entry: "./k-util.js",
  output: {
    path: __dirname + "/dist",
    filename: "k-util.js",
    library: {
      name: "kutil",
      type: "umd2",
      export: "default"
    },
    globalObject: "this"
  },
  module: {
    rules: [
      {
        test: /\.?js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [["@babel/preset-env"]]
          }
        }
      }
    ]
  }
};

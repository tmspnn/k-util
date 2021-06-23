module.exports = {
  mode: "production",
  devtool: false,
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
    rules: []
  }
};

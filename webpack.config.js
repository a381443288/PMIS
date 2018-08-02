var webpack = require('webpack');
var glob = require('glob');

function getEntry() {
    var entry = {};
    glob.sync(__dirname + "/app/js/*.main.js").forEach(function (file) {
        var name = file.match(/([^/]+?)\.main\.js/)[1];
        entry[name] = __dirname + "/app/js/" + name + ".main.js";
    });
    return entry;
}

module.exports = {
  entry: getEntry(),
  output: {
    path: __dirname + "/build/js",
    filename: '[name].js'
  },
  module: {
    loaders: [
      {test: /\.css$/, loader: 'style-loader!css-loader'}
    ]
  }
}
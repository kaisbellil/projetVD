const path = require('path');const HtmlWebpackPlugin = require('html-webpack-plugin');

plugins: [

    new HtmlWebpackPlugin({
        template: './public/index.html',
        filename: 'index.html',
        inject: 'body'
    }),
  
    new HtmlWebpackPlugin({
        template: './public/index.html',
        filename: 'index.html'
    }),
  
    new UglifyJsPlugin(),
  
  ]


module.exports = {
    name: 'browser',
    mode: 'development',
    entry: {
        index : './src/index.js',
        map : './src/map.js'
    },
    output: {
        path: path.resolve('dist'),
        filename: 'index_bundle.js'
    },
    module: {
        rules: [
            { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ }
        ]
    },
    plugins: [HtmlWebpackPluginConfig]
}
const path = require('path');const HtmlWebpackPlugin = require('html-webpack-plugin');

/*
const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
    template: './public/index.html',
    filename: 'index.html',
    inject: 'body'
})
*/
plugins: [

    new HtmlWebpackPlugin({
        template: './public/index.html',
        filename: 'index.html',
        inject: 'body'
    }),
  
    new HtmlWebpackPlugin({
        template: './public/map.html',
        filename: 'inmapdex.html'
    }),
  
    new UglifyJsPlugin(),
  
  ]


module.exports = {
    name: 'browser',
    mode: 'development',
    entry: './src/index.js',
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
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

/*
const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
    template: './public/index.html',
    filename: 'index.html',
    inject: 'body'
})
*/

module.exports = {
    name: 'browser',
    mode: 'development',
    entry: {
        index: './src/index.js',
        map: './src/map.js'
    },
    output: {
        path: path.resolve('dist'),
        filename: '[name].bundle.js'
    },
    module: {
        rules: [
            { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ },
            {test: /\.csv$/, loader: 'csv-loader', options: {
                    dynamicTyping: true,
                    header: true,
                    skipEmptyLines: true
                }
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './public/index.html',
            chunks: 'index',
            excludeChunks: ['map'],
            filename: 'index.html',
            inject: 'body'
            
        }),
        new HtmlWebpackPlugin({
            template: './public/map/index.html',
            chunks: 'map',
            excludeChunks: ['index'],
            filename: 'map/index.html',
            inject: 'body'
            
        })
    ]
}
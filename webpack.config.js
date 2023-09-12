const HtmlWebpack = require('html-webpack-plugin')
const path = require('path')

module.exports = {

    mode: 'development',
    entry: './src/main.js',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist')
    },
    plugins: [
        new HtmlWebpack ({
            filename: 'index.html',
            template: './src/index.html'
        })
    ]
}
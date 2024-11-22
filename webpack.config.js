const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
        clean: true,
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i, // Existing rule for images
                type: 'asset/resource',
            },
            {
                test: /\.mid$/, // New rule for .mid files
                type: 'asset/resource', // Use asset/resource to handle .mid files
                generator: {
                    filename: 'assets/music/[name][ext]', // Output path for .mid files
                },
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
        }),
    ],
    devServer: {
        static: {
            directory: path.resolve(__dirname, 'dist'),
        },
        open: true,
        port: 9000,
    }
};

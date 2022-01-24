const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { merge } = require('webpack-merge');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const baseConfig = {
    entry: path.resolve(__dirname, './index.ts'),
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.[tj]s$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.js', '.ts'],
    },
    output: {
        filename: 'app.js',
        path: path.resolve(__dirname, 'dist'),
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'index.html'),
            filename: 'index.html',
        }),
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin([
            { context: './assets/', from: '**/*', to: './assets/' },
            { from: './style.css', to: './' }
        ]),

    ],
};

module.exports = ({ mode }) => {
    const isProductionMode = mode === 'prod';
    if (isProductionMode) {
        return baseConfig;
    } else {
        const devConfig = require('./webpack.dev.config');
        return merge(baseConfig, devConfig);
    }
};
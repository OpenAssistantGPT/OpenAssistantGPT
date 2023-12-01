const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
    entry: './src/index.jsx', // Your entry point
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.min.js' // Output file
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/, // Regex to match JS and JSX files
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react']
                    }
                }
            }
        ]
    },
    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin()]
    },
    resolve: {
        extensions: ['.js', '.jsx'],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html' // Your HTML file
        })
    ]
};

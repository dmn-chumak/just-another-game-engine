const Path = require('path');

module.exports = {
    entry: './src/index.ts',
    mode: 'development',
    devtool: 'cheap-module-source-map',
    module: {
        rules: [
            {
                test: /\.glsl$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'webpack-glsl-minify',
                        options: {
                            esModule: false,
                            preserveUniforms: true,
                            preserveDefines: true,
                            preserveVariables: false,
                            output: 'source'
                        }
                    }
                ]
            },
            {
                test: /\.ts(x?)$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'ts-loader'
                    }
                ]
            }
        ]
    },
    resolve: {
        extensions: [ '.ts', '.js' ]
    },
    optimization: {
        usedExports: true
    },
    output: {
        filename: 'engine.js',
        path: Path.resolve('./output')
    }
};

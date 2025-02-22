// webpack.config.js (đã chuyển sang ES module)
import path from 'path';
import webpackNodeExternals from 'webpack-node-externals';

export default {
  entry: './src/app.ts',
  target: 'node16', // hoặc node18
  output: {
    filename: 'bundle.js',
    path: path.resolve(process.cwd(), 'dist'),
    module: true,
    library: { type: 'module' },
  },
  externals: [webpackNodeExternals()],
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      '@': path.resolve(process.cwd(), 'src'),
    },
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  mode: 'production',
  experiments: {
    outputModule: true,
  },
};

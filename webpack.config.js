const path = require('path');
const webpackNodeExternals = require('webpack-node-externals');

module.exports = {
  entry: './src/app.ts', // Điểm vào của ứng dụng
  target: 'node', // Đảm bảo Webpack tạo bundle cho Node.js
  output: {
    filename: 'bundle.js', // Tên file xuất ra
    path: path.resolve(__dirname, 'dist'), // Thư mục xuất ra
  },
  externals: [webpackNodeExternals()], // Loại trừ các module node.js khỏi bundle
  resolve: {
    extensions: ['.ts', '.js'], // Xử lý các file .ts và .js
    alias: {
      '@': path.resolve(__dirname, './'), // Cấu hình alias để sử dụng '@' trong import
    },
  },
  module: {
    rules: [
      {
        test: /\.ts$/, // Tìm các file TypeScript
        use: 'ts-loader', // Sử dụng ts-loader để biên dịch TypeScript thành JavaScript
        exclude: /node_modules/,
      },
    ],
  },
  mode: 'production', // Chạy Webpack ở chế độ production
  resolveLoader: {
    alias: {
      'ts-loader': 'ts-loader', // Đảm bảo loader sử dụng đúng ts-loader
    },
  },
};

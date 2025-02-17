import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import unusedImports from 'eslint-plugin-unused-imports';

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ['**/*.{js,mjs,cjs,ts}'] },
  { files: ['**/*.js'], languageOptions: { sourceType: 'script' } },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    // Thêm plugin unused-imports
    plugins: { 'unused-imports': unusedImports },
    rules: {
      // Nếu có import không dùng thì báo lỗi (và ESLint có thể tự fix nếu hỗ trợ)
      'unused-imports/no-unused-imports': 'error',
      // Tắt rule no-unused-vars mặc định và sử dụng rule của plugin để xử lý biến không dùng
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          args: 'after-used',
          ignoreRestSiblings: true,
          varsIgnorePattern: '^_', // nếu bạn muốn bỏ qua các biến bắt đầu bằng _
        },
      ],
    },
  },
];

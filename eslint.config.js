const typescriptParser = require('@typescript-eslint/parser');
const typescriptPlugin = require('@typescript-eslint/eslint-plugin');
const unusedImportsPlugin = require('eslint-plugin-unused-imports');

module.exports = [
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': typescriptPlugin,
      'unused-imports': unusedImportsPlugin,
    },
    rules: {
      'no-unused-vars': 'off', // turned off as it's reported by @typescript-eslint/no-unused-vars
      '@typescript-eslint/no-unused-vars': 'off', // turned off in favor of unused-imports/no-unused-vars
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        { 
          vars: 'all', 
          varsIgnorePattern: '^_', 
          args: 'after-used', 
          argsIgnorePattern: '^_' 
        }
      ],
    },
  },
];

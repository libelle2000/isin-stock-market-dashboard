module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    project: './tsconfig.json',
  },
  plugins: ['@typescript-eslint', 'unused-imports'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ],
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
};
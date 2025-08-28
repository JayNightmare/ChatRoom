module.exports = {
  root: true,
  ignorePatterns: ['dist', 'node_modules'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/strict',
  ],
  env: { node: true, es2022: true, browser: true },
  rules: {
    'no-console': 'off'
  }
};
